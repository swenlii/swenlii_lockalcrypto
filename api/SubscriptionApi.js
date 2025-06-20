let emailModel = require('./../modelsNew/EmailModel');

exports = module.exports = function (io, redisClient) {
    io.sockets.on('connection', function (socket) {
        console.log('subscription api connection');

        socket.on('subscribeToNewsletter', function (subscribeObj, callback) {
            emailModel.subscribeToNewsletter(subscribeObj)
                .then(answerStr => {
                    callback(null, answerStr)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('disconnect', function () {
        });
    });
};