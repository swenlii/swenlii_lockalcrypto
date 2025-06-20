var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
let geoModel = require('./GEOModel');
let authModel = require('./AuthModel');
var crypto = require('crypto');

class OffersModel {
    constructor() {
    }

    async postOffer(offerObj, userObj) {

        const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
        var someSalt = 'fdgd1xvi';
        var hashedTitle = sha256(offerObj.offerTitle + offerObj.countryCode + someSalt);
        var approve_hash = hashedTitle + Math.random().toString(36).substr(2, 5) + new Date().getTime();

        let priceType = 'dynamic';
        let price = 0;
        let exchangeFirtCoinId = 0;
        if (offerObj.priceType === 'fixed') {
            priceType = 'fixed';
            price = offerObj.price;
        }

        if (offerObj.offerType === 'exch') {
            offerObj.choosedFiatId = 0;
            price = offerObj.price;
            priceType = 'fixed';
            exchangeFirtCoinId = offerObj.yourCrypto;
        }

        //console.log('offerObj', offerObj)

        try {
            var result = await pool.query(`INSERT INTO sell_offers (country_id, user_id, cryptocurrency_id, fiat_id, max_deposite, exchange_rate, can_buy_only_all, payments_bank, payments_personal, payments_paypal_etc, payments_internal, short_title, description, approve_status, approve_hash, cityId, offerType, priceType, dynamicPercent, exchangeFirstCoinId)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [offerObj.countryId, userObj.id, offerObj.choosedCryptoId, offerObj.choosedFiatId, offerObj.deposite, price, offerObj.canDivide, offerObj.paymentBank, offerObj.paymentMeet, offerObj.paymentDigital, offerObj.paymentInternal, offerObj.offerTitle, offerObj.descr, 0, approve_hash, offerObj.cityId, offerObj.offerType, priceType, offerObj.possiblePercent, exchangeFirtCoinId])
        } catch (e) {
            throw e
        }

        if (result.insertId > 0) {
            return  { insertId: result.insertId, approve_hash }
        } else {
            throw new Error('error while posting offer')
        }
    }

    async loadOffersByCrypto(searchBy, geoObj=null, cryptoId, offersType = 'wts', checkedPayments, limitFrom = 0, limitTo = 250) {
        let sqlValues = [offersType];
        let sqlString = ` `;

        if (searchBy === 'byCity' || searchBy === 'byCountry') {
            try {   // also inserting, if does not exist
                var countryObj = await geoModel.getCountryByCode(geoObj.countryCode)
            } catch (e) {
                throw e
            }
            if (countryObj && countryObj.id){
                sqlString = ` AND sell_offers.country_id = ? `;
                sqlValues.push(countryObj.id);
                if (searchBy === 'byCity') {
                    try {
                        var cityObj = await pool.query('SELECT cities.* FROM cities WHERE englishName = ?', [geoObj.city]);
                    } catch (e) {
                        throw e
                    }

                    if (cityObj.length > 0) {
                        sqlString = `${sqlString} AND sell_offers.cityId = ? `;
                        sqlValues.push(cityObj.id);
                    } else {
                        console.log('cannot find city');
                        return [];
                    }
                }
            } else {
                return [];
            }
        }

        if (checkedPayments && Array.isArray(checkedPayments)){
            sqlString = `${sqlString} AND (`;

            if (checkedPayments.length > 0) {
                checkedPayments.forEach(onePayment => {

                    if (onePayment === 'bank') {
                        sqlString = ` ${sqlString} OR payments_bank = 1 `;

                    } else if (onePayment === 'digital') {
                        sqlString = ` ${sqlString} OR payments_paypal_etc = 1 `;

                    } else if (onePayment === 'personal') {
                        sqlString = ` ${sqlString} OR payments_personal = 1 `;

                    } else if (onePayment === 'internal') {
                        sqlString = ` ${sqlString} OR payments_internal = 1 `;
                    }
                })
            } else {
                sqlString = ` ${sqlString} payments_bank = 0 AND payments_paypal_etc = 0 AND payments_personal = 0 AND payments_internal = 0`; // remove value from string, because no conditions here, so we return blank array in theory;
            }

            sqlString = `${sqlString}) `;
            if (sqlString.includes('( OR')) {
                sqlString = sqlString.replace('( OR', '(');
            }
        }

        if (cryptoId) {
            sqlString += ' AND sell_offers.cryptocurrency_id = ?';
            sqlValues.push(cryptoId);
        }

        sqlValues.push(limitTo);

        try {
            var offers = await pool.query(`
              SELECT cryptocurrency_id,
                     exchange_rate,
                     max_deposite,
                     short_title,
                     users.id                                                                              AS userId,
                     sell_offers.id                                                                        AS offerId,
                     sell_offers.priceType, sell_offers.dynamicPercent,
                     users.name                                                                            as userName,
                     users.verifiedRate,
                     countries.*,
                     cryptolist.name                                                                       as cryptoName,

                     cryptolist.short_code                                                                 as cryptoShortCode,
                     cryptolist.rateToAud, cryptolist.rateToCzk, cryptolist.rateToEur, cryptolist.rateToNzd, cryptolist.rateToRub, cryptolist.rateToUsd,
                     sell_offers.activated_date                                                            as offerActivatedDate,
                     cryptolist.logo_path,
                     (SELECT short_name FROM fiat_list WHERE fiat_list.id = sell_offers.fiat_id) as fiatName,
                     UNIX_TIMESTAMP(sell_offers.activated_date)                                            as unixTime
              FROM sell_offers
                     LEFT JOIN users ON sell_offers.user_id = users.id
                     LEFT JOIN countries ON sell_offers.country_id = countries.id
                     LEFT JOIN cryptolist ON sell_offers.cryptocurrency_id = cryptolist.id
              WHERE sell_offers.offerType = ?
                ${sqlString}
              ORDER BY offerActivatedDate DESC LIMIT ?
            `, sqlValues)
        } catch (e) {
            throw e
        }

        return offers;
    }

    async loadMoreOffersByCryptoArr(obj) {
        let offersList = [];

        if (obj.selectedCurrencies.length === 0) {
            offersList = await this.loadOffersByCrypto(obj.searchBy, obj.geoObj, '', obj.offersType, obj.checkedPayments);
        } else {
            await Promise.all(obj.selectedCurrencies.map(async (oneCrypto) => {
                try {
                    var results = await this.loadOffersByCrypto(obj.searchBy, obj.geoObj, oneCrypto.id, obj.offersType, obj.checkedPayments);
                    offersList = offersList.concat(results)
                } catch (e) {
                    throw e
                }
            }))
        }

        if (obj.sortBy === 'byPrice') {
            let newArr = offersList.slice(0);   // always copy arr before man.
            newArr.sort(function (a, b) {
                if (a.exchange_rate > b.exchange_rate) {
                    return 1;
                }
                if (a.exchange_rate < b.exchange_rate) {
                    return -1;
                }
                return 0;
            });
            return newArr;
        } else if (obj.sortBy === 'byDate') {
            let newArr = offersList.slice(0);   // always copy arr before man.
            newArr.sort(function (a, b) {
                if (a.unixTime > b.unixTime) {
                    return -1;
                }
                if (a.unixTime < b.unixTime) {
                    return 1;
                }
                return 0;
            });
            return newArr;
        } else {
            return offersList;
        }
    }

    async updateOffer(offerObj) {
        try {
            var result = await pool.query("UPDATE sell_offers SET short_title = ?, description = ?, max_deposite = ?, exchange_rate = ?, dynamicPercent = ?, can_buy_only_all = ?, payments_bank = ?, payments_internal = ?, payments_paypal_etc = ?, payments_personal = ? WHERE id = ?", [offerObj.title, offerObj.description, offerObj.deposite, offerObj.exchange_rate, offerObj.dynamicPercent, offerObj.can_buy_only_all, offerObj.payments_bank, offerObj.payments_internal, offerObj.payments_paypal_etc, offerObj.payments_personal, offerObj.id]);
        } catch (e) {
            throw e
        }

        return result
    }

    async getOfferObj(offerId) {
        // used in front, some validation needed
        if (!offerId || Number.isInteger(offerId === false) || Number.parseInt((offerId) < 1)) {
            throw Error('offerId validation error')
        }

        try {
            var result = await pool.query(`SELECT sell_offers.*, cryptolist.*, cryptolist.short_code as cryptoShortCode, cities.*, fiat_list.*, countries.*, sell_offers.id as offerId, cities.englishName as cityEnglishName, cryptolist.name as cryptoName, fiat_list.short_name as fiatShortName, TIMESTAMPDIFF(DAY, sell_offers.activated_date, NOW()) AS whenWasPosted, users.verifiedRate as verifiedUserRate, cryptolist.logo_path  
FROM sell_offers 
    LEFT JOIN countries ON (sell_offers.country_id = countries.id) 
    LEFT JOIN cities ON (sell_offers.cityId = cities.id) 
    LEFT JOIN cryptolist ON (sell_offers.cryptocurrency_id = cryptolist.id) 
    LEFT JOIN fiat_list ON (sell_offers.fiat_id = fiat_list.id) 
    LEFT JOIN users ON (sell_offers.user_id = users.id) WHERE sell_offers.id = ?`, [offerId])
        } catch (e) {
            throw e
        }



        if (result.length > 0) {
            let offerObj = result[0];

            if (offerObj.offerType === 'wts') {
                offerObj.typeWords = `${offerObj.cryptoName} selling offer`;
            } else if (offerObj.offerType === 'wtb') {
                offerObj.typeWords = `${offerObj.cryptoName} buying offer`;
            } else if (offerObj.offerType === 'exch') {
                offerObj.typeWords = `${offerObj.cryptoName} exchanging offer`;
               // offerObj.symbol = offerObj.cryptoShortCode

                try {
                    var resultC = await pool.query("SELECT * FROM localdb.cryptolist WHERE id = ?", [offerObj.exchangeFirstCoinId])
                } catch (e) {
                    throw e
                }

                if (resultC.length > 0) {
                    offerObj.symbol = resultC[0].short_code
                } else {
                    throw new Error('Error in exchange offer (cryptoShortCode)')
                }

            } else {

            }

            offerObj.country_codeLow = offerObj.country_code.toLowerCase();

            // too hard sql above, better calculate offer rating separately
            offerObj.calculatedRating = 0; // 0 - no rating

            try {
                var forRating = await pool.query("SELECT AVG(reviews.stars) as avgStars FROM reviews WHERE offerId = ?", [offerObj.offerId])
            } catch (e) {
                throw e
            }

            if (forRating.length > 0) {
                let someCalc = forRating[0];
                let rate = parseInt(someCalc.avgStars);
                if (isNaN(rate) === false && rate > 0) {
                    offerObj.calculatedRating = rate;
                }
            }



            return offerObj
        } else {
            console.log ('Offer with id ' + offerId + ' not found');
            throw Error('Not found offer by this id');
        }
    }

    async getUserOffers(userId) {
        try {
            var result = await pool.query("SELECT * FROM sell_offers WHERE user_id = ? AND closed_offer = 0", [userId])
        } catch (e) {
            throw e
        }
        return result
    }

    async getUserOpenOffers(userId) {
        console.log("SELECT sell_offers.id, " +
            "                           sell_offers.max_deposite, " +
            "                           sell_offers.description, " +
            "                           sell_offers.short_title, " +
            "                                           sell_offers.approve_status, " +
            "                           sell_offers.activated_date, " +
            "                           sell_offers.payments_bank, " +
            "                           sell_offers.payments_personal, " +
            "                           sell_offers.payments_paypal_etc, " +
            "                           sell_offers.payments_internal, " +
            "                           sell_offers.priceType, " +
            "                           sell_offers.offerType, " +
            "                           sell_offers.dynamicPercent, " +
            "                           sell_offers.exchange_rate, " +
            "                           sell_offers.can_buy_only_all, " +
            "                           cryptolist.name, " +
            "                               cryptolist.short_code, " +
            "                           cryptolist.logo_path, " +
            "                           cities.englishName, " +
            "                           countries.country_name, " +
            "                           dealsTable.closedDeal, " +
            "                           fiat_list.symbol, " +
            "                           fiat_list.short_name " +
            "                           FROM sell_offers " +
            "                           RIGHT JOIN cryptolist " +
            "                           on sell_offers.cryptocurrency_id = cryptolist.id " +
            "                           RIGHT JOIN countries on sell_offers.country_id = countries.id " +
            "                           RIGHT JOIN cities on sell_offers.cityId = cities.id  " +
            "                           RIGHT JOIN fiat_list ON (sell_offers.fiat_id = fiat_list.id)  " +
            "                           LEFT JOIN (select closedDeal, offerId " +
            "                                       from deals " +
            "                                       where closedDeal=0 group by offerId) as dealsTable " +
            "                                       on sell_offers.id = dealsTable.offerId " +
            "                           WHERE sell_offers.user_id = ? AND sell_offers.closed_offer = 0 " +
            "                           AND sell_offers.deleted_offer = 0");
        try {
            var result = await pool.query("SELECT sell_offers.id, " +
                "                           sell_offers.max_deposite, " +
                "                           sell_offers.description, " +
                "                           sell_offers.short_title, " +
"                                           sell_offers.approve_status, " +
                "                           sell_offers.activated_date, " +
                "                           sell_offers.payments_bank, " +
                "                           sell_offers.payments_personal, " +
                "                           sell_offers.payments_paypal_etc, " +
                "                           sell_offers.payments_internal, " +
                "                           sell_offers.priceType, " +
                "                           sell_offers.offerType, " +
                "                           sell_offers.dynamicPercent, " +
                "                           sell_offers.exchange_rate, " +
                "                           sell_offers.can_buy_only_all, " +
                "                           cryptolist.name, " +
            "                               cryptolist.short_code, " +
                "                           cryptolist.logo_path, " +
                "                           cities.englishName, " +
                "                           countries.country_name, " +
                "                           dealsTable.closedDeal, " +
                "                           fiat_list.symbol, " +
                "                           fiat_list.short_name " +
                "                           FROM sell_offers " +
                "                           RIGHT JOIN cryptolist " +
                "                           on sell_offers.cryptocurrency_id = cryptolist.id " +
                "                           RIGHT JOIN countries on sell_offers.country_id = countries.id " +
                "                           RIGHT JOIN cities on sell_offers.cityId = cities.id  " +
                "                           RIGHT JOIN fiat_list ON (sell_offers.fiat_id = fiat_list.id)  " +
                "                           LEFT JOIN (select closedDeal, offerId " +
                "                                       from deals " +
                "                                       where closedDeal=0 group by offerId) as dealsTable " +
                "                                       on sell_offers.id = dealsTable.offerId " +
                "                           WHERE sell_offers.user_id = ? AND sell_offers.closed_offer = 0 " +
                "                           AND sell_offers.deleted_offer = 0", [userId])
        } catch (e) {
            throw e
        }
        return result
    }

    async saveNewDeposit(offerObj) {
        try {
            var result = await pool.query("UPDATE sell_offers SET max_deposite = ? WHERE id = ?", [offerObj.deposite, offerObj.id])
        } catch (e) {
            throw e
        }
        return result
    }

    async deleteOffer(id) {
        try {
            var result = await pool.query("UPDATE sell_offers SET deleted_offer = 1 WHERE id = ?", [id])
        } catch (e) {
            throw e
        }
        return result
    }

    async getCoins() {
        try {
            var result = await pool.query("SELECT * FROM localdb.cryptolist")
        } catch (e) {
            throw e
        }
        return result
    }

    async getCoinsToSell(){
        try{
            var cities = await pool.query("SELECT cities.*, cities.id as cityId, CONCAT(cities.englishName, 'Coin') AS name, LOWER(countries.country_code) AS country_code, LOWER(regions.name) AS region FROM localdb.cities LEFT JOIN countries ON (cities.countryId = countries.id) LEFT JOIN regions ON (cities.regionId = regions.id) WHERE cities.hasOwnCoin = 1");
            for (let i = 0; i < cities.length; i++){
                cities[i].isChoosen = false;
            }
        } catch (e) {
            throw e
        }
        return cities;
    }

    async buyCityCoin(obj){
        // who is it?
        try {
            var findUserArr = await pool.query("SELECT users.id FROM users WHERE users.email = ?", [obj.email])// user is exist?
        } catch (e) {
            throw e
        }
        let userId;
        if (findUserArr.length > 0) {// yes - userId = user.id
            userId = findUserArr[0].id;
        }
        else {// no - authModel.registerUser(obj)
            try {
                var resultInsert = await authModel.registerUser(obj);
            } catch (e) {
                throw e
            }
            userId = resultInsert.insertId;
        }

        // .... set transaction (money)

        // save information
        await Promise.all(obj.coins.map( async (coin) => {
            try {
                var update = await pool.query("UPDATE localdb.cities SET cities.lastBought=NOW(), cities.byersId = ? WHERE  id = ?", [userId, coin.cityId]);
                var history = await pool.query("INSERT INTO localdb.transactionHistory (userId, cityId, dateTransaction, email, firstName, lastName, phoneNumber) VALUES (?, ?, NOW(), ?, ?, ?, ?)", [userId, coin.cityId, obj.email, obj.firstName, obj.lastName, obj.telNumber]);
            } catch (e) {
                throw e
            }
        }));
        return 'ok';
    }

    async getCatalogOfExchanges () {
        try {
            var countries = await pool.query("SELECT catalogOfExchanges.countryId, countries.country_code, countries.country_name FROM catalogOfExchanges LEFT JOIN countries ON catalogOfExchanges.countryId = countries.id GROUP BY countryId")
        } catch (e) {
            throw e
        }

        let resultGroupByCountry = [];

        await  Promise.all(countries.map (async (country) => {
            var res = await pool.query("SELECT catalogOfExchanges.*, cities.englishName AS city, countries.country_code FROM (localdb.catalogOfExchanges LEFT JOIN cities ON catalogOfExchanges.cityId = cities.id) LEFT JOIN countries ON catalogOfExchanges.countryId = countries.id WHERE catalogOfExchanges.countryId = ?", [country.countryId]);
            resultGroupByCountry.push({
                countryId: country.countryId,
                country_code: country.country_code,
                country_name: country.country_name,
                exchanges: res
            });
        }));

        return resultGroupByCountry;
    }

    async getSortingCompanies (objworkOnSunday, objworkOnSaturday, objonlyRegistered, hourStart, hourEnd) {
        var addToSql = "";

        if (objonlyRegistered === true) addToSql += " WHERE catalogOfExchanges.userId ";
        console.log(1, addToSql);
        if (objworkOnSaturday === true) {
            addToSql += (addToSql === "" ? " WHERE " : " AND ") + " catalogOfExchanges.workOnSaturday = 1 ";
        }
        console.log(2, addToSql);
        if (objworkOnSunday === true) {
            addToSql += (addToSql === "" ? " WHERE " : " AND ") + " catalogOfExchanges.workOnSunday = 1 ";
        }
        console.log(3, addToSql);
        if (hourStart && hourStart > 0) {
            addToSql += addToSql === "" ? " WHERE " : " AND ";
            addToSql +=" catalogOfExchanges.workHourStart <= " + hourStart + ' ';
        }
        console.log(4, addToSql);
        if (hourEnd && hourEnd < 24) {
            addToSql += addToSql === "" ? " WHERE " : " AND ";
            addToSql +=" catalogOfExchanges.workHourEnd >= " + hourEnd + ' ';
        }

        console.log(5, addToSql);

        try {
            var countries = await pool.query("SELECT catalogOfExchanges.countryId, countries.country_code, countries.country_name FROM catalogOfExchanges LEFT JOIN countries ON catalogOfExchanges.countryId = countries.id " + addToSql + " GROUP BY countryId")
        } catch (e) {
            throw e
        }

        addToSql = "";

        if (objonlyRegistered === true) addToSql += " AND catalogOfExchanges.userId ";
        if (objworkOnSaturday === true) addToSql += " AND catalogOfExchanges.workOnSaturday = 1 ";
        if (objworkOnSunday === true) addToSql += " AND catalogOfExchanges.workOnSunday = 1 ";
        if (hourStart && hourStart > 0) addToSql+= " AND catalogOfExchanges.workHourStart <= " + hourStart;
        if (hourEnd && hourEnd < 24) addToSql+= " AND catalogOfExchanges.workHourEnd >= " + hourEnd;

        let resultGroupByCountry = [];


        await  Promise.all(countries.map (async (country) => {
            var res = await pool.query("SELECT catalogOfExchanges.*, cities.englishName AS city, countries.country_code FROM (localdb.catalogOfExchanges LEFT JOIN cities ON catalogOfExchanges.cityId = cities.id) LEFT JOIN countries ON catalogOfExchanges.countryId = countries.id WHERE catalogOfExchanges.countryId = ?" + addToSql, [country.countryId]);
            resultGroupByCountry.push({
                countryId: country.countryId,
                country_code: country.country_code,
                country_name: country.country_name,
                exchanges: res
            });
        }));

        return resultGroupByCountry;
    }

    async sortingCompaniesByCountry (countryCode, countryName, objworkOnSunday, objworkOnSaturday, objonlyRegistered, hourStart, hourEnd) {
        try {   // also inserting, if does not exist
            var countryObj = await geoModel.getCountryByCode(countryCode)
        } catch (e) {
            throw e
        }

        if (countryObj && countryObj.id){
            var addToSql = "";

            if (objonlyRegistered) addToSql += " AND catalogOfExchanges.userId ";
            if (objworkOnSaturday) addToSql += " AND catalogOfExchanges.workOnSaturday = 1 ";
            if (objworkOnSunday) addToSql += " AND catalogOfExchanges.workOnSunday = 1 ";
            if (hourStart) addToSql+= " AND catalogOfExchanges.workHourStart <= " + hourStart;
            if (hourEnd) addToSql+= " AND catalogOfExchanges.workHourEnd >= " + hourEnd;

            try {
                var res = await pool.query("SELECT catalogOfExchanges.*, cities.englishName AS city, countries.country_code FROM (localdb.catalogOfExchanges LEFT JOIN cities ON catalogOfExchanges.cityId = cities.id) LEFT JOIN countries ON catalogOfExchanges.countryId = countries.id WHERE catalogOfExchanges.countryId = ?" + addToSql, [countryObj.id]);
            } catch (e) {
                throw e
            }

            if (res.length > 0) {
                let resultGroupByCountry = [];

                resultGroupByCountry.push({
                    countryId: countryObj.id,
                    country_code: countryCode,
                    country_name: countryName,
                    exchanges: res
                });

                return resultGroupByCountry;
            }
            else return []
        } else {
            return [];
        }
    }

    async sortingCompaniesByCityAndCountry (countryCode, countryName, city, zipCode, objworkOnSunday, objworkOnSaturday, objonlyRegistered, hourStart, hourEnd) {
        try {   // also inserting, if does not exist
            var countryObj = await geoModel.getCountryByCode(countryCode)
        } catch (e) {
            throw e
        }

        if (countryObj && countryObj.id){
            try {
                var cityObj = await pool.query('SELECT cities.* FROM cities WHERE englishName = ?', [city]);
            } catch (e) {
                throw e
            }

            if (cityObj.length === 0){
                console.log('cannot find city');
                return [];
            }

            var addToSql = "";

            if (objonlyRegistered) addToSql += " AND catalogOfExchanges.userId ";
            if (objworkOnSaturday) addToSql += " AND catalogOfExchanges.workOnSaturday = 1 ";
            if (objworkOnSunday) addToSql += " AND catalogOfExchanges.workOnSunday = 1 ";
            if (hourStart) addToSql+= " AND catalogOfExchanges.workHourStart <= " + hourStart;
            if (hourEnd) addToSql+= " AND catalogOfExchanges.workHourEnd >= " + hourEnd;

            try {
                var res = await pool.query("SELECT catalogOfExchanges.*, cities.englishName AS city, countries.country_code FROM (localdb.catalogOfExchanges LEFT JOIN cities ON catalogOfExchanges.cityId = cities.id) LEFT JOIN countries ON catalogOfExchanges.countryId = countries.id WHERE catalogOfExchanges.countryId = ? AND catalogOfExchanges.cityId = ?" + addToSql, [countryObj.id, cityObj.id]);
            } catch (e) {
                throw e
            }

            if (res.length > 0) {
                let resultGroupByCountry = [];

                resultGroupByCountry.push({
                    countryId: countryObj.id,
                    country_code: countryCode,
                    country_name: countryName,
                    exchanges: res
                });

                return resultGroupByCountry;
            }
            else return []
        } else {
            return [];
        }
    }


}

module.exports = new OffersModel();
