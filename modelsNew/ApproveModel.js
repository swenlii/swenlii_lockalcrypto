var mysql = require('mysql');
var pool = require('./DBConnectionModel').returnPoolConnection();

class ApproveModel {
    constructor() {}

    async approveSellOffer(hash) {
        try {
            var result = await pool.query("SELECT * FROM `sell_offers` WHERE `approve_status` = '0' AND `approve_hash` = ? AND `closed_offer` = '0'", [hash])
        } catch (e) {
            throw new Error(e)
        }

        if (result.length !== 1) {
            throw new Error('This offer was already approved or error with hash')
        } else {
            var offerObj = result[0]

            try {
                var updateSql = pool.query("UPDATE sell_offers SET approve_status = ?, activated_date = NOW() WHERE id = ?", [1 ,offerObj.id])
            } catch (e) {
                throw new Error(e)
            }

            return 'success'
        }


    }
}
module.exports = new ApproveModel();