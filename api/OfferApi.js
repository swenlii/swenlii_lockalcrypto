let nodeGeocoder = require('node-geocoder');
var offersModel = require('./../modelsNew/OffersModel');
let currencyModel = require('./../modelsNew/CurrencyModel');
let authModel = require('./../modelsNew/AuthModel');
let emailModel = require('./../modelsNew/EmailModel');
let geoModel = require('./../modelsNew/GEOModel');
let reviewModel = require('./../modelsNew/ReviewModel');

exports = module.exports = function (io, redisClient) {
    io.sockets.on('connection', function (socket) {
    console.log('offer api connection 222');


        socket.on('getCryptoCurrenciesAndFiats', function (callback) {
            let returnObj = {};
            currencyModel.loadAllFiatCurrencies()
                .then(fiatCurrencies => {
                    returnObj.fiatCurrencies = fiatCurrencies;
                    return currencyModel.loadAllCryptoCurrencies()
                })
                .then(currencies => {
                    returnObj.currencies = currencies;
                    callback(null, returnObj)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('postOffer', function (obj, callback) {

            // some entry validation
            if (!obj.countryName || !obj.countryCode || !obj.city || !obj.zipCode || obj.countryName.length <= 1 || obj.countryCode.length <= 1 || obj.city.length <= 1 || obj.zipCode <= 1) {
                return callback('validation err', null)
            }

            let userObj;

            if ((obj.alreadyRegistered && obj.alreadyRegistered === 'yes') || (obj.user && obj.user.uHash && obj.user.uHash.length > 4)) {
                authModel.authByEmailPassOrHash(obj.email, obj.password, obj.user.uHash)
                    .then(user => {
                        userObj = user;
                        return geoModel.getCountryByCode(obj.countryCode)
                    })
                     .then(countryObj => {
                         if (countryObj) {
                             return countryObj;
                         } else {
                             return geoModel.searchInsertContryInGoogleByCode(obj.countryCode, obj.countryName)
                         }
                     })
                    .then(countryObj => {
                        obj.countryId = countryObj.id;
                        return geoModel.getCityObj(obj.city, countryObj.id, obj.zipCode, true)
                    })
                    .then(cityObj => {
                        // 2. register user
                        obj.cityId = cityObj.id;
                        return offersModel.postOffer(obj, userObj)
                    })
                    .then(successObj => {
                        return emailModel.sendVerifOfferEmail(obj, userObj, successObj.approve_hash)
                    })
                    .then(successSent => {
                        let returnObj = {
                            uHash : userObj.user_hash,
                            name : userObj.name,
                            surname : userObj.surname,
                            avatarPath : userObj.avatarPath,
                            socketRef: socket.id
                        };

                        callback(null, returnObj)
                    })
                    .catch(e => {
                        console.log('hmm', e);
                        callback(e.message, null)
                    })
            } else if (obj.alreadyRegistered && obj.alreadyRegistered === 'no') {
                // 1. check if this city & country exist, if no -> insert
                geoModel.getCountryByCode(obj.countryCode)
                    .then(countryObj => {
                        if (countryObj) {
                            return countryObj;
                        } else {
                            return geoModel.searchInsertContryInGoogleByCode(obj.countryCode, obj.countryName)
                        }
                    })
                    .then(countryObj => {
                        obj.countryId = countryObj.id;
                        return geoModel.getCityObj(obj.city, countryObj.id, obj.zipCode, true)
                    })
                    .then(cityObj => {
                        // 2. register user
                        obj.cityId = cityObj.id;
                        return authModel.registerUser(obj)
                    })
                    .then(user => {
                        userObj = user;
                        return offersModel.postOffer(obj, userObj)
                    })
                    .then(successObj => {
                        return emailModel.sendVerifOfferEmail(obj, userObj, successObj.approve_hash)
                    })
                    .then(successSent => {
                        let returnObj = {
                            uHash : userObj.user_hash,
                            name : userObj.name,
                            surname : userObj.surname,
                            avatarPath : userObj.avatarPath,
                            socketRef: socket.id
                        };
                        callback(null, returnObj)
                    })
                    .catch(e => {
                        console.log('hmm', e);
                        callback(e.message, null)
                    })



                // 3. post offer

                // 4. send verif email

            }
        });

        socket.on('loadOfferDetail', function (offerId, callback) {
            offersModel.getOfferObj(offerId)
                .then(offerObj => {
                    callback(null, offerObj)
                })
                .catch(e => {
                    callback(e, null)
                })
        });

        socket.on('updateOffer', function (offerObj, callback) {
            offersModel.updateOffer(offerObj)
                .then(success => {
                    callback(null, success)
                })
                .catch(e => {
                    callback(e, null)
                })
        });

        socket.on('readUserOffers', function (userObj, callback) {
            console.log('readUserOffers inside socket on');

            authModel.authByHash(userObj.uHash)
                .then(user => {
                    return offersModel.getUserOffers(user.id)
                })
                .then(offers => {
                    offers.forEach((oneOffer, index) => {
                        socket.join('offerId' + oneOffer.id, () => {
                            console.log('user joined in room offerId' + oneOffer.id)
                            if (index === offers.length) {
                                callback(null, 'success offers room connected')
                            }
                        });
                    })
                })
                .catch(e => {
                    callback(e.message, null)
                })

        });

        socket.on('getUserOpenOffers', function (userObj, callback) {

            authModel.authByHash(userObj.uHash)
                .then(user => {
                    return offersModel.getUserOpenOffers(user.id)
                })
                .then(offers => {
                    callback(null, offers)
                })
                .catch(e => {
                    callback(e.message, null)
                })

        });

        socket.on('saveNewDeposit', function (offerObj, callback) {

            offersModel.saveNewDeposit(offerObj)
                .then(answerStr => {
                    callback(null, answerStr)
                })
                .catch(e => {
                    callback(e.message, null)
                })

        });

        socket.on('loadReviews', function (offerId, callback) {
            reviewModel.readReviews(offerId)
                .then(reviews => {
                    callback(null, reviews)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('deleteOffer', function (offerId, callback) {
            offersModel.deleteOffer(offerId)
                .then(answerStr => {
                    callback(null, answerStr)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('getCoins', function (obj, callback) {
            offersModel.getCoins()
                .then(coinsArr => {
                    callback(null, coinsArr)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('getCoinsToSell', function(obj, callback){
            offersModel.getCoinsToSell()
                .then(coinsToSell => {
                    callback(null, coinsToSell);
                })
                .catch(e => {
                    callback(e.message, null);
                })
        });
        
        socket.on('BuyCityCoin', function (obj, callback) {
            //console.log("*** BUY CITY COIN MESSAGE GET ***");
            offersModel.buyCityCoin(obj)
                .then(coinsToSell => {
                callback(null, 'Success');
            })
                .catch(e => {
                    callback(e.message, null);
                })
        });

        socket.on('disconnect', function () {
            console.log('SOCKET DISCONNECT, socket.id:', socket.id);
        });

        socket.on('getCatalogOfExchanges', function (callback) {
            offersModel.getCatalogOfExchanges()
                .then(catalog => {
                    callback(null, catalog);
                })
                .catch(e => {
                    callback(e.message, null);
                })
        });

        socket.on('readCompanies', function (obj, callback) {
            if (obj.searchBy === 'byDefault') {
                offersModel.getSortingCompanies(obj.workOnSunday, obj.workOnSaturday, obj.onlyRegistered, obj.workHourStart, obj.workHourEnd)
                    .then(catalog => {
                        callback(null, catalog);
                    })
                    .catch(e => {
                        callback(e.message, null);
                    })
            } else if (obj.searchBy === 'byCity' || obj.searchBy === 'byCityAndCountry') {
                offersModel.sortingCompaniesByCityAndCountry(obj.geoObj.countryCode, obj.geoObj.countryName, obj.geoObj.city, obj.geoObj.zipCode, obj.workOnSunday, obj.workOnSaturday, obj.onlyRegistered, obj.workHourStart, obj.workHourEnd)
                    .then(catalog => {
                        callback(null, catalog);
                    })
                    .catch(e => {
                        callback(e.message, null);
                    })
            }  else if (obj.searchBy === 'byCountry') {
                offersModel.sortingCompaniesByCountry(obj.geoObj.countryCode, obj.geoObj.countryName, obj.workOnSunday, obj.workOnSaturday, obj.onlyRegistered, obj.workHourStart, obj.workHourEnd)
                    .then(catalog => {
                        callback(null, catalog);
                    })
                    .catch(e => {
                        callback(e.message, null);
                    })
            } else {
                callback('search by ' + obj.searchBy + ' not provided', null);
            }

        })
    });
};