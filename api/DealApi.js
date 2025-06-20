let nodeGeocoder = require('node-geocoder');
var offersModel = require('./../modelsNew/OffersModel');
let currencyModel = require('./../modelsNew/CurrencyModel')
let authModel = require('./../modelsNew/AuthModel');
let emailModel = require('./../modelsNew/EmailModel')
let geoModel = require('./../modelsNew/GEOModel')
let dealsModel = require('./../modelsNew/DealsModel')
let notifModel = require('./../modelsNew/NotificationsModel')
let reviewModel = require('./../modelsNew/ReviewModel')

exports = module.exports = function (io, redisClient) {
    io.sockets.on('connection', function (socket) {

        console.log('deal api connection after 2222 ZZZ');

        socket.on('initiateDeal', function (dealObj, callback) {
            authModel.authByHash(dealObj.uHash)
                .then(buyerObj => {

                    if (dealObj.offerObj.offerType === 'exch') {
                        dealObj.infoCurrency = dealObj.offerObj.symbol;
                    }

                    return dealsModel.initiateTransaction(buyerObj, dealObj)
                })
                .then(dealResultObj => {

                    socket.join('dealId' + dealResultObj.insertId, () => {



                        // send to offer owner notification
                        let saveObj = {
                            userId: dealObj.offerObj.user_id,
                            dealId: dealResultObj.insertId,
                            what: 'sell',
                            textDescr: `You received an order for ${dealObj.neededAmount} ${dealObj.offerObj.short_code} for ${dealObj.infoPayAmount} ${dealObj.infoCurrency}.`,
                            testDescrHtml: `You received an order for <strong>${dealObj.neededAmount} ${dealObj.offerObj.short_code}</strong> for <span class="color">${dealObj.infoPayAmount} ${dealObj.infoCurrency}.</span>`,
                            possibleAmount: dealObj.neededAmount,
                            cryptoShortCode: dealObj.offerObj.short_code
                        };

                        io.sockets.in('offerId' + dealResultObj.offerId).emit('newDeal', saveObj);
                        return notifModel.saveNotification(saveObj)
                    });
                })
                .then(saveInfo => {
                    callback(null, saveInfo)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        })

        socket.on('readPaidUserDeals', function (userObj, callback) {
            console.log('readUserDeals inside socket on')
            authModel.authByHash(userObj.uHash)
                .then(user => {
                    return dealsModel.getPaidUserDeals(user.id)
                })
                .then(deals => {
                    // deals.forEach((oneDeal, index) => {
                    //     socket.join('dealId' + oneDeal.id, () => {
                    //         if ((index+1) === deals.length) {
                    //             callback(null, deals)
                    //         }
                    //     });
                    // })
                    // заджойнить юзера в его дилы нужно было при логине или первом заходе, а не тогда, когда он тут на страницу заходит
                    callback(null, deals)
                })
                .catch(e => {
                    callback(e.message, null)
                })

        })

        socket.on('readUserDeals', function (userObj, callback) {
            console.log('readUserDeals inside socket on')
            authModel.authByHash(userObj.uHash)
                .then(user => {
                    return dealsModel.getUserDeals(user.id)
                })
                .then(deals => {
                    // deals.forEach((oneDeal, index) => {
                    //     socket.join('dealId' + oneDeal.id, () => {
                    //         if ((index+1) === deals.length) {
                    //             callback(null, deals)
                    //         }
                    //     });
                    // })

                    deals.sort(function compare(a, b) {
                        if (a.generatedDate > b.generatedDate) {
                            return -1;
                        }
                        if (a.generatedDate < b.generatedDate) {
                            return 1;
                        }
                        return 0;
                    });
                    callback(null, deals)
                })
                .catch(e => {
                    callback(e.message, null)
                })

        })

        socket.on('getUserMessages', function (userObj, callback) {
            authModel.authByHash(userObj.uHash)
                .then(user => {
                    return dealsModel.getAllUserDeals(user.id)
                })
                .then(({deals, id}) => {
                    var messageArr = [];
                    deals.forEach(function(item, i){
                        socket.join(item.id);
                        redisClient.lrange('deal' + item.id, 0, -1, function (err, replyArr) {
                            if (err) {
                                callback(err.message, null)
                            } else {
                                messageArr.push(...replyArr);
                                if (i >= deals.length-1) {
                                    messageArr = messageArr.map(function(item) {
                                        return JSON.parse(item)
                                    });
                                    var filterMessageArr = messageArr.filter(message => message.userId !== id);
                                    callback(null, filterMessageArr)
                                }
                            }
                        });
                    });
                })
                .catch(e => {
                    callback(e.message, null)
                })

        })

        socket.on('loadDealAndMessages', function (obj, callback) {
            if (!obj || !obj.dealId || Number.isInteger(obj.dealId) === false) {
                callback('bad deal id', null)
            }

            authModel.authByHash(obj.uHash)
                .then(userObj => {
                    return dealsModel.isUserHasRightsToAcessDeal(userObj.id, obj.dealId)
                })
                .then(userId => {
                    return dealsModel.getDealObj(obj.dealId, userId);
                })
                .then(dealObj => {

                    console.log('deal' + dealObj.id)
                    redisClient.lrange('deal' + dealObj.id, 0, -1, function (err, replyArr) {
                        if (err) {
                            callback(err.message, null)
                        } else {
                            socket.join(dealObj.id);
                            console.log('replyArr', replyArr);
                            callback(null, {dealObj, replyArr})
                        }
                    });

                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('pushMessageToDeal', function (obj, callback) {
            let chatObj;
            authModel.authByHash(obj.uHash)
                .then(userObj => {
                    if (!obj.message || typeof obj.message !== 'string' || obj.message.length <= 0) {
                        throw new Error('You entered an empty message.')
                    }
                    chatObj = {
                        userId: userObj.id,
                        avatarPath: userObj.avatarPath,
                        userName: userObj.name + ' ' + userObj.surname,
                        time: Date.now(),
                        message: obj.message
                    };
                    return dealsModel.isUserHasRightsToAcessDeal(userObj.id, obj.dealId)
                })
                .then(stringResult => {

                    redisClient.rpush(['deal' + obj.dealId, JSON.stringify(chatObj)], function (err, reply) {
                        if (err) {
                            callback(err.message, null)
                        } else {
                            socket.broadcast.to(obj.dealId).emit('message', chatObj);
                            callback(null, chatObj)
                        }
                    });
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('cancelDeal', function (obj, callback) {
            let userObj;
            authModel.authByHash(obj.uHash)
                .then(user => {
                    userObj = user;
                    return dealsModel.isUserHasRightsToAcessDeal(userObj.id, obj.dealObj.id)
                })
                .then(stringRes => {
                    return dealsModel.cancelDeal(obj.dealObj.id, userObj.id)
                })
                .then(role => {
                    callback(null, role)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        })

        socket.on('setDealAsComplete', function (obj, callback) {
            let userObj;
            authModel.authByHash(obj.uHash)
                .then(user => {
                    userObj = user
                    return dealsModel.isUserHasRightsToAcessDeal(userObj.id, obj.dealObj.id)
                })
                .then(stringRes => {
                    return dealsModel.setDealAsPaid(obj.dealObj.id)
                })
                .then(updateDealObj => {
                    callback(null, {paidDate: updateDealObj.paidDate, paidDateF: updateDealObj.paidDateF})
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('reviewDeal', function (obj, callback) {
            let userObj;
            authModel.authByHash(obj.uHash)
                .then(user => {
                    userObj = user;
                    return dealsModel.isUserHasRightsToAcessDeal(userObj.id, obj.dealId)
                })
                .then(okSting => {
                    return dealsModel.getDealObj(obj.dealId)
                })
                .then(dealObj => {
                    return reviewModel.placeReview(userObj.id, dealObj, obj.stars, obj.comment)
                })
                .then(successOk => {
                    callback(null, successOk)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });







        socket.on('disconnect', function () {

        });
    });
}