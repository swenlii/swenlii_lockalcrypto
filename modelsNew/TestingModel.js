var mysql = require('mysql');
var mysql2 = require('mysql2');
var poolTesting = require('./DBConnectionModel').returnPoolConnectionTesting();

class TestingModel {
    constructor() {}

    async insertSellOrder() {

    // i < 1250
        let priceInitial = 9250;
        try {
            let startTime = new Date().getTime();
            let i = 1
            for (; i < 1250; i++) {
                priceInitial = priceInitial +i;
                let result = await poolTesting.query("INSERT INTO `first`.`sellOrders` (`btcAmount`, `userId`, `timeInitiated`, `rateInUsdForOneBtc`) VALUES (?, 1, NOW(), ?)", [i, priceInitial])
            }
            console.log(((new Date().getTime() - startTime))/1000, 'seconds', 'how much one thread inserted?', i);

        } catch (e) {
            throw e

        }

        return 'ok'

    }
}
module.exports = new TestingModel();
