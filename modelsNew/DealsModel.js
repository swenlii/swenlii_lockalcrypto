var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
let emailModel = require('./EmailModel');
let isNumeric = require("isnumeric");

class DealsModel {
    constructor() {
    }

    async initiateTransaction(buyersObj, dealObj) {
        // some validation

        if (isNumeric(dealObj.neededAmount) === false || isNumeric(dealObj.infoPayAmount) === false || isNumeric(dealObj.offerObj.user_id) === false) {
            throw new Error('validation error: something is not number')
        }

        if (parseFloat(dealObj.neededAmount) < 0  || parseFloat(dealObj.infoPayAmount) < 0 || parseInt(dealObj.offerObj.user_id) < 0) {
            throw new Error('validation error: something less than zero')
        }
        // TODO: offerObj best to take from DB, not from client front-end

        if (!dealObj.dealDate) {
            throw new Error('Error with deal date')
        }

        let dealDate = 'today';
        if (dealObj.dealDate === 'Tomorrow') {
            dealDate = 'tomorrow'
        }
        let spendCurrencyType = 'fiat';
        let spendCurrencyId = 0;

        if (dealObj.offerObj.offerType === 'exch') {
            spendCurrencyType = 'crypto'
            spendCurrencyId = dealObj.offerObj.exchangeFirstCoinId
        } else {

            if (!dealObj.offerObj.fiat_id || isNaN(parseInt(dealObj.offerObj.fiat_id)) === true|| parseInt(dealObj.offerObj.fiat_id) <= 0) {
                throw new Error('bad fiat id')
            } else {
                spendCurrencyId = dealObj.offerObj.fiat_id
            }

        }



        try {
            var result = await pool.query("INSERT INTO deals (sellerId, buyerId, offerId, amountNeeded, amountSpend, offerType, generatedDate, spendCurrencyType, spendCurrencyId, choosedPaymentOption, todayOrTomorrow, spendCurrencyShortCode) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?,?)", [dealObj.offerObj.user_id, buyersObj.id, dealObj.offerObj.offerId, dealObj.neededAmount, dealObj.infoPayAmount, dealObj.offerObj.offerType, spendCurrencyType, spendCurrencyId, dealObj.choosedPaymentOption, dealDate, dealObj.infoCurrency])
        } catch (e) {
            throw e
        }

        if (result.insertId > 0) {
            return { insertId: result.insertId, sellerId: dealObj.offerObj.user_id, offerId: dealObj.offerObj.offerId }
        } else {
            throw new Error('Error inserting offer')
        }
    }

    async getAllUserDeals (userId) {
        try {
            var result = await pool.query(`SELECT deals.id FROM localdb.deals WHERE deals.sellerId = ? OR deals.buyerId = ?`, [userId, userId])
            return {deals: result, id: userId}
        } catch (e) {
            throw e
        }
    }

    async getUserDeals(userId) {

        try {
            var result = await pool.query(`SELECT deals.*,
                                                  deals.id      as dealId,
                                                  deals.buyerId as buyerId,
                                                  users.name    as buyerName,
                                                  users.surname as buyerSurname,
                                                  users.avatarPath as buyerAvatar,
                                                  reviews.authorId, reviews.toUserId,  reviews.text as reviewComment,                                                     
                                                DATE_FORMAT(deals.generatedDate, '%d.%m.%Y, %H:%i') AS  generatedDateF,
                                                  DATE_FORMAT(deals.paidDate, '%d.%m.%Y, %H:%i') AS  paidDateF,
       sell_offers.cryptocurrency_id as sellingCryptoId,
                                                  sell_offers.priceType as sPriceType ,
                                                  sell_offers.dynamicPercent as sDynamicPercent,
                                                  sell_offers.exchange_rate as sExchangeRate 
                                           FROM deals
                                                    LEFT JOIN users ON (users.id = deals.buyerId)
LEFT JOIN localdb.sell_offers ON( deals.offerId = sell_offers.id) 
                                                    LEFT JOIN localdb.reviews ON( deals.id = reviews.dealId AND reviews.authorId = ?) 
                                           WHERE (deals.sellerId = ?)
                                             `, [userId, userId, userId])
        } catch (e) {
            throw e
        }



        try {
            var result2 = await pool.query(`SELECT deals.*,
                                                  deals.id      as dealId,
                                                  deals.buyerId as buyerId,
                                                  users.name    as buyerName,
                                                  users.surname as buyerSurname,
                                                  users.avatarPath as buyerAvatar,
                                                  reviews.authorId, reviews.toUserId,  reviews.text as reviewComment,                                                     
                                                DATE_FORMAT(deals.generatedDate, '%d.%m.%Y, %H:%i') AS  generatedDateF,
                                                  DATE_FORMAT(deals.paidDate, '%d.%m.%Y, %H:%i') AS  paidDateF,
       sell_offers.cryptocurrency_id as sellingCryptoId,
                                                  sell_offers.priceType as sPriceType ,
                                                  sell_offers.dynamicPercent as sDynamicPercent,
                                                  sell_offers.exchange_rate as sExchangeRate 
                                           FROM deals
                                                    LEFT JOIN users ON (users.id = deals.sellerId)
LEFT JOIN localdb.sell_offers ON( deals.offerId = sell_offers.id) 
                                                    LEFT JOIN localdb.reviews ON( deals.id = reviews.dealId AND reviews.authorId = ?) 
                                           WHERE ( deals.buyerId = ?)
                                             `, [userId, userId, userId])
        } catch (e) {
            throw e
        }

        result = result.concat(result2);

        await Promise.all(result.map(async (oneDeal) => {
            let tableName = 'fiat_list';

            if (oneDeal.offerType === 'exch') {
                tableName = 'cryptolist'
            }

            try {
                var goTakeCurrency = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [oneDeal.spendCurrencyId]);
                var goTakeSellingCurrency = await pool.query(`SELECT * FROM localdb.cryptolist WHERE id = ?`, [oneDeal.sellingCryptoId])
            } catch (e) {
                throw e
            }

            if (goTakeCurrency.length === 0 || goTakeSellingCurrency.length === 0) {
                throw new Error('strange error in finding currency-z:'+ goTakeCurrency+' '+ goTakeSellingCurrency)
            } else {
                oneDeal.buyingCurrencyObj = goTakeCurrency[0];
                oneDeal.sellingCurrencyObj = goTakeSellingCurrency[0];
                // fix some sheet
                if (!oneDeal.buyingCurrencyObj.short_code) {
                    oneDeal.buyingCurrencyObj.short_code = oneDeal.buyingCurrencyObj.short_name
                }

            }

        }));

        return result
    }

    async getPaidUserDeals(userId) {

        try {
            var result = await pool.query(`SELECT deals.*,
                                                  deals.id      as dealId,
                                                  users.id      as buyerId,
                                                  users.name    as buyerName,
                                                  users.surname as buyerSurname,
                                                                               
                                                DATE_FORMAT(deals.generatedDate, '%d.%m.%Y, %H:%i') AS  generatedDateF,
                                                  DATE_FORMAT(deals.paidDate, '%d.%m.%Y, %H:%i') AS  paidDateF,
       sell_offers.cryptocurrency_id as sellingCryptoId,
                                                  sell_offers.priceType as sPriceType ,
                                                  sell_offers.dynamicPercent as sDynamicPercent,
                                                  sell_offers.exchange_rate as sExchangeRate 
                                           FROM deals
                                                    LEFT JOIN users ON (users.id = deals.buyerId)
LEFT JOIN localdb.sell_offers ON( deals.offerId = sell_offers.id) 
                                                  
                                           WHERE deals.sellerId = ? AND (deals.commisionPaidWhen >= (CURDATE() - INTERVAL 1 DAY) OR deals.commisionPaidWhen IS NULL)
                                             `, [userId, userId])
        } catch (e) {
            throw e
        }

        await Promise.all(result.map(async (oneDeal) => {
            let tableName = 'fiat_list';

            if (oneDeal.offerType === 'exch') {
                tableName = 'cryptolist'
            }

            try {
                var goTakeCurrency = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [oneDeal.spendCurrencyId]);
                var goTakeSellingCurrency = await pool.query(`SELECT * FROM localdb.cryptolist WHERE id = ?`, [oneDeal.sellingCryptoId])
            } catch (e) {
                throw e
            }

            if (goTakeCurrency.length === 0 || goTakeSellingCurrency.length === 0) {
                throw new Error('strange error in finding currency-z:'+ goTakeCurrency+' '+ goTakeSellingCurrency)
            } else {
                oneDeal.buyingCurrencyObj = goTakeCurrency[0];
                oneDeal.sellingCurrencyObj = goTakeSellingCurrency[0];
                // fix some sheet
                if (!oneDeal.buyingCurrencyObj.short_code) {
                    oneDeal.buyingCurrencyObj.short_code = oneDeal.buyingCurrencyObj.short_name
                }

            }

        }));

        return result
    }

    async isUserHasRightsToAcessDeal(userId, dealId) {
        if (!dealId || isNaN(parseInt(dealId)) || parseInt(dealId) <= 0) {
            throw new Error('bad deal id')
        }

        try {
            var result = await pool.query("SELECT id FROM deals WHERE (sellerId = ? OR buyerId = ?) AND id = ?", [userId, userId, dealId])
        } catch (e) {
            throw e
        }
        if (result.length > 0) {
            return userId
        } else {
            throw new Error('use has not rights to access this deal')
        }
    }

    async getDealObj(dealId, userId) {
        if (!dealId) {
            throw new Error('bad deal id')
        }


        try {
            var result = await pool.query("SELECT id, sellerId, buyerId, offerId, amountNeeded, amountSpend, closedDeal, offerType, generatedDate, paidDate, busyDeal, wasDealViewedByOwner, wasRevieved, DATE_FORMAT(deals.paidDate, '%d.%m.%Y, %H:%i') AS  paidDateF FROM deals WHERE id = ?", [dealId])
        } catch (e) {
            throw e
        }

        if (result.length > 0 ) {
            if (result[0].wasDealViewedByOwner === 0) {
                try {
                    var update = await pool.query("UPDATE deals SET wasDealViewedByOwner = 1 WHERE id = ?", [dealId]);
                } catch (e) {
                    throw e
                }
            }

            try {
                var user = await pool.query("SELECT users.name, users.surname, users.avatarPath FROM users WHERE id = ?", [result[0].sellerId === userId ? result[0].buyerId : result[0].sellerId]);
            } catch (e) {
                throw e
            }

            result[0].user = user[0];

            return result[0]
        } else {
            throw new Error('No such deal exist in database')
        }

    }

    async cancelDeal(dealId, initiatedUserId) {
        try {
            var dealObj = await this.getDealObj(dealId)
        } catch (e) {
            throw e
        }

        if (dealObj.paidDate || dealObj.closedDeal === 1) {
            throw new Error('Deal was paid or was already closed')
        }

        let role = 'seller';
        if (dealObj.buyerId === initiatedUserId) {
            role = 'buyer'
        }

        try {
            var setDealAsCancel = await pool.query("UPDATE `localdb`.`deals` t SET t.`closedDeal` = 1, t.`closedByWhoId` = ?, t.`closedByWhoRole` = ? WHERE t.`id` = ?", [initiatedUserId, role, dealId])
        } catch (e) {
            throw e
        }

        return role

    }

    async setDealAsPaid(dealId) {
        if (!dealId || isNaN(parseInt(dealId)) || parseInt(dealId) <= 0) {
            throw new Error('bad deal')
        }

        try {
            var dealObjToCheck = await this.getDealObj(dealId)
        } catch (e) {
            throw e
        }

        if (dealObjToCheck.paidDate) {
            throw new Error('Deal was already paid')
        }

        if (dealObjToCheck.closedDeal === 1) {
            throw new Error('Deal was cancelled. It cannot be paid.')
        }

        try {
            var result = await pool.query("UPDATE localdb.deals SET deals.paidDate = NOW() WHERE id = ?", [dealId])
        } catch (e) {
            throw e
        }

        try {
            var dealObj = await this.getDealObj(dealId)
        } catch (e) {
            throw e
        }

        return  dealObj

    }



        getDealMessages(req, res) {
        dealsModel.canUserAccessDeal(req.userObj.id, req.params.dealId)
            .then(dealObj => {
                req.io.sockets.on('connection', function (socket) {
                    console.log("connect user to socket inside showDealOffer");
                    socket.join(dealObj.hash); // connect user to socket
                });

                let chatIsClosed = false;
                if (dealObj.deal_is_closed === 1) {
                    chatIsClosed = true;
                }
                let messagesArr;
                    req.redisClient.lrange('deal'+req.params.dealId, 0, -1, function(err, replyArr) {
                        messagesArr = replyArr;
                        let isUserBueyr = false; // mistake, lazy to fix )
                        let isDealClosed = false;
                        if (req.userObj.id == dealObj.buyer_id) { isUserBueyr = true; }
                        console.log("dealObj:" , dealObj);
                        if (dealObj.deal_is_closed == 1) { isDealClosed = true; }
                        res.render('dealConversation', { dealId: dealObj.id, messagesArr : messagesArr, isUserBueyr : isUserBueyr, isDealClosed : isDealClosed, userObj : req.userObj, chatIsClosed, userObligations : req.userObligations, dealObj });
                    });
            })
            .catch(error => {
                console.log('some error in showDealOffer: ', error.message);
                res.render('400', { errorMessage: error, userObligations : req.userObligations });
            })
    }

}

module.exports = new DealsModel();
