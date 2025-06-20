var mysql = require('mysql');
var pool = require('./DBConnectionModel').returnPoolConnectionOld();
var poolAsync = require('./DBConnectionModel').returnPoolConnection();

var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var clientObj = Client.init('4b42e074-4d98-4592-95a3-c78a0da66d15');
clientObj.setRequestTimeout(3000);
var Checkout = coinbase.resources.Checkout;
let dealsModel = require('./DealsModel')


class ObligationsModel {
    constructor() {}

    getUserUnPaidObligations(userId) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT *, comissions.id as comissionId, DATE_FORMAT(comissions.date_created, '%d.%m.%Y') as superCreateDate, c.name as cryptoname, c.short_code as crypto_shortCode, f.name as fiatName, f.short_name as fiat_shortCode FROM `comissions` " +
                 "LEFT JOIN `cryptolist` `c` ON comissions.crypto_id = c.id " +
                "LEFT JOIN `fiat_list` `f` ON comissions.fiat_id = f.id " +
                " WHERE `seller_id` = ? AND `paid` = 0", userId, function (error, results, fields) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                }
            })
        })
    }

    async getAllPayments(userId) {
        try {
            var results = await poolAsync.query("SELECT *, DATE_FORMAT(payments.paid, '%d.%m.%Y, %H:%i') as paidF, DATE_FORMAT(payments.weInitiated, '%d.%m.%Y, %H:%i') as weInitiatedF FROM payments WHERE userId = ? ORDER BY id DESC", [userId])
        } catch (e) {
            throw e
        }

        return results;
    }

    getFinalComission(deals) {
        let summ = 0;
        deals.forEach(oneDeal => {
            summ = summ + (oneDeal.amountNeeded*oneDeal.sellingCurrencyObj.rateToEur)/100
        });

        return summ.trimNum(2)
    }

    async sealPayment(sealObj, userObj) {

        try {
            var deals = await dealsModel.getUserDeals(userObj.id)
        } catch (e) {
            throw e
        }

        var finalComissionSecured = this.getFinalComission(deals);

        if (sealObj.paymentMethod === 'PlatonCoin') {
            finalComissionSecured = ((finalComissionSecured*0.9)/0.23).trimNum(4)    // 10% discount
        }

        if (sealObj.totalAmount !== finalComissionSecured) {
            throw new Error('You are trying to pay an amount that does not match what we have in the system. Try refreshing the page, maybe you have a new Commission for payment.')
        }

        if (isNaN(parseFloat(finalComissionSecured)) || parseFloat(finalComissionSecured) <= 0) {
            throw new Error('bad comission amount')
        }

        if (sealObj.paymentMethod === 'PlatonCoin') {
            try {
                var result = await poolAsync.query("INSERT INTO `payments` (`userId`, `amount`, `paymentMethod`, weInitiated, possibleTxHash, possiblePaidFromAddress) VALUES (?, ?, ?, NOW(), ?,?)", [userObj.id, finalComissionSecured, sealObj.paymentMethod, sealObj.txHash, sealObj.walletPaidFrom])
            } catch (e) {
                throw e
            }
        } else {
            try {
                var result = await poolAsync.query("INSERT INTO `payments` (`userId`, `amount`, `paymentMethod`, weInitiated) VALUES (?, ?, ?, NOW())", [userObj.id, finalComissionSecured, sealObj.paymentMethod])
            } catch (e) {
                throw e
            }
        }




        // mark deal as sealed to payment
        await Promise.all(deals.map(async (oneDeal) => {
            try {
                var setWhenTriggeredToPay = await poolAsync.query("UPDATE `localdb`.`deals` t SET t.`comissionRequestedWhen` = NOW(), comissionRequestId = ? WHERE t.`id` = ?", [result.insertId, oneDeal.dealId])
            } catch (e) {
                throw e
            }
        }));


        try {
            var paymentObjArr = await poolAsync.query("SELECT *, DATE_FORMAT(payments.paid, '%d.%m.%Y, %H:%i') as paidF, DATE_FORMAT(payments.weInitiated, '%d.%m.%Y, %H:%i') as weInitiatedF FROM payments WHERE id = ?", [result.insertId])
        } catch (e) {
            throw e
        }

        let paymentObj = paymentObjArr[0];


        return {vs: result.insertId, realAmount: finalComissionSecured, paymentObj}
    }

    generateCoinBaseCheckout(paymentId, amount) {
        return new Promise((resolve, reject) => {
        var checkoutObj = new Checkout();

        checkoutObj.name = 'Payment for invoice N.: '+paymentId+'.';
        checkoutObj.description = 'Payment of Commission on the website localcrypto.cloud.';
        checkoutObj.pricing_type = 'fixed_price';
        checkoutObj.local_price = {
            'amount': `${amount}`,
            'currency': 'EUR'
        };
        checkoutObj.requested_info = ['name'];

        checkoutObj.save(function (error, responsecheckoutObj) {
            if (error) {
                console.log('checkoutObj.save error:', error);
                return reject(error);
            } else {
                console.log("responsecheckoutObj: ",responsecheckoutObj);
                return resolve(responsecheckoutObj);
            }

        });
        })
    }

    async setCoinBaseIdToInvoice(paymentId, coinBaseId) {
        try {
            var result = await poolAsync.query("UPDATE `payments` t SET t.`coinbaseiD` = ? WHERE t.`id` = ?", [coinBaseId, paymentId])
        } catch (e) {
            throw e
        }
        if (result.affectedRows > 0) {
            return 'Success set coinbase id'
        } else {
            throw new Error('Error, cannot update coinbase id in payments table');
        }
    }



    async setReservedToOneDealComission(dealId) {
        try {
            var result = await poolAsync.query("UPDATE `comissions` t SET t.`reserved` = 1 WHERE t.`sell_deal_id` = ?", [dealId])
        } catch (e) {
            throw new Error(e);
        }
        return result.affectedRows;
    }

    async searchPaymentByCoinBaseId(coinbaseId) {
        if (typeof coinbaseId === "string" && coinbaseId.length > 3) {
            try {
                var result = await poolAsync.query("SELECT * FROM payments where coinbaseiD = ?", [coinbaseId])
            } catch (e) {
                throw e
            }

            if (result.length > 0) {
                return result[0]
            } else {
                throw new Error('no such transaction');
            }
        } else {
            throw new Error('bad coinbase id');
        }

    }
    async setCoinBasePaymentAsConfirmed(paymentId) {
        try {
            var result = await poolAsync.query("UPDATE payments SET coinbaseConfirmedAt = NOW(), paid = NOW() WHERE id = ?", paymentId)
        } catch (e) {
            throw e
        }

        return result.affectedRows;
    }

    async markDealsAsComissionPaid(paymentInternalId) {

        try {
            var allDeals = await poolAsync.query("SELECT * FROM localdb.deals WHERE comissionRequestId = ?", [paymentInternalId])
        } catch (e) {
            throw e
        }

        await Promise.all(allDeals.map(async (oneDeal) => {
            try {
                var result = await poolAsync.query("UPDATE deals SET commisionPaidWhen = NOW() WHERE id = ?", [oneDeal.id])
            } catch (e) {
                throw e
            }
        }));

        return 'success setted as paid';
    }

    async unmarkDealsAsComissionPaid(paymentInternalId) {

        try {
            var allDeals = await poolAsync.query("SELECT * FROM localdb.deals WHERE comissionRequestId = ?", [paymentInternalId])
        } catch (e) {
            throw e
        }

        await Promise.all(allDeals.map(async (oneDeal) => {
            try {
                var result = await poolAsync.query("UPDATE deals SET commisionPaidWhen = null, comissionRequestedWhen = null, comissionRequestId = null WHERE id = ?", [oneDeal.id])
            } catch (e) {
                throw e
            }
        }));

        return 'success setted as paid';
    }


    async setCoinBasePaymentAsStarted(paymentId) {
        try {
            var result = await poolAsync.query("UPDATE payments SET coinbaseCreatedAt = NOW() WHERE id = ?", paymentId)
        } catch (e) {
            throw e
        }

        return result.affectedRows;
    }

    async setCoinBaseAsExpired(paymentId) {
        try {
            var result = await poolAsync.query("UPDATE payments SET coinbaseExpired = NOW() WHERE id = ?", [paymentId])
        } catch (e) {
            throw e
        }
        return result.affectedRows;
    }

    async setCoinBaseAsFailed(paymentId) {
        try {
            var result = await poolAsync.query("UPDATE payments SET coinbaseFailed = NOW() WHERE id = ?", [paymentId])
        } catch (e) {
            throw e
        }
        return result.affectedRows;
    }

    async setCoinBaseAsDelayed(paymentId) {
        try {
            var result = await poolAsync.query("UPDATE payments SET coinbaseDelayed = NOW() WHERE id = ?", [paymentId])
        } catch (e) {
            throw e
        }
        return result.affectedRows;
    }

}
module.exports = new ObligationsModel();
