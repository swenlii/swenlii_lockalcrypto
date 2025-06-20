let nodeGeocoder = require('node-geocoder');
var offersModel = require('./../modelsNew/OffersModel');
let currencyModel = require('./../modelsNew/CurrencyModel')
let authModel = require('./../modelsNew/AuthModel');
let emailModel = require('./../modelsNew/EmailModel')
let geoModel = require('./../modelsNew/GEOModel')


exports = module.exports = function (io, redisClient) {
    io.sockets.on('connection', function (socket) {
    console.log('auth api connection');


        socket.on('getUserObjByHash', function (uHash, callback) {
            authModel.authByHash(uHash)
                .then(userObj => {

                    /*
                    front-end version
                      uHash : this.userObj.uHash,
                      name : this.userObj.name,
                      surname : this.userObj.surname,
                      avatarPath : this.userObj.avatarPath,
                      socketRef: this.userObj.socketRef,
                      role: 'User'
                     */

                    let obj = {
                        name : userObj.name,
                        surname: userObj.surname,
                        avatarPath: userObj.avatarPath,
                        socketRef: socket.id,
                        role: 'User',
                        uHash: userObj.user_hash,
                        id : userObj.id,
                        email: userObj.email,
                        isCompany: userObj.isCompany,
                        telCountryCode : userObj.telCountryCode,
                        telNumber: userObj.telNumber,
                        phone: (userObj.telCountryCode && userObj.telNumber) ?`+${userObj.telCountryCode}${userObj.telNumber}` : ''
                    };

                    callback(null, obj)

                })
                .catch(e => {
                    callback(e.message, null)
                })
        })


        socket.on('registerUser', function (userObj, callback) {
            authModel.registerUser(userObj)
                .then(user => {
                    callback(null, {uHash : user.user_hash});
                })
                .catch(err => {
                    console.log('auth api error register', err);
                    callback(err.message, null);
                });
        })

        socket.on('loginUser', function (userObj, callback) {
            authModel.authByEmailPass(userObj.email, userObj.pass)
                .then(userObj => {
                    callback(null, {uHash : userObj.user_hash})
                })
                .catch(e => {
                    callback(e.message, null)
                })
        })

        socket.on('restorePassword', function (obj, callback) {
            authModel.restorePassword(obj.email)
                .then((success) => callback(null, success))
                .catch((error) => {
                    callback(error.message, null);
                });
        });

        socket.on('checkRestorePasswordToken', function (restoreToken, callback) {
            authModel.checkRestorePasswordToken(restoreToken)
                .then((success) => callback(null, success))
                .catch((error) => {
                    callback(error.message, null);
                });
        });

        socket.on('resetPassword', function (obj, callback) {
            authModel.resetPassword(obj)
                .then((success) => callback(null, success))
                .catch((error) => {
                    callback(error.message, null);
                });
        });

        socket.on('disconnect', function () {
        });
    });
}
