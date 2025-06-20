var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const fs = require('fs').promises
const path = require('path');
const axios = require('axios');

class CurrencyModel {
    constructor() {
    }

    async loadDefaultCurrency() {
        try {
            var result = await pool.query("SELECT * FROM cryptolist WHERE isDefault = 1 LIMIT 1")
        } catch (e) {
            throw new Error(e)
        }

        if (result.length > 0) {
            return result[0]
        } else {
            throw new Error('cryptolist db is broken')
        }
    }

    async getCryptoNames(string) {
        try {
            var result = await pool.query("SELECT * FROM cryptolist WHERE lower(name) LIKE lower(CONCAT('%', ?,  '%')) OR lower(short_code) LIKE lower(CONCAT('%', ?,  '%')) ORDER BY popularityIndex ASC LIMIT 0, 5", [string]);
            console.log('sql:' + "ELECT * FROM cryptolist WHERE name LIKE " + '%' + string + '%' + " ORDER BY popularityIndex ASC LIMIT 0, 5" + 'result', result)
        } catch (e) {
            throw e
        }


        return result;
    }

    async loadAllCryptoCurrencies() {
        try {
            var currencies = await pool.query("SELECT * FROM cryptolist ORDER BY popularityIndex, name")
        } catch (e) {
            throw new Error(e)
        }

        return currencies;
    }

    async getUsedCryptoRates() {
        try {
            var usedCurrencies = await pool.query("SELECT sell_offers.cryptocurrency_id AS id, cryptolist.short_code, cryptolist.rateToUsd, cryptolist.rateToEur, cryptolist.rateToRub, cryptolist.rateToCzk, cryptolist.rateToNzd, cryptolist.rateToAud FROM localdb.sell_offers LEFT JOIN localdb.cryptolist ON cryptolist.id = sell_offers.cryptocurrency_id GROUP BY sell_offers.cryptocurrency_id");
        } catch (e) {
            throw e
        }
        return  usedCurrencies;
    }

    async loadAllFiatCurrencies() {
        try {
            var currencies = await pool.query("SELECT * FROM fiat_list")
        } catch (e) {
            throw new Error(e)
        }

        return currencies;
    }

    async downloadImage(url, coingeckoTextId) {
     //   const path = Path.resolve('public', 'images/c', coingeckoTextId+'.png')

        try {
            var response = await axios({
                url: url,
                method: 'GET',
                responseType: 'arraybuffer'
            })
        } catch (e) {
            throw e
        }

        try {
            var responseOk = await fs.writeFile('public/images/c/'+coingeckoTextId+'.png', response.data)
        } catch (e) {
            throw e
        }

        return coingeckoTextId+'.png'
    }

    async initiateCryptoData(fiatCurrency, perPage, page) { // max 250 per page, 60req./minute
        try {
            var bigData = await CoinGeckoClient.coins.markets({
                vs_currency: fiatCurrency,
                per_page: perPage,
                page: page,
                sparkline: false
            });
        } catch (e) {
            throw e
        }

        await Promise.all(bigData.data.map(async (oneCryptoCurrency) => {
            try {
                var okString = await this.saveDataCurrencyIfNoExist(oneCryptoCurrency, fiatCurrency)
            } catch (e) {
                throw e
            }
        }));

        return  'ok response'
    }

    async saveDataCurrencyIfNoExist(cryptoObj, fiatCurrency) {
        try {
            var result = await pool.query("SELECT * FROM cryptolist WHERE coinGeckoTextId = ?", [cryptoObj.id])
        } catch (e) {
            throw e
        }

        let fieldName = 'rateToEur';

        if (fiatCurrency === 'usd') {
            fieldName = 'rateToUsd'
        } else if (fiatCurrency === 'rub') {
            fieldName = 'rateToRub'
        } else if (fiatCurrency === 'czk') {
            fieldName = 'rateToCzk'
        } else if (fiatCurrency === 'nzd') {
            fieldName = 'rateToNzd'
        } else if (fiatCurrency === 'aud') {
            fieldName = 'rateToAud'
        }

        if (result.length === 0) {
            try {
                var urlPath = await this.downloadImage(cryptoObj.image, cryptoObj.id)
            } catch (e) {
                throw e
            }


            try {
                var resultZ = await pool.query(`INSERT INTO localdb.cryptolist (name, short_code, logo_path, popularityIndex, lastPrice, lastPriceUpdated, ${fieldName}, ratesWasUpdatedWhen, coinGeckoTextId) VALUES (?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)`, [cryptoObj.name, cryptoObj.symbol.toUpperCase(), urlPath, cryptoObj.market_cap_rank ? cryptoObj.market_cap_rank : 10000, cryptoObj.current_price, cryptoObj.current_price, cryptoObj.id])
            } catch (e) {
                throw e
            }

            return 'success inserted'
        } else {
            let crObj = result[0];

            if (cryptoObj.market_cap_rank && crObj.popularityIndex != cryptoObj.market_cap_rank){
                var updatePopularity = await pool.query(`UPDATE localdb.cryptolist SET popularityIndex = ? WHERE id = ?`, [cryptoObj.market_cap_rank, crObj.id])
            }

            try {
                var updateRow = await pool.query(`UPDATE localdb.cryptolist SET ${fieldName} = ?, ratesWasUpdatedWhen = NOW() WHERE id = ?`, [cryptoObj.current_price ,crObj.id])
            } catch (e) {
                throw e
            }

            return 'success updated'
        }


    }


    async updateUSDRate(cryptoObj) {

    }

    async updateEURRate(cryptoObj) {

    }

    async updateRUBRate(cryptoObj) {

    }

    async updateCZKRate(cryptoObj) {

    }

}

module.exports = new CurrencyModel();
