// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    let os = require('os')

    var STARTING_PORT = 3020;
    var NUMBER_OF_WORKERS = os.cpus().length;   // 16

    for (var i = 0; i < NUMBER_OF_WORKERS; i++) {
        // Passing each worker its port number as an environment variable.
        cluster.fork({ port: STARTING_PORT + i });
    }

    cluster.on('exit', function(worker, code, signal) {
        // Create a new worker, log, or do whatever else you want.
        console.log('cluster exit with code:', code)
    });





// Code to run if we're in a worker process
} else {
    var http = require('http');
    var bodyParser = require('body-parser');
    var pool = require('./modelsNew/DBConnectionModel').returnPoolConnection();
    var cookieParser = require('cookie-parser');
    var client = require('redis').createClient();
    var helmet = require('helmet');
    var fs = require('fs');
    var get_ip = require('ipware')().get_ip;
    Number.prototype.trimNum = function (places, rounding) {
        rounding = rounding || "round";
        var num = parseFloat(this), multiplier = Math.pow(10, places);
        return (Number(Math[rounding](num * multiplier) / multiplier));
    }

    let authModel = require('./modelsNew/AuthModel');
    let dealsModel = require('./modelsNew/DealsModel');
    let currencyModel = require('./modelsNew/CurrencyModel');
    let obligationsModel = require('./modelsNew/ObligationModel');
    let notificationModel = require('./modelsNew/NotificationsModel');
    let settingsModel = require('./modelsNew/SettingsModel');
    let emailModel = require('./modelsNew/EmailModel');


    var options = {
        key: fs.readFileSync('./certificates/pr.key'),
        cert: fs.readFileSync('./certificates/localcrypto_cloud.crt'),
        ca: [fs.readFileSync('./certificates/localcrypto_cloud.ca-bundle')]
    };


    var express = require('express'),
        app = module.exports.app = express();
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use(helmet.noCache());

    var server = http.createServer(app);
// socket API
    var io = require('socket.io').listen(server);  //pass a http.Server instance
    var basicAPI = require('./api')(io, client);
    var offerAPI = require('./api/OfferApi')(io, client);
    var authAPI = require('./api/AuthApi')(io, client);
    var dealAPI = require('./api/DealApi')(io, client);
    var paymentsAPI = require('./api/PaymentsApi')(io, client);
    var settingsAPI = require('./api/SettingsApi')(io, client);
    var subscriptionAPI = require('./api/SubscriptionApi')(io, client);
    var metrikaApi = require('./api/MetrikaApi')(io, client);


    server.listen(process.env.port, function () {
        console.log('Example app here! 111z '+process.env.port+' 1');
    });

// set the view engine to ejs
    app.set('view engine', 'ejs');
    app.use(cookieParser());
    app.use(express.static(__dirname + '/public'));
    app.disable('x-powered-by');    // security

    let userDeals = {};
    var geoip = require('geoip-lite');

// don't change to standart way req.ip, because nginx proxy settings can always return 127.0.0.1
    app.use(function (req, res, next) {
       // console.log('somebody do request');
        var ip_info = get_ip(req);
        req.realIp = ip_info.clientIp;
        req.ioLink = io;

// after login in anywhere on website we need to reload page, in order to parse cookies and join user to socket room (or use REST instead socket for req obj)
        if (req.cookies && req.cookies.uHashL && req.cookies.uHashL.length > 1) {
            req.geoObj = null;
            console.log('authorization by uHash', req.geoObj);
            authModel.authByHash(req.cookies.uHashL)
                .then(userObj => {
                    return dealsModel.getUserDeals(userObj.id)
                })
                .then(foundedDeals => {
                    userDeals = foundedDeals;
                    next();
                })
                .catch(e => {
                    console.log('User has uHash, but error in authByHash', e)
                    //   res.cookie('uHashL', '', {expires: new Date(0)});
                    next();
                })
        } else {
           // console.log('no uhash user')
            if (req.realIp !== '::1' && req.realIp !== '::ffff:127.0.0.1'){ // first - localhost in chrome, second - in firefox
                console.log(req.realIp, '!= ::1');
                req.geoObj = geoip.lookup(req.realIp);
                console.log('Your geo: ' + req.geoObj);
            } else {
                req.geoObj = null;
                //req.geoObj = geoip.lookup('95.52.139.199');
                console.log('Geo position unavailable in localhost');
            }
            next();
        }
    });


    let indexController = require('./controllersNew/IndexController');
    let approveController = require('./controllersNew/ApproveController');



    //let testingModel = require('./modelsNew/TestingModel');

    // setInterval(() => {
    //   //  console.log('begin execute testingModel.insertSellOrder');
    //     testingModel.insertSellOrder()
    //         .then(result => {
    //             console.log('result', result)
    //         })
    //         .catch(e => {
    //             console.log('error testingModel.insertSellOrder', e)
    //         })
    // }, 10000);

//language-translate
    var  languageTranslator = require('language-translator');
    app.use(languageTranslator.init(
        {
            langs          : ["en", "cn", "hi", "es", "ar", "fr", "ms", "ru", "pt", "bn", "ja", "de"], // ... And other languages
            defaultLang    : "en",
            cookieName     : "lang",
            translate      : "true",
            translationApiKey: "trnsl.1.1.20191211T150132Z.1202d3e8ec0a8df5.7fd6ce84438b8b8a77950ad90aa716c766f81a7c"
        }));

// routing: index
    app.get('/', indexController.indexLoad);

// routing: approve parts
    app.get('/approve/offer/:hash', approveController.approveSellOffer);


// routing: logout
    app.get('/logout/', indexController.logout);

    app.get('/monitor-offers/:idArr', indexController.loadManageOffers);

    var articles;

    app.use(function (req, res, next) {
        var _lt = res.locals._lt;
        articles = [
            {
                href: _lt.get('href_of_article_1'),
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 0})
                }
            },
            {
                href: _lt.get('href_of_article_2'),
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 1})
                }
            },
            {
                href: _lt.get('href_of_article_3'),
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 2})
                }
            },
            {
                href: _lt.get('href_of_article_4'),
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 3})
                }
            },
            {
                href: _lt.get('href_of_article_5'),
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 4})
                }
            },
            {
                href: _lt.get('href_of_article_6'),
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 5})
                }
            },
            {
                href: _lt.get('href_of_article_7'),
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 6})
                }
            },
        ];
        for (var i = 0; i < articles.length; i++) {
            app.get('/' + articles[i].href, articles[i].method);
        }
        next();
    });

    app.get('/get-currencies', function (req, res) {
        currencyModel.getUsedCryptoRates()
            .then(obj => {
                console.log('ok');
                res.send(obj);
            })
            .catch(e => {
                console.log(e);
                res.send('Error: ' + e.message)
            });
    });


//app.get('/updateCryptoData/', (req, res) => {
    if (process.env.port === "3020") {    // only on one first worker process
        setInterval(() => {
                console.log('Currencies update start');
                currencyModel.initiateCryptoData('eur', '250', '1')
                    .then(okString => {
                        return currencyModel.initiateCryptoData('eur', '250', '2')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('eur', '250', '3')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('eur', '250', '4')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('eur', '250', '5')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('eur', '250', '6')
                    })
                    .then(okString => {
                        return currencyModel.initiateCryptoData('usd', '250', '1')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('usd', '250', '2')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('usd', '250', '3')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('usd', '250', '4')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('usd', '250', '5')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('usd', '250', '6')
                    })
                    .then(okString => {
                        return currencyModel.initiateCryptoData('czk', '250', '1')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('czk', '250', '2')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('czk', '250', '3')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('czk', '250', '4')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('czk', '250', '5')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('czk', '250', '6')
                    })
                    .then(okString => {
                        return currencyModel.initiateCryptoData('nzd', '250', '1')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('nzd', '250', '2')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('nzd', '250', '3')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('nzd', '250', '4')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('nzd', '250', '5')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('nzd', '250', '6')
                    })
                    .then(okString => {
                        return currencyModel.initiateCryptoData('rub', '250', '1')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('rub', '250', '2')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('rub', '250', '3')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('rub', '250', '4')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('rub', '250', '5')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('rub', '250', '6')
                    })
                    .then(okString => {
                        return currencyModel.initiateCryptoData('aud', '250', '1')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('aud', '250', '2')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('aud', '250', '3')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('aud', '250', '4')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('aud', '250', '5')
                    })
                    .then(ok => {
                        return currencyModel.initiateCryptoData('aud', '250', '6')
                    })
                    .then(ok => {
                        return currencyModel.getUsedCryptoRates()
                    })
                    .then(obj => {
                        console.log('Currencies update success');
                        // res.send('ok ');
                        io.sockets.emit('updateCryptoData', obj);
                    })
                    .catch(e => {
                        console.log('Error in interval update currency', e);
                        // res.send('aa ' + e.message)
                    })
            }, 10 * 60 * 1000);

        var metrikaModel = require('./modelsNew/MetrikaModel');
        setInterval(() => {
            metrikaModel.getFromRemote().then(() => {
                console.log('Metrika update succeed');
            }).catch((e) => {
                console.log('Metrika update error:', e.response ? e.response.data || e.response : e );
            });
        }, 5 * 60 * 1000);
    }

    app.get('/getCryptoData/', (req, res) => {
        currencyModel.getUsedCryptoRates()
            .then(obj => {
                console.log('ok');
                io.sockets.emit('updateCryptoData', obj);
                res.send('ok');
            })
            .catch(e => {
                console.log(e);
                res.send('aa ' + e.message)
            });
    });

    /* REST API */
    app.post('/coinbase-webhookZ/', (req, res) => {
        let coinBaseObj = req.body.event.data;
        let what;
        let userId;
        let paymentId;
        let comissionIds;
        console.log('hi! coinbase-webhookZ, coinBaseObj:', coinBaseObj);

        if (coinBaseObj.checkout && coinBaseObj.checkout.id) {
            obligationsModel.searchPaymentByCoinBaseId(coinBaseObj.checkout.id) // we have checkout id, not charge id (charge id is coinBaseObj.id)
                .then(paymentObj => {
                    userId = paymentObj.userId;
                    paymentId = paymentObj.id;
                    if (coinBaseObj.confirmed_at) {
                        console.log('payment was confirmed');

                        // set, that the payment was already confirmed?
                        if (!paymentObj.coinbaseConfirmedAt) {
                            what = 'confirmed';
                            return obligationsModel.setCoinBasePaymentAsConfirmed(paymentObj.id)
                        } else {
                            console.log("double webhook for already confirmed -> object in db -> then object received", paymentObj, coinBaseObj);
                            res.status(200).send({status: 200});
                        }
                    } else {
                        console.log('payment was not confirmed');
                        // set, that the payment was already created?
                        if (!paymentObj.coinbaseCreatedAt) {
                            what = 'created';
                            // as first set as created
                            return obligationsModel.setCoinBasePaymentAsStarted(paymentObj.id)
                        } else {
                            // if second time i receive coinbaseCreatedAt, but without coinbaseConfirmedAt, so it is delayed or expired
                            if (Array.isArray(coinBaseObj.timeline) && coinBaseObj.timeline.length > 0) {
                                let findExpired = false;
                                coinBaseObj.timeline.forEach(function (oneStatus) {
                                    if (oneStatus.status === 'EXPIRED') {
                                        what = 'expired';
                                        findExpired = true;
                                    }

                                    if (oneStatus.status === 'FAILED') {
                                        what = 'failed';
                                    }

                                    if (oneStatus.status === 'DELAYED') {
                                        what = 'delayed';
                                    }
                                });

                                if (findExpired === true) {
                                    return obligationsModel.setCoinBaseAsExpired(paymentObj.id)
                                } else if (what === 'failed') {
                                    return obligationsModel.setCoinBaseAsExpired(paymentObj.id)
                                } else if (what === 'delayed') {
                                    return obligationsModel.setCoinBaseAsDelayed(paymentObj.id)
                                } else {
                                    throw new Error('i recieve second time coinbaseCreatedAt, but without expired tag');
                                }
                            } else {
                                throw new Error('error in coinBaseObj.timeline count');
                            }
                        }
                    }
                })
                .then(successMessage => {
                    if (what === "confirmed") {
                        return obligationsModel.markDealsAsComissionPaid(paymentId)
                    } else if (what === 'failed' || what === 'expired') {
                        return obligationsModel.unmarkDealsAsComissionPaid(paymentId)
                    } else {
                        return successMessage
                    }
                })
                .then(successMessage => {
                    console.log('hmm, i am in successMessage coinbase:', successMessage);
                    // send socket message to user and update UI

                    let socketObj = {
                        id: paymentId,
                        what: 'unknown',
                        coinbaseiD: coinBaseObj.checkout.id
                    };
                    switch (what) {
                        case 'confirmed':
                            socketObj.what = 'confirmed';
                            break;
                        case 'created':
                            socketObj.what = 'created';
                            break;
                        case 'expired':
                            socketObj.what = 'expired';
                            break;
                        case 'failed':
                            socketObj.what = 'failed';
                            break;
                        case 'delayed':
                            socketObj.what = 'delayed';
                            break;
                        default:
                            console.log('I am inside coinbase-webhookZ successMessage block, but what variable has i dont know what:', what);
                    }

                    io.sockets.in('payments' + userId).emit('updatePaymentStatusCoinBase', socketObj);

                    res.status(200).send({status: 200});
                })
                .catch(e => {
                    console.log('error in coinbase webhook!, e:', e);
                    res.status(400).send({status: 400});
                });
        } else {
            console.log('no checkout id, coinBaseObj.timeline:', coinBaseObj.timeline);
            res.status(200).send({status: 'no id', coinBaseObj});
        }


    });
}
