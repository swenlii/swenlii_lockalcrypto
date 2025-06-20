let nodeGeocoder = require('node-geocoder');
var offersModel = require('./modelsNew/OffersModel');
let currencyModel = require('./modelsNew/CurrencyModel');
let authModel = require('./modelsNew/AuthModel');
let obligationModel = require('./modelsNew/ObligationModel');
let geoModel = require('./modelsNew/GEOModel');

exports = module.exports = function(io, redisClient){
    io.sockets.on('connection', function (socket) {

        console.log("here is basic API");
        var sessionid = socket.id;
         console.log(' %s sockets connected', io.engine.clientsCount);
        console.log("and here is socket.id", socket.id);


        // // ADD NEW CRYPTOCURRENCY & return object
        // socket.on('addNewCrypto', function (vopObj, callback) {
        //     console.log('add new crypto obj', vopObj);
        //
        //     if (typeof vopObj.fullName != "string" || typeof vopObj.shortName != "string" ) {
        //         callback('validation error', null);
        //         return;
        //     }
        //
        //     vopObj.fullName = vopObj.fullName.trim();
        //     vopObj.shortName = vopObj.shortName.trim();
        //
        //     if (vopObj.fullName.length < 2 || vopObj.shortName.length < 2 || typeof vopObj.isDivisible != "boolean") {
        //         callback('validation error', null);
        //         return;
        //     } else {
        //         if (vopObj.isDivisible == true) {
        //             vopObj.integerDivisible = 1;
        //         } else {
        //             vopObj.integerDivisible = 0;
        //         }
        //
        //         cryptoModel.addNewCrypto(vopObj, function(error, insertedId) {
        //             if (error) { callback(error, null); } else {
        //
        //               cryptoModel.getCurrencyById(insertedId, function(error, currencyObj) {
        //                   if (error) { callback(error, null); } else {
        //                   //  console.log('currencyObj', currencyObj);
        //                     callback(null, currencyObj);
        //                   }
        //               })
        //             }
        //         })
        //     }
        // });

        // socket.on('postSellOffer', function (sellObj, callback) {
        //     userModel.getUserObjectByToken(sellObj.userId, function (error, userObj) {
        //        if (error) { callback(error, null) } else {
        //
        //            sellObj.userObj = userObj;
        //            if (typeof userObj.email == "string" && userObj.email.includes("@") && userObj.email.length > 3) {
        //                sellObj.emailInOfferMoment = userObj.email;
        //            }
        //
        //            postOfferModel.insertSellOffer(sellObj, function (error, successObj) {
        //                if (error) {
        //                    callback(error, null);
        //                } else {
        //                    callback(null, successObj);
        //                }
        //            });
        //        }
        //     });
        //
        // });

        //
        // socket.on('initiatedTransaction', function (transObj, callback) {
        //
        //     transactionModel.initiateTransaction(transObj, function (error, userObj) {
        //         if (error) { callback(error, null); } else {
        //
        //             let outputHtml = '<div class="successOrderInfo">' +
        //                 '<p>Thank for you ordering! Seller was informed about you. You have opened conservation with seller on <a href="/deals/">Open deals</a> page. When you receive cryptocurrency, please click "Complete transaction". This gives ability to you write a review for seller and in common this support our project will be maximum anonymously, where all is driven by ratings & mutual trust.</p>' +
        //                 '</div>';
        //             // check if user have email
        //             if (!userObj.email || userObj.email.includes("@") == false) {
        //                 let emailHtml = '<div class="emailInfo" id="emailInfo'+userObj.transId+'">' +
        //                     '<h3>Attention!</h3><br /><p>Hello! For easily process enter your email' +
        //                     '<input type="email" id="fillEmail'+userObj.transId+'" /> ' +
        //                     '<input type="button" value="Set email" onclick="fillBuyerEmail('+userObj.transId+')"></p>' +
        //                     '<p>Or you can not enter email, just anonymously, but you can\'t clear cookie before your deal is complete <br />' +
        //                     '<input type="button" value="I dont want set email" onclick="unFillEmail('+userObj.transId+')"></p></div>';
        //                 outputHtml = outputHtml+emailHtml;
        //                 callback(null, outputHtml);
        //             } else {
        //                 callback(null, outputHtml);
        //             }
        //
        //
        //         }
        //     });
        // });

        // socket.on('fillBuyerEmail', function (setEmailObj, callback) {
        //     // 1 search deal
        //     // 2 search user by token
        //     // 3 compare if deal buyer_id & user_id by token is same
        //     // if yes, validate email, fill new email
        //
        //         transactionModel.getSellDealObjById(setEmailObj.dealId, function(error, dealObj) {
        //            if (error) { callback(error, null); } else {
        //
        //                userModel.getUserObjectByToken(setEmailObj.token, function(error, userObj) {
        //                    if (error) { callback(error, null); } else {
        //
        //                     if (dealObj.buyer_id == userObj.id) {
        //                         userModel.updateUserEmailById(dealObj.buyer_id, setEmailObj.email, function (error, response) {
        //                             if (error) { callback(error, null); } else {
        //
        //                              callback(null, response);
        //                             }
        //                         })
        //                     }
        //                    }
        //                })
        //            }
        //         });
        //
        // });

        // socket.on('buyerWantsAnonym', function (noEmailObj, callback) {
        //     transactionModel.getSellDealObjById(noEmailObj.dealId, function(error, dealObj) {
        //         if (error) { callback(error, null); } else {
        //
        //             userModel.getUserObjectByToken(noEmailObj.token, function(error, userObj) {
        //                 if (error) { callback(error, null); } else {
        //
        //                     if (dealObj.buyer_id == userObj.id) {
        //
        //                         transactionModel.setDealBuyerAnonym(noEmailObj.dealId, function (error, successResponse) {
        //                             if (error) { callback(error, null); } else {
        //
        //                                 callback(null, successResponse);
        //                             }
        //                         })
        //
        //                     }
        //                 }
        //             })
        //         }
        //     });
        // })


        // socket.on('getDealsCount', function (authToken, callback) {
        //     userModel.getUserObjectByToken(authToken, function (error, userObj) {
        //         if (error) { callback(error, null); } else {
        //
        //          dealsModel.getCountActiveSellDealsById(userObj.id, function (error, count) {
        //              if (error) { callback(error, null); } else {
        //
        //               callback(null, count);
        //              }
        //          })
        //         }
        //     })
        // });

        // redisClient.rpush(['deal'+chatObj.dealId, JSON.stringify(chatObj)], function(err, reply) {
        //     console.log(reply); //prints 2
        //
        //
        //     redisClient.lrange('deal'+chatObj.dealId, 0, -1, function(err, replyArr) {
        //         replyArr.forEach(function (oneMessage) {
        //
        //             console.log(oneMessage);
        //
        //         })
        //         console.log(replyArr);
        //     });
        // });
        // socket.on("sendChatMessage", function (chatObj, callback) {
        //    // console.log('sdfdsfdsfds' , chatObj.text);
        //    // console.log(chatObj.dealId);
        //     chatObj.date = Date.now();
        //     if (!chatObj.text || chatObj.text.length < 1) {
        //         callback('Error in text message', null);
        //     }
        //
        //     userModel.getUserObjectByToken(chatObj.authToken, function (error, userObj) {
        //        if (!error) {
        //             dealsModel.canUserAccessDeal(userObj.id, chatObj.dealId)
        //                 .then(dealObj => {
        //                     chatObj.authToken = null;   // reset
        //                     chatObj.userId = userObj.id;
        //                     chatObj.userName = false;
        //                     //console.log("hmm typeof userObj.name: ", typeof userObj.name);
        //                     if (typeof userObj.name == "string" && userObj.name.length > 1) {
        //                         chatObj.userName = userObj.name;
        //                     }
        //
        //                     redisClient.rpush(['deal'+chatObj.dealId, JSON.stringify(chatObj)], function (error, reply) {
        //                         if (!error) {
        //                             console.log('not errro');
        //                         //    socket.join(dealObj.hash);
        //                             io.sockets.to(dealObj.hash).emit('receiveChatMessage', chatObj);
        //                             callback(null, 'success sent message');
        //                         }
        //                     });
        //
        //
        //                 })
        //                 .catch(error => {
        //                     callback(error, null);
        //                 })
        //        }
        //     });
        //
        //
        // });

        // socket.on("writeReview", function (reviewObj, callback) {
        //     let userObj;
        //     let toUserId;
        //     let dealObj;
        //     userModel.getUserObjectByTokenA(reviewObj.authToken)
        //         .then(user => {
        //             userObj = user;
        //             return dealsModel.canUserAccessDeal(userObj.id, reviewObj.dealId)
        //         })
        //         .then(deal => {
        //             dealObj = deal;
        //             // to who we write review?
        //             toUserId = dealObj.seller_id;   // default
        //             if (Number.parseInt(toUserId) == Number.parseInt(userObj.id)) {
        //                 toUserId = dealObj.buyer_id;    // if same -> change places
        //             }
        //             return profileModel.canUserWriteReviewToUser(userObj.id, toUserId, dealObj.id)
        //         })
        //         .then(boolResult => {
        //             return profileModel.writeReviewToUser(userObj.id, toUserId, dealObj.id, reviewObj)
        //         })
        //         .then(insertId => {
        //             callback(null, insertId);
        //         })
        //         .catch(e => {
        //             callback(e.message, null);
        //         })
        // });

        // socket.on("canUserReview", function (reviewObj, callback) {
        //     let userObj;
        //     let toUserId;
        //     let dealObj;
        //     userModel.getUserObjectByTokenA(reviewObj.authToken)
        //         .then(user => {
        //             userObj = user;
        //             return dealsModel.canUserAccessDeal(userObj.id, reviewObj.dealId)
        //         })
        //         .then(deal => {
        //             dealObj = deal;
        //             // to who we write review?
        //             toUserId = dealObj.seller_id;   // default
        //             if (Number.parseInt(toUserId) == Number.parseInt(userObj.id)) {
        //                 toUserId = dealObj.buyer_id;    // if same -> change places
        //             }
        //             return profileModel.canUserWriteReviewToUser(userObj.id, toUserId, dealObj.id)
        //         })
        //         .then(boolResult => {
        //             callback(null, 'can');
        //         })
        //         .catch(e => {
        //             callback(e, null);
        //         })
        // });

        // socket.on("closeDeal", function (dealObj, callback) {
        //     userModel.getUserObjectByToken(dealObj.authToken, function (error, userObj) {
        //         if (!error) {
        //             console.log(userObj);
        //             dealsModel.canUserAccessDealAndIsBuyer(userObj.id, dealObj.dealId)
        //                 .then(dealObj => {
        //                     if (userObj.id == dealObj.buyer_id) {
        //                         console.log('sdfdsfdsfdscv111:', dealObj.dealId);
        //                         // close the deal
        //                         dealsModel.setDealAsComplete(dealObj)
        //                             .then(successString => {
        //                                 // send to chat message, that deal was closed
        //                                 io.sockets.to(dealObj.hash).emit('thisDealWasClosed', dealObj.buyer_id);
        //
        //                                 callback(null, successString);
        //                             })
        //                             .catch(error => {
        //                                 callback(error, null);
        //                             })
        //                     } else {
        //                         callback('not auth.', null);
        //                     }
        //                 })
        //                 .catch(error => {
        //                     callback(error, null);
        //                 })
        //         } else {
        //             callback(error, null);
        //         }
        //     })
        // })
        //
        // socket.on("saveUserDetailsProfile", function (profileObj, callback) {
        //    userModel.getUserObjectByToken(profileObj.token, function (error, userObj) {
        //       // validation
        //        /*
        //         var obj = {
        //         name : $("#name").val(),
        //         email : $("#email").val(),
        //         countryId : $("#country").val(),
        //         token : Cookies.get('userHash')
        //         }
        //         */
        //
        //        let countryId = parseInt(profileObj.countryId);
        //
        //        if (typeof profileObj.name == "string" && profileObj.name.length > 1) {
        //            userModel.changeUserNameById(profileObj.name, userObj.id)
        //        }
        //
        //        if (typeof countryId == "number" && countryId > 0) {
        //            userModel.changeCountryIdById(countryId, userObj.id);
        //        }
        //
        //        if (typeof profileObj.email == "string" && profileObj.email.length > 3 && profileObj.email.includes("@")) {
        //            let existEmail = userObj.email;
        //            let userHaventOldEmail = false;
        //            if (!existEmail || typeof existEmail != "string" || existEmail.length < 3 || (existEmail.includes("@") == false)) {
        //                userHaventOldEmail = true;
        //            }
        //
        //            userModel.initiateChangeEmailById(userObj.email, profileObj.email, userObj.id, userHaventOldEmail)
        //                .then(successResponse => {
        //                    callback(null, 'success email init. change');
        //                })
        //                .catch(error => {
        //                    callback('error with email change', null);
        //                })
        //        } else {
        //            callback(null, 'success change');    // db changes almost instant, only email sending is lengthy
        //        }
        //
        //    });
        // });

        // socket.on("authorizeUserHands", function (obj, callback) {
        //     let responseObj = {};
        //     userModel.getUserObjectByTokenA(obj.privateKey)
        //         .then(userObj => {
        //             responseObj.userHash = userObj.user_hash;
        //             return userModel.getCountryObjById(userObj.country_id)
        //         })
        //         .then(countryObj => {
        //             responseObj.countryCode = countryObj.country_code;
        //             callback(null, responseObj);
        //         })
        //         .catch(e => {
        //             callback(e.message, null);
        //         })
        // })

        socket.on("sealPayment", function (selObj, callback) {
            let vs;
            let vsCoinBase;
            let paymentObj;
            if (selObj.paymentMethod === 'coinbase') {
                authModel.authByHash(selObj.token)
                    .then(userObj => {
                        return obligationModel.sealPayment(selObj, userObj)
                    })
                    .then(sealObj => {
                        vs = sealObj.vs;
                        paymentObj = sealObj.paymentObj;
                        return obligationModel.generateCoinBaseCheckout(vs, sealObj.realAmount)
                    })
                    .then(coinBaseObj => {
                        console.log('inside .then coinBaseObj:', coinBaseObj);
                        vsCoinBase = coinBaseObj.id;
                        paymentObj.coinbaseiD = coinBaseObj.id;
                        return obligationModel.setCoinBaseIdToInvoice(vs, coinBaseObj.id)
                    })
                    .then(okString => {
                        let obj = {
                            vs,
                            vsCoinBase,
                            paymentObj
                        };
                        callback(null, obj);
                    })
                    .catch(e => {
                        console.log("sealPayment error:", e);
                        callback(e.message, null);
                    })
            } else if (selObj.paymentMethod === 'PlatonCoin') {
                authModel.authByHash(selObj.token)
                    .then(userObj => {
                        return obligationModel.sealPayment(selObj, userObj)
                    })
                    .then(sealObj => {
                        paymentObj = sealObj.paymentObj;
                        vs = sealObj.vs;
                        let obj = {
                            vs,
                            paymentObj
                        };
                        callback(null, obj);
                    })
                    .catch(e => {
                        console.log("sealPayment error:", e);
                        callback(e.message, null);
                    })
            } else {
                callback('no payment method choosed', null)
            }

        });

        socket.on('parseLatLongData', function (obj, callback) {

     //console.log("socket addr:",socket.address);

            console.log('obj:', obj)
            var options = {
              provider: 'here',
              appId: 'pYkZrOD5ecqpyCPBNzuO',
              appCode : 'ksdUbCl_x_j398Z6HXqebw',
              language: 'en'
            };

            let geocoder = nodeGeocoder(options);

            geocoder.reverse({lat:obj.lat, lon:obj.long})
              .then(function(res) {
                  console.log('result reverse:', res);
                callback(null, res);
              })
              .catch(function(err) {
                  console.log('err', err);
                callback(err.message, null);
              });

        });

        socket.on('autocompleteCrypto', function (searchString, callback) {
            if (typeof searchString !== "string" || searchString.length < 1) {
                callback('error with seach string', null)
            } else {
                currencyModel.getCryptoNames(searchString)
                    .then(arr => {
                        callback(null, arr);
                    })
                    .catch(e => {
                        callback(e.message, null)
                    })
            }
        })

        socket.on('readNeededCurrenciesSellOffers', function (obj, callback) {

            if (!obj.geoObj || !obj.selectedCurrencies || Array.isArray(obj.selectedCurrencies) === false) {
                callback('error security check readNeededCurrenciesSellOffers', null);
            }

            offersModel.loadMoreOffersByCryptoArr(obj)
                .then(offers => {
                    callback(null, offers);
                })
                .catch(e => {
                    callback(e.message, null);
                })
        });

        socket.on('getCountryByCode', function (obj, callback) {
            console.log('getCountryByCode', obj.code);
            geoModel.getCountryByCode(obj.code)
                .then(countryObj => {
                    console.log(countryObj);
                    if (countryObj){
                        callback(null, countryObj.country_name)
                    } else {
                        callback(null, null);
                    }
                })
                .catch(error => {
                    callback(error.message, null);
                })
        });


        socket.on('disconnect', function () {
        });
    });
}
