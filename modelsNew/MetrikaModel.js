const client = require('redis').createClient();
const axios = require('axios');

const {promisify} = require('util');

const redisClient = {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client)
};

const setTimeoutAsync = promisify(setTimeout);

class MetrikaModel {
    constructor() {
        this.redisKey = '_merikaCache';
    }

    async get() {
        let result = await this.getFromCachce();
        if (!result) {
            result = await this.getFromRemote();
        }
        return result;
    }

    async getFromRemote() {
        var rightNow = new Date();
        var rightNowFormated = rightNow.toISOString().slice(0, 10);

        let alldayResponse = await axios.get(
            'https://api-metrika.yandex.net/stat/v1/data?metrics=ym:s:visits&id=&date1=2018-10-11&date2=' + rightNowFormated, {
                headers: {
                    Authorization: ''
                }
            });

        await setTimeoutAsync(850); // short delay before api calls to prevent limits exceed

        let toodayResponse = await axios.get(
            'https://api-metrika.yandex.net/stat/v1/data/bytime?date1=' + rightNowFormated + '&date2=' + rightNowFormated + '&group=day&dimensions=ym:s:regionCountry&ids=&metrics=ym:s:visits&top_keys=30', {
                headers: {
                    Authorization: ''
                }
            });

        await setTimeoutAsync(850); // short delay before api calls to prevent limits exceed

        let toodayTotalResponse = await axios.get(
            'https://api-metrika.yandex.net/stat/v1/data/bytime?date1=' + rightNowFormated + '&date2=' + rightNowFormated + '&group=day&ids=&metrics=ym:s:visits&top_keys=30', {
                headers: {
                    Authorization: ''
                }
            });

        var result = {
            toodayTotalMetrika: toodayTotalResponse.data,
            toodayMetrika: toodayResponse.data,
            alldayMetrika: alldayResponse.data
        };

        this.setCache(result);
        return result;
    }

    async getFromCachce() {
        let cacheResult = await redisClient.get(this.redisKey);
        return cacheResult ? JSON.parse(cacheResult) : cacheResult;
    }

    async setCache(data) {
        let cacheResult = await redisClient.set(this.redisKey, JSON.stringify(data));
        return cacheResult;
    }

}
module.exports = new MetrikaModel();
