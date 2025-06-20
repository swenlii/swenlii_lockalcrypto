let MetrikaModel = require('./../modelsNew/MetrikaModel');

exports = module.exports = function (io, redisClient) {
    io.sockets.on('connection', function (socket) {
        console.log('metrika api connection');

        socket.on('getMetrikaData', function (subscribeObj, callback) {
            MetrikaModel.get()
                .then((result) => {
                callback(null, result);
            })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('disconnect', function () {
        });
    });
};
