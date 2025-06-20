var mysql = require('mysql');
let nodeGeocoder = require('node-geocoder');
let pool = require('./DBConnectionModel').returnPoolConnection();

class GEOModel {
    constructor() {}

    async getCityObj(byName, byCountryId, zipCode, possibleInsert = true) {
        let result;
        try {
            let zip = await pool.query("SELECT zipCodes.cityId FROM zipCodes WHERE zipCode = ?", [zipCode]);
            if (zip.length > 0) {
                result = await pool.query("SELECT * FROM cities WHERE id = ?", [zip[0].cityId]);
            }
        } catch (e) {
            throw new Error(e)
        }

        if (result && result.length > 0) {
            return result[0]
        } else {
            if (possibleInsert === false) {
                throw new Error('No such city in db')
            } else {
                try {
                    var cityObj = await this.insertCity(byName, byCountryId, zipCode)
                } catch (e) {
                    throw new Error(e)
                }

                cityObj = await pool.query("SELECT * FROM cities WHERE englishName = ?",[byName]);

                return cityObj[0];
            }
        }

    }

    async insertCity(englishName, countryId, zipCode, geoName = '') {

        try {
            var city = await pool.query("SELECT cities.* FROM cities WHERE englishName = ?", [englishName]);
        } catch (e) {
            throw new Error(e)
        }

        if (city.length > 0) {
            //if del zip
            try {
                let zip = await pool.query("SELECT zipCodes.* FROM zipCodes WHERE cityId = ? AND zipCode = ?", [city[0].id, zipCode]);

                if (zip.length === 0)  {
                    await  pool.query("INSERT INTO zipCodes (cityId, zipCode) VALUES (?, ?)", [city[0].id, zipCode]);
                }
            } catch (e) {
                throw new Error(e)
            }
            //end if del zip
            return  city[0];
        } else {
            try {
                var result = await pool.query("INSERT INTO cities (englishName, geoName, countryId) VALUES (?,?,?)", [englishName, geoName, countryId]);

                await pool.query("INSERT INTO zipCodes (cityId, zipCode) VALUES (?, ?)", [result.insertId, zipCode]); //if del zip
            } catch (e) {
                throw new Error(e)
            }
    return  result[0];
}
}

    async getCountryByCode(countryCode) {
        try {
            var result = await pool.query("SELECT * FROM countries WHERE country_code = ?", [countryCode])
        } catch (e) {
            throw new Error(e)
        }

        if (result.length > 0) {
            return result[0]
        } else {
            return null;
        }
    }

    async searchInsertContryInGoogleByCode(countryCode, countryName) {
        let countryObj = {
            countryName : countryName,
            countryCode: countryCode
        }

        try {
            var bdCountryObj = await this.insertCountryAndReturnObj(countryObj)
        } catch (e) {
            throw new Error(e)
        }

        return bdCountryObj;
    }

    async insertCountryAndReturnObj(countryObj) {

        // check if exist
        try {
            var cResult = await pool.query("SELECT * FROM countries WHERE country_code = ?", [countryObj.countryCode])
        } catch (e) {
            throw new Error(e)
        }

        if (cResult.length > 0) {
            return cResult[0];
        }

        // if not exist, go insert
        try {
            var result = await pool.query("INSERT INTO localdb.countries (country_name, country_code)  VALUES (?, ?)", [countryObj.countryName, countryObj.countryCode])
        } catch (e) {
            throw new Error(e)
        }

        let id = result.insertId;

        try {
            var countries = await pool.query("SELECT * FROM localdb.countries WHERE id = ?", [id])
        } catch (e) {
            throw new Error(e)
        }

        if (countries.length > 0) {
            return countries[0]
        } else {
            throw new Error('error get country from DB')
        }
    }
}
module.exports = new GEOModel();
