var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var generatePassword = require('password-generator');
var crypto = require('crypto');
let emailModel = require('./EmailModel');
var fs = require('fs');
var path = require('path');

class SettingsModel {
    constructor() {
    }

    async changeUserPassword(credentials) {

        let user = await pool.query('SELECT * FROM `users` WHERE `id`=?',[credentials.id]);
        try {
            var result = await pool.query("UPDATE users SET password = ? WHERE id = ?", [credentials.password, credentials.id])
        } catch (e) {
            throw e
        }

        if (result.affectedRows === 1) {

            return 'all ok'
            let emailResult = await emailModel.sendEmailToUser({
                email: user[0].email,
                subject: 'Password Reset Successfully',
                htmlText: '<p><b>Hello, ' + user[0].name + ' ' + user[0].surname + '!</b></p><p>You have successfully changed your password.</p><p>Your new login details for our site:</p><br/><p><b>Login: </b>' + user[0].email + '</p><p><b>New password: </b>' + obj.password + '</p><br/><p>All the best and good mood to you!</p><p>LocalCrypto.cloud</p>',
            });

        } else {

            throw new Error(`affectedRows: ${result.affectedRows}`)
        }
    }

    async updateUserInfo(infoObj) {

        try {
            var result = await pool.query("UPDATE users SET telCountryCode = ?, telNumber = ?, name = ?, surname = ?, email = ?  WHERE id = ?", [infoObj.countryCode, infoObj.newPhone, infoObj.firstName, infoObj.lastName, infoObj.email, infoObj.id]);

            var user = await pool.query("SELECT users.isCompany FROM users WHERE id = ?", [infoObj.id]);
            if (user.length > 0 && user[0].isCompany) {
                var upd = await pool.query("UPDATE catalogOfExchanges SET phone = ?, email = ? WHERE userId = ?", [infoObj.countryCode + infoObj.newPhone, infoObj.email, infoObj.id]);
            }

            return 'all ok'
        } catch (e) {
            throw e
        }
    }

    async deleteUserAccount(infoUser) {

        try {
            var deals = await pool.query("SELECT * FROM localdb.deals WHERE sellerId = ? AND closedDeal = 0", [infoUser.id]);
            if(deals.length === 0) {
                var closeOffers = await pool.query("UPDATE `localdb`.`sell_offers` SET `closed_offer` = '1' WHERE user_id = ?", [infoUser.id]);
                var result = await pool.query("UPDATE `localdb`.`users` SET `status` = 'deleted' WHERE (`id` = ?)", [infoUser.id]);
            } else {
                throw Error('You have open deals. Please, close them and try again')
            }
        } catch (error) {
            throw error
        }

        return 'all ok'

    }

   async uploadAvatar(avatarObj) {
       const ext = avatarObj.type.split('/')[1];
       const fileName = `${avatarObj.id}.${ext}`;
       try {
           await fs.writeFileSync(path.join(__dirname, `../public/images/users/${fileName}`), avatarObj.FILE,);
           var result = await pool.query("UPDATE users SET avatarPath = ? WHERE id = ?", [fileName, avatarObj.id]);

           var user = await pool.query("SELECT users.isCompany FROM users WHERE id = ?", [avatarObj.id]);
           if (user.length > 0 && user[0].isCompany) {
               var upd = await pool.query("UPDATE catalogOfExchanges SET logoPath = ? WHERE userId = ?", [fileName, avatarObj.id]);
           }
           return fileName
       } catch (e) {
           throw e
       }
    }

}

module.exports = new SettingsModel();