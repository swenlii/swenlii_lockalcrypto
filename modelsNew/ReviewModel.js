var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();

class ReviewModel {
    constructor() {
    }

    async placeReview(fromUserId, dealObj, stars, comment) {
        if (!fromUserId || !stars || !dealObj) {
            throw new Error('bad review place data')
        }


        // first check if one review already was placed
        try {
            var checkRes = await pool.query("SELECT * FROM localdb.reviews WHERE authorId = ? AND dealId = ?", [fromUserId, dealObj.id])
        } catch (e) {
            throw e
        }

        if (checkRes.length > 0) {
            throw new Error('You already wrote a review for this deal.')
        }

        let toUserId = dealObj.sellerId;
        if (toUserId === fromUserId) {
            toUserId = dealObj.buyerId
        }

        try {
            var result = await pool.query("INSERT INTO `localdb`.`reviews` (`authorId`, `text`, `toUserId`, `dateCreated`, `stars`, `dealId`, offerId) VALUES (?, ?, ?, NOW(), ?, ?, ?)", [fromUserId, comment, toUserId, stars, dealObj.id, dealObj.offerId])
        } catch (e) {
            throw e
        }

        return 'success'
    }

    async readReviews(offerId) {
        if (!offerId && isNaN(parseInt(offerId))) {
            throw new Error('bad offer id')
        }

        try {
            var userFind = await pool.query("SELECT * FROM localdb.sell_offers WHERE id = ?", [offerId])
        } catch (e) {
            throw e
        }
        if (userFind.length === 0) {
            throw new Error('error finding offer')
        }

        let userToFind = userFind[0].user_id;

        try {
            var reviewsArr = await pool.query("SELECT reviews.*, timestampdiff(DAY, reviews.dateCreated, NOW()) as daysAgo, deals.spendCurrencyId, deals.amountSpend, deals.spendCurrencyType, deals.offerId as deals_offerId, deals.spendCurrencyShortCode, users.name as reviewerName, users.surname as reviewerSurname, users.avatarPath as reviewerAvatar, users.country_id as reviewerCountryId, users.cityId as reviewerCityId, cities.englishName as citiesEnglishName, countries.country_name as countriesCountryName, countries.country_code as countriesCountryCode  FROM localdb.reviews LEFT JOIN deals ON (reviews.dealId = deals.id) LEFT JOIN localdb.users ON (reviews.authorId = users.id) LEFT JOIN cities ON (users.cityId = cities.id) LEFT JOIN countries ON(users.country_id = countries.id) WHERE reviews.toUserId = ?", [userToFind])
        } catch (e) {
            throw e
        }

        return reviewsArr
    }



}

module.exports = new ReviewModel();