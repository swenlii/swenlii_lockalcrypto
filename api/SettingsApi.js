let authModel = require('./../modelsNew/AuthModel');
let settingsModel = require('./../modelsNew/SettingsModel');



exports = module.exports = function (io, redisClient) {
    io.sockets.on('connection', function (socket) {
        console.log('settings api connection');

        socket.on('changeUserPassword', function (obj, callback) {
            authModel.authByHash(obj.uHash)
                .then(user => {
                    if (user.password === obj.currentPassword) {

                        const credentials = {
                            id: user.id,
                            password: obj.newPassword
                        };

                        return settingsModel.changeUserPassword(credentials)

                    } else {

                        throw new Error('The current password you entered did not match our records. Please try again.')
                    }

                })
                .then(answer => {

                    callback(null, answer)
                })
                .catch(e => {

                    callback(e.message, null)
                })

        });

        socket.on('updateUserInfo', function (obj, callback) {
            authModel.authByHash(obj.uHash)
                .then(user => {

                    const infoObj = {
                        id: user.id,
                        firstName: obj.firstName,
                        lastName: obj.lastName,
                        email: obj.email,
                        newPhone: obj.newPhone,
                        countryCode: obj.countryCode
                    };

                    return settingsModel.updateUserInfo(infoObj)

                })

                .then(answerString => {

                    callback(null, answerString)
                })
                .catch(e => {

                    callback(e.message, null)
                })

        });

        socket.on('deleteUserAccount', function (obj, callback) {
            authModel.authByHash(obj.uHash)
                .then(user => {

                    const infoUser = {
                        id: user.id,
                    };

                    return settingsModel.deleteUserAccount(infoUser)

                })

                .then(answerString => {

                    callback(null, answerString)
                })
                .catch(e => {

                    callback(e.message, null)
                })

        });

        socket.on('uploadAvatar', function (obj, callback) {
            authModel.authByHash(obj.uHash)
                .then(user => {

                    obj.id = user.id;

                    return settingsModel.uploadAvatar(obj)

                })

                .then(answerString => {

                    callback(null, answerString)
                })
                .catch(e => {

                    callback(e.message, null)
                })

        });

        socket.on('disconnect', function () {
        });
    });
};
