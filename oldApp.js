var http = require('http');
var bodyParser = require('body-parser');
var pool = require('./models/DBConnectionModel').returnPoolConnection();
var cookieParser = require('cookie-parser');
var client = require('redis').createClient();
var helmet = require('helmet');
var fs = require('fs');
var get_ip = require('ipware')().get_ip;


let authController = require('./controllers/AuthController');
let userModel = require('./models/UsersModel');

let obligationsModel = require('./models/ObligationsModel');

var options = {
    key: fs.readFileSync('./certificates/pr.key'),
    cert: fs.readFileSync('./certificates/localcrypto_cloud.crt'),
    ca: [fs.readFileSync('./certificates/localcrypto_cloud.ca-bundle')]
};


var express = require('express'),
    app = module.exports.app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(helmet.noCache());

// var router = express.Router();

var server = http.createServer(app);
// socket API
var io = require('socket.io').listen(server);  //pass a http.Server instance
var basicAPI = require('./api')(io, client);

server.listen(3005, function () {
    console.log('Example app here! 111z 3005');
});

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// don't change to standart way req.ip, because nginx proxy settings can always return 127.0.0.1
app.use(function(req, res, next) {
    //console.log('somebody do request');
    var ip_info = get_ip(req);
    req.realIp = ip_info.clientIp;
    next();
});


// i have always in req:
// userHash, countryObj, userObj, redisClient
// and full authorized user, otherwise user receive http 500 code
app.use(function(req,res,next){
    authController.authorizeUser(req, res, function (error, req, countryObj, userHash) {
        if (!error) {
            req.userHash = userHash;
            req.countryObj = countryObj;
            userModel.getUserObjectByToken(userHash, function (error, userObj) {
               if (!error) {
                   //console.log('i am insinde middleware');
                   req.userObj = userObj;
                   userModel.updateUserLastLogin(userObj.id)
                       .then(resultLastLogin => {
                           next();
                       })
                       .catch(e => {
                           console.log('ERROR updateUserLastLogin: ', e);
                           res.status(500).send('Something broke! updateUserLastLogin');
                           res.end();
                       })
               } else {
                   console.log('BAD TOKEN CHECK inside middleware:', error);
                   res.status(500).send('Something broke! getUserObjectByToken');
                   res.end();
               }
            });
        } else {
            console.log('BAD authorizeUser inside middleware', error);
            res.status(500).send('Something broke! authorizeUser');
            res.end();
        }
    });
});

app.use(function(req,res,next){
    req.redisClient = client;   // connect redis
    req.io = io;
   // console.log(client);
    next();
});

app.use(function(req,res,next) {
    // get user obligations
    obligationsModel.getUserUnPaidObligations(req.userObj.id)
        .then(userObligations => {
            req.userObligations = userObligations;
            return next();
        })
        .catch(error => {
            console.log('error with user obligations inside middleware');
            res.status(500).send('Something broke! authorizeUser');
            res.end();
        })
});

app.disable('x-powered-by');    // security


// app.get('/', function (req, res) {
//     pool.getConnection(function(error, connection) {
//         res.render('index', { title: 'Hey', message: 'Hello there!' })
//     })

// });

// routing require
let postController = require('./controllers/PostController');
let indexController = require('./controllers/IndexController');
let includeController = require('./controllers/IncludeController');
let approveController = require('./controllers/ApproveController');
let myDealsController = require('./controllers/MyDealsController');
let profileController = require('./controllers/ProfileController');
let obligationsController = require('./controllers/ObligationsController');

// routing: index
app.get('/', indexController.indexLoad);
app.get('/lol/', function (req, res) {
    console.log('helllo lol');
    res.end('bye bye');
})

// routing: profile
app.get('/profile/', profileController.baseProfileLoad);
app.get('/login/', profileController.login);

// routing: post offers
app.get('/post-sell-offer/', postController.postSellOffer);

// routing: deals
app.get('/deals/', myDealsController.baseLoad);
app.get('/deals/:dealId/', myDealsController.showDealOffer);

// routing: html parts
app.get('/parts/createSellOffer/', includeController.loadSellOfferCreation);

// routing: post offers
app.get('/obligations/', obligationsController.loadAllObligations);

// routing: approve parts
app.get('/approve/sell/:hash', approveController.approveSellOffer);
app.get('/approve/email/:hash', approveController.approveEmailChange);

// routing: users public profiles
app.get('/user/:userName', profileController.loadPublicProfile);
app.get('/user/anonymous/:userId', profileController.loadAnonymousProfile);

/* REST API */
app.post('/coinbase-webhookZ', (req, res) => {
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
                comissionIds = paymentObj.dealsIds;
                if (coinBaseObj.hasOwnProperty('confirmed_at')) {
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
                            });

                            if (findExpired === true) {
                                return obligationsModel.setCoinBaseAsExpired(paymentObj.id)
                            } else {
                                throw new Error('i recieve second time coinbaseCreatedAt, but withoit expired tag');
                            }
                        } else {
                            throw new Error('error in coinBaseObj.timeline count');
                        }
                    }
                }
            })
            .then(successMessage => {
                // go operate with comission rows
                // TODO CHECK WHAT THIS DO, WHY COMMISIONIDS IN setCoinBaseAsExpired
                if (what === "confirmed") {
                 return obligationsModel.markDealsAsComissionPaid(comissionIds)
                } else if (what === 'expired') {
                    return obligationsModel.setCoinBaseAsExpired(comissionIds)
                } else {
                    return successMessage
                }
            })
            .then(successMessage => {
                console.log('hmm, i am in successMessage:', successMessage);
                // send socket message to user and update UI

                let socketObj = {
                    id: paymentId,
                    what : 'unknown',
                    coinbaseiD : coinBaseObj.checkout.id,
                    dealIds : comissionIds
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
                    default:
                        console.log('I am inside coinbase-webhookZ successMessage block, but what variable has i dont know what:', what);
                }
                console.log('before io in');
                req.io.in('obligationsZ'+userId).emit('updatePaymentStatus',socketObj);
                console.log('after io in');
                // req.io.sockets.on('connection', function (socket) {
                //     console.log('sdfsdf sfsdfsd fsd');
                //     socket.broadcast.to('obligationsZ'+userId).emit('updatePaymentStatus', socketObj);
                //
                //     res.status(200).send({status: 200});
                // });

                res.status(200).send({status: 200});


            })
            .catch(e => {
                console.log('error in webhook!, e:', e);
                res.status(400).send({status: 400});
            });
    } else {
        console.log('no checkout id, coinBaseObj.timeline:', coinBaseObj.timeline);
        res.status(200).send({status: 'no id'});
    }



});
