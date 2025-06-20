var geoModel = new Vue({
    methods: {
        returnGeoPosition: function () {
            return new Promise((resolve, reject) => {

                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        let obj = {
                            lat: position.coords.latitude,
                            long: position.coords.longitude
                        }
                        socket.emit('parseLatLongData', obj, function (error, responseObj) {
                            if (error) {
                                return reject(error);
                            } else if (!Array.isArray(responseObj) || (responseObj && responseObj.length === 0)) {
                                return reject('Geo was not founded');
                            } else {
                                return resolve(responseObj[0]);
                            }
                        })
                    }, function (error) {
                        if (error) {
                            console.log('Error(' + error.code + '): ' + error.message);
                            return reject('Error(' + error.code + '): ' + error.message);
                        }
                        else {
                            console.log('Error: No permission to location');
                            return reject(new Error('No permission to location'));
                        }
                    });
                } else {
                    return reject(new Error('unavaliable'));
                }
            })
        },
        loadSellOffersByCity: function (clientGeoObj, currencySearchArr) {
            return new Promise((resolve, reject) => {
                let obj = {
                    clientGeoObj: clientGeoObj,
                    currencySearchArr: currencySearchArr,
                    searchBy: 'byCity',
                    sortBy : index.$data.sortBy
                };
                console.log('loadSellOffersByCity', obj);

                socket.emit('loadSellOffersByCity', obj, function (error, offers) {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(offers);
                    }
                })
            })
        },
        decodeLatLong: function (lat, long) {
         return new Promise((resolve, reject) => {
             let obj = {
                lat: lat,
                long: long
            };

            socket.emit('parseLatLongData', obj, function (error, responseObj) {
                if (error) {
                    return reject(error);
                } else if (!Array.isArray(responseObj) || (responseObj && responseObj.length === 0)) {
                    return reject('Geo was not founded');
                }
                else {
                    return resolve(responseObj[0]);
                }
            })
         })
        }
    }
});