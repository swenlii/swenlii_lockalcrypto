let currencyModel = require('./../modelsNew/CurrencyModel');
let offersModel = require('./../modelsNew/OffersModel');
let CONSTANTS = require('../CONSTANTS');

class IndexController {
    constructor() {}

    indexLoad(req, res) {
        let ejsData = {
            mapsGoogleApiKey: CONSTANTS.mapsGoogleApiKey
        };
        currencyModel.loadDefaultCurrency()
            .then(currencyObj => {
                ejsData.currencyObj = currencyObj;
                return offersModel.loadOffersByCrypto('byDefault', null, currencyObj.id, 'wts', null)
            })
            .then(offers => {
                ejsData.offers = offers;
                ejsData.realIp = req.realIp;
                ejsData.geoObj = req.geoObj;
                return currencyModel.getUsedCryptoRates()
            })
            .then(cryptoFiatRatesArr => {
                ejsData.cryptoFiatRatesArr = cryptoFiatRatesArr;
                res.render('index', ejsData)
            })
            .catch(e => {
                res.end(e.message)
            })
    }

    logout(req, res) {
        for (var prop in req.cookies) {
            if (!req.cookies.hasOwnProperty(prop)) {
                continue;
            }
            res.cookie(prop, '', {expires: new Date(0)});
        }
        res.redirect('/');
    }

    articles () {
        return [
            {
                href: 'five-myth-that-prevent',
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 0})
                }
            },
            {
                href: 'eleven-tips-to-help-you-get-new-clients',
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 1})
                }
            },
            {
                href: 'how-to-woo-a-recruiter-and-land-your-dream-job',
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 2})
                }
            },
            {
                href: 'sizteen-ridiculously-easy-ways-to-find-keep-a-remote-job',
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 3})
                }
            },
            {
                href: 'what-it-really-takes-to-make',
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 4})
                }
            },
            {
                href: 'capitalize-on-low-hanging-fruit-to-identify',
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 5})
                }
            },
            {
                href: 'override-the-digital-divide-with-additional',
                method: function (req, res){
                    res.render('articlePage.ejs', {articleNum: 6})
                }
            },
        ];
    }

    async loadManageOffers (req, res) {
        try {
            var idArr = JSON.parse(decodeURIComponent(req.params.idArr));//decryption
        } catch(e) {
            res.end(e.message);
        };

        var offers = [];

        for (var i = 0; i < idArr.length; i++){
            try {
                let offer = await offersModel.getOfferObj(idArr[i]);
                offers.push(offer);
            }
            catch(e) {
                res.end(e.message);
            };
        }

        var currencies = {};
        var error = null;

        currencyModel.getUsedCryptoRates()
            .then(obj => {
                currencies = obj;
                console.log('ok');
                res.render('monitorOffers.ejs', {offers: JSON.stringify(offers), currencies: JSON.stringify(currencies), error: JSON.stringify(error)});
            })
            .catch(e => {
                error = e.message;
                console.log(e);
                res.render('monitorOffers.ejs', {offers: JSON.stringify(offers), currencies: JSON.stringify(currencies), error: JSON.stringify(error)});
            });
    }
}

module.exports = new IndexController();