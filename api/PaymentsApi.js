let nodeGeocoder = require('node-geocoder');
var offersModel = require('./../modelsNew/OffersModel');
let currencyModel = require('./../modelsNew/CurrencyModel')
let authModel = require('./../modelsNew/AuthModel');
let emailModel = require('./../modelsNew/EmailModel')
let geoModel = require('./../modelsNew/GEOModel')
let obligatonModel = require('./../modelsNew/ObligationModel')


exports = module.exports = function (io, redisClient) {
    io.sockets.on('connection', function (socket) {
    console.log('auth api connection');


        socket.on('subscripeToPaymentStatus', function (obj, callback) {

            authModel.authByHash(obj.uHash)
                .then(userObj => {
                    socket.join('payments'+userObj.id, () => {
                        console.log('USER JOINED INTO payments'+userObj.id)
                        callback(null, 'success listening subscripeToPaymentStatus')

                    });
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('loadLastPayments', function (obj, callback) {
            authModel.authByHash(obj.uHash)
                .then(userObj => {
                    return obligatonModel.getAllPayments(userObj.id)
                })
                .then(payments => {
                    callback(null, payments)
                })
                .catch(e => {
                    console.log('loadLastPayments e', e);
                    callback(e.message, null)
                })
        })
        socket.on('disconnect', function () {
        });
    });
}
