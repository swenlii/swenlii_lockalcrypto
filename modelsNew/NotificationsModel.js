var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
let emailModel = require('./EmailModel')
let axios = require('axios')


class NotificationsModel {
    constructor() {
    }

    async sendNotificationDealInitiated(sellerId, dealObj) {
        try {

            var result = await pool.query("SELECT * FROM users WHERE id = ?", [sellerId])
        } catch (e) {

            throw e
        }

        if (result.length > 0) {
            let sellerObj = result[0];

        } else {
            throw Error('cant find seller')
        }
    }

    async saveNotification(notifObj) {  // as first, i use this for save notifs for SELLERS
        try {
            var result = await pool.query("INSERT INTO `localdb`.`notifications` (`userId`, `url`, `what`, `textDescr`, `possibleAmount`, `readed`, cryproShortCode) VALUES (?, 'NULL', ?, ?, ?, 0, ?)", [notifObj.userId, notifObj.what, notifObj.textDescr, notifObj.possibleAmount, notifObj.cryptoShortCode])
        } catch (e) {
            throw e
        }

        return 'ok, good'
    }

    async getLastTransactions() {

        try {
            var listTxs = await axios({
                url: `http://api.etherscan.io/api?module=account&action=tokentx&address=0&startblock=0&endblock=999999999&sort=asc&apikey=`,
                method: 'GET'
            })
        } catch (e) {
            throw e
        }
        console.log('listTxs', listTxs.data);

        return listTxs.data.result;

    }

    async checkPlatonPayments() {
        try {
            var payments = await pool.query("SELECT * FROM payments WHERE paid is NULL AND paymentMethod = 'PlatonCoin' AND weInitiated >= DATE_ADD(CURDATE(), INTERVAL -2 DAY)")
        } catch (e) {
            throw e
        }

        return payments
    }

    checkTransactionPltc(txHash, lastTransactions) {

        if (Array.isArray(lastTransactions)) {
            var actualAmount = 0;
            var response = lastTransactions.some(oneTx => {
                actualAmount = oneTx.value
                return (oneTx.hash.toLowerCase().trim() === txHash.toLowerCase().trim())
            });

            return {response, actualAmount};    // true, false
        } else {
            return {response: false, actualAmount: 0}
        }
    }

    async handlePossiblePayments(io) {
        try {
            var payments = await this.checkPlatonPayments();
            var lastTransactions = await this.getLastTransactions();
        } catch (e) {
            throw e
        }
console.log('payments', payments)

        await Promise.all(payments.map(async (onePayment) => {
            var result = this.checkTransactionPltc(onePayment.possibleTxHash, lastTransactions);

            if (result.response === true) {
                try {
                    var ok = await pool.query("UPDATE `localdb`.`payments` t SET t.`paid` = NOW(), pltcRealPaid = ? WHERE t.`id` = ?", [result.actualAmount, onePayment.id])
                } catch (e) {
                    throw e
                }

                let socketObj = {
                    id: onePayment.id,
                    what : 'confirmed',
                    coinbaseiD : false,
                    method: 'PlatonCoin'
                };

                io.sockets.in('payments'+onePayment.userId).emit('updatePaymentStatusCoinBase',socketObj);

                console.log('set paid NOW, handlePossiblePayments, after socket.in')
            } else {
                console.log('result = FALSE handlePossiblePayments, in else block')
            }
        }));

    }

}

module.exports = new NotificationsModel();
