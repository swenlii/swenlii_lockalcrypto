var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var generatePassword = require('password-generator');
var crypto = require('crypto');
let geoModel = require('./GEOModel');
let emailModel = require('./EmailModel');

class AuthModel {
    constructor() {
    }

    async authByEmailPassOrHash(email, password, uHash) {

        if (uHash && uHash.length > 4) {
            try {
                var userObj = await this.authByHash(uHash)
            } catch (e) {
                throw e
            }
            return userObj
        }

        else {
            try {
                var userObj = await this.authByEmailPass(email, password)
            } catch (e) {
                throw e
            }
            return userObj
        }
    }

    async authByEmailPass(email, password) {
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            console.log('password', password, email);
            throw new Error('validation error in auth modul')
        }

        if (password.length <= 5) {
            console.log('password', password);
            throw new Error('Password is very short (min length is 6)');
        }

        if (email.length < 5 || email.includes("@") === false || email.includes(".") === false) {
            console.log('email', email);
            throw new Error('Invalid email')
        }

        var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (re.test(email) === false) {
            console.log('email', email)
            throw new Error('Invalid email symbols')
        }

        try {
            var existUser = await pool.query("SELECT * FROM users WHERE email = ? AND status != 'deleted'", [email])
        } catch (e) {
            throw new Error(e)
        }

        if(existUser.length > 0) {
            try {
                var result = await pool.query("SELECT * FROM users WHERE email = ? AND password = ? AND status != 'deleted'", [email, password])
            } catch (e) {
                throw new Error(e)
            }

            if (result.length > 0) {
                return result[0]
            } else {
                throw new Error('Incorrect email/password combination')
            }
        } else {
            throw new Error('This email is not registered')
        }

    }

    async authByHash(uHash) {
        if (!uHash || uHash.length < 4) {
            throw new Error('empty hash')
        }
        try {
            var result = await pool.query("SELECT * FROM localdb.users WHERE user_hash = ? AND status != 'deleted'", [uHash])
        } catch (e) {
            throw e
        }

        if (result.length === 1) {
            return result[0]
        } else if (result.length > 1) {
            throw new Error('Error: found more than 1 user, uHash: ' + uHash)
        } else {
            throw new Error('Error: user not found, uHash: ' + uHash)
        }
    }

    async registerUser(obj) {
        if (!obj.firstName || obj.firstName.length <= 1) obj.firstName = 'Anonim';

        if (
            !obj.email || !obj.firstName || typeof obj.email !== 'string' || typeof obj.firstName !== 'string'
            || (obj.isCompany === true && (!obj.telNumber || !obj.telCountryCode || !obj.companyName || !obj.responsiblePerson || !obj.weekdaysWorkTimeStart || !obj.weekdaysWorkTimeEnd || !obj.countryName || !obj.countryCode || !obj.city || !obj.street))
            || !this.checkInputLength(obj)
            ) {
            throw Error('validation error in auth modul')
        }

        if (obj.email.length < 5 || obj.email.includes("@") === false || obj.email.includes(".") === false) {
            console.log('email', email);
            throw new Error('Invalid email')
        }

        if (obj.countryCode && obj.countryName) {
            try {
                let userCountry = await geoModel.insertCountryAndReturnObj({
                    countryCode: obj.countryCode,
                    countryName: obj.countryName,
                });
                obj.countryId = userCountry.id;
            } catch (e) {
                throw e;
            }
            if (obj.city && obj.zipCode){
                try {
                    let userCity = await geoModel.getCityObj(obj.city, obj.countryId, obj.zipCode, true);
                    obj.cityId = userCity.id;
                } catch (e) {
                    throw e;
                }
            }
        }

        const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
        var someSalt = 'fdgd1xviZ';
        var hashedTitle = sha256(obj.firstName + obj.email + someSalt);
        var userHash = hashedTitle + Math.random().toString(36).substr(2, 5) + new Date().getTime();

        var userPass = generatePassword(11);
        // may be pass was generated by user?
        if (obj.password && typeof obj.password === 'string' && obj.password.length >= 6) {
            userPass = obj.password;
        }

        try {
            var result = await pool.query(
                `INSERT INTO users
                 (name, email, country_id, user_hash, password, cityId, last_ip, surname, telCountryCode, telNumber,
                 isCompany, companyName, responsiblePerson, workOnWeekends, weekdaysWorkTimeStart, weekdaysWorkTimeEnd,
                  saturdayWorkTimeStart, saturdayWorkTimeEnd, sundayWorkTimeStart, sundayWorkTimeEnd, streetName, house, date_reg, lastLogin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [
                    obj.firstName,
                    obj.email,
                    obj.countryId,
                    userHash,
                    userPass,
                    obj.cityId,
                    obj.clientIp,
                    obj.lastName,
                    obj.telCountryCode,
                    obj.telNumber,
                    obj.isCompany,
                    obj.companyName,
                    obj.responsiblePerson,
                    obj.workOnWeekends,
                    obj.weekdaysWorkTimeStart,
                    obj.weekdaysWorkTimeEnd,
                    obj.saturdayWorkTimeStart,
                    obj.saturdayWorkTimeEnd,
                    obj.sundayWorkTimeStart,
                    obj.sundayWorkTimeEnd,
                    obj.street,
                    obj.house,
                ]
            );
        } catch (e) {
            if (e.message.includes('DUP')) {
                throw new Error('The email address you have entered is already registered!');
            } else {
                throw e;
            }
        }

        if (result.insertId > 0) {
            try {
                var userArray = await pool.query("SELECT * FROM users WHERE id = ?", [result.insertId])
            } catch (e) {
                throw e;
            }

            if (userArray.length > 0) {

               let emailObj = {
                   email: obj.email,
                   subject: 'You have registered on the localcrypto.cloud',
                   htmlText:
                       "<div style=\" font-family: Verdana, sans-serif; background-color: #4264EF; color: #1C1C1C; \"> <div style=\" width: 600px; background-image: url(https://sun9-57.userapi.com/c857216/v857216774/57a07/upGwbrOdgj0.jpg); background-size: 600px; height: 96px; color: white; text-align: center; vertical-align: middle; margin: auto; font-size: 30px; font-weight: 600; padding-top: 80px; font-family: Verdana, sans-serif; \"> WELCOME! </div> <div style=\"background-image: url('https://sun9-60.userapi.com/c855620/v855620934/16fd9a/V5-4IXhR95k.jpg'); background-size: 600px; background-color: white; text-align: center; width: 600px; margin: auto; position: relative; padding-bottom: 2px; font-family: Verdana, sans-serif;\"> <p style=\"font-size: 30px; font-weight: bold; margin: 0px; padding-top: 20px; padding-bottom: 15px; color: #1C1C1C; font-family: Verdana, sans-serif;\">to LocalCrypto</p> <p style=\"font-size: 14px\">You have registered successfully on <a href=\"https://localcrypto.cloud\" style=\"text-decoration: none;\">localcrypto.cloud</a></p> <div style=\" border: #4264EF 3px solid; margin: 10px 60px; padding: 10px; line-height: 2.0; background-color: #F3F7FF; font-size: 14px; color: #1C1C1C; \"> Save the details for access to your personal account: <br/> Login: <b>" +
                       obj.email + "</b><br/>Password: <b>" + obj.password +
                       "</b><br/> </div> <div style=\"width: 600px; color: #1C1C1C;\"> <div style=\"line-height: 1.7; width: 590px; height: 242px; vertical-align: top; font-size: 14px\"> If you have any questions, comments, feedback please<br/> don’t hesitate to reply back to this email address.<br/> Our team is happy to help.<br/> <br/> All the best and good mood to you!<br/> <a href=\"https://localcrypto.cloud\" style=\"text-decoration: none; color:#4264EF;\">LocalCrypto.cloud team.</a><br/> <div style=\"color:#BEBEBE; width: 100%; font-size: 20px; margin-top: 30px\"> <p style=\"display: inline-block; margin-left: 190px\">Follow us</p> <a href=\"https://twitter.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 120px\"><img alt=\"twitter\" src=\"https://sun9-42.userapi.com/c857216/v857216774/57a0e/0c4euB-fec0.jpg\"style=\"width: 20px;\"></a> <a href=\"https://www.facebook.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 10px\"><img alt=\"facebook\" src=\"https://sun9-11.userapi.com/c857216/v857216774/579fd/TVZIYpx-mco.jpg\" style=\"width: 20px;\"></a> </div> </div> </div> </div> </div>"
               };


               try {
                   let emailResponse = emailModel.sendEmailToUser(emailObj)
               } catch (e) {
                   throw e
               }

               if (obj.isCompany) {
                   try {
                       var company = await pool.query("SELECT catalogOfExchanges.* FROM localdb.catalogOfExchanges WHERE catalogOfExchanges.name = ?", [obj.companyName]);
                   } catch (e) {
                       throw e;
                   }

                   if (company.length > 0) {
                       var result = await pool.query("UPDATE catalogOfExchanges SET userId = ?, phone = ?, email = ?, countryId = ?, cityId = ?, workHourStart = ?, workHourEnd = ?, workOnSaturday = ?, workOnSunday = ? WHERE id = ?", [userArray[0].id, obj.telCountryCode + obj.telNumber, obj.email, obj.countryId, obj.cityId, obj.weekdaysWorkTimeStart, obj.weekdaysWorkTimeEnd, obj.saturdayWorkTimeStart && obj.saturdayWorkTimeEnd, obj.sundayWorkTimeStart && obj.sundayWorkTimeEnd, company[0].id])
                   }
                   else {
                       var result = await pool.query("INSERT INTO catalogOfExchanges (name, userId, countryId, cityId, phone, email, workHourStart, workHourEnd, workOnSaturday, workOnSunday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [obj.companyName, userArray[0].id, obj.countryId, obj.cityId, obj.telCountryCode + obj.telNumber, obj.email, obj.weekdaysWorkTimeStart, obj.weekdaysWorkTimeEnd, obj.saturdayWorkTimeStart && obj.saturdayWorkTimeEnd ? 1 : 0, obj.sundayWorkTimeStart && obj.sundayWorkTimeEnd ? 1 : 0])
                   }
               }

                return userArray[0]
            } else {
                throw new Error('cant find inserted user O_o');
            }

        } else {
            throw new Error('cant insert this user')
        }
    }

    checkInputLength(obj) {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'string' && obj[key].length === 0) {
                return false;
            }
        });
        return true;
    }

    async restorePassword (email) {
        if (!email) {
            throw Error('validation error in restore password module');
        }

        if (email.length < 5 || email.includes("@") === false || email.includes(".") === false) {
            console.log('email', email);
            throw new Error('Invalid email')
        }

        var token = crypto.randomBytes(36).toString('hex');
        try {
            let result = await pool.query('UPDATE `users` SET `restorePasswordHash`=? WHERE email=?', [token, email]);
            if (result.affectedRows === 0) {
                throw new Error('EmailNotExists');
            }
        } catch (err) {
            throw err;
        }

        try {
            let emailResult = await emailModel.sendEmailToUser({
                email,
                subject: 'Password Reset Link',
                htmlText: "<div style=\" font-family: Verdana, sans-serif; background-color: #4264EF; color: #1C1C1C; \"> <div style=\" width: 600px; background-image: url(https://sun9-57.userapi.com/c857216/v857216774/57a07/upGwbrOdgj0.jpg); background-size: 600px; height: 96px; color: white; text-align: center; vertical-align: middle; margin: auto; font-size: 30px; font-weight: 600; padding-top: 80px; font-family: Verdana, sans-serif; \"> HELLO! </div> <div style=\"background-image: url('https://sun9-60.userapi.com/c855620/v855620934/16fd9a/V5-4IXhR95k.jpg'); background-size: 600px; background-color: white; text-align: center; width: 600px; margin: auto; position: relative; padding-bottom: 2px; font-family: Verdana, sans-serif;\"> <p style=\"font-size: 30px; font-weight: bold; margin: 0px; padding-top: 20px; padding-bottom: 15px; color: #1C1C1C; font-family: Verdana, sans-serif;\">to LocalCrypto</p> <p style=\"font-size: 14px\">Someone recently requested password recovery for your account on <a href=\"https://localcrypto.cloud\" style=\"text-decoration: none; color:#4264EF;\">localcrypto.cloud</a></p> <p style=\"font-size: 14px\">To reset your password click <a href=\"https://localcrypto.cloud/?restore_token="
                    + token + "#restore-password\" style=\"text-decoration: none; color:#4264EF;\">this link.</a> </p> <p style=\"font-size: 14px\">This link can only be used once. <br/> If you didn’t mean to reset your password, please, ignore this email.</p> <div style=\"width: 600px\"> <div style=\"line-height: 1.7; width: 590px; height: 242px; vertical-align: top; font-size: 14px; margin-bottom: 30px\"> If you have any questions, comments, feedback please<br/> don’t hesitate to reply back to this email address.<br/> Our team is happy to help.<br/> <br/> All the best and good mood to you!<br/> <a href=\"https://localcrypto.cloud\" style=\"text-decoration: none; color:#4264EF;\">LocalCrypto.cloud team.</a><br/> <div style=\"width: 100%; font-size: 20px; margin-top: 50px\"> <p style=\"color:#BEBEBE; display: inline-block; margin-left: 190px\">Follow us</p> <a href=\"https://twitter.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 120px\"><img alt=\"twitter\" src=\"https://sun9-42.userapi.com/c857216/v857216774/57a0e/0c4euB-fec0.jpg\"style=\"width: 20px;\"></a> <a href=\"https://www.facebook.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 10px\"><img alt=\"facebook\" src=\"https://sun9-11.userapi.com/c857216/v857216774/579fd/TVZIYpx-mco.jpg\" style=\"width: 20px;\"></a> </div> </div> </div> </div> </div>"
            });
        } catch (err) {
            throw err;
        }
        return 'success';
    }

    async checkRestorePasswordToken (restoreToken) {
        if (!restoreToken || restoreToken.length === 0 || typeof restoreToken !== 'string') {
            throw Error('validation error in restore password module')
        }
        try {
            let result = await pool.query(
                'SELECT * FROM `users` WHERE `restorePasswordHash`=?',
                [restoreToken]
            );
            if (result.length === 0) {
                throw new Error('BadRestoreToken');
            }
        } catch (err) {
            throw err;
        }
        return 'success';
    }

    async resetPassword (obj) {
        if (!obj.restoreToken || obj.restoreToken.length === 0 || typeof obj.restoreToken !== 'string' ||
            !obj.password || typeof obj.password !== 'string' ||
            !obj.repeatPassword || typeof obj.repeatPassword !== 'string') {
            throw Error('validation error in restore password module')
        }
        if (obj.password !== obj.repeatPassword) {
            throw Error('Passwords do not match');
        }
        if (obj.password.length <= 5 || obj.repeatPassword.length <= 5) {
            throw Error ('Password very short (min length is 6)');
        }
        try {
            let user = await pool.query('SELECT * FROM `users` WHERE `restorePasswordHash`=?',[obj.restoreToken]);
            let updated = await pool.query(
                'UPDATE `users` SET `restorePasswordHash`=null, `password`=? WHERE `restorePasswordHash`=?',
                [obj.password, obj.restoreToken]
            );
            if (updated.affectedRows === 0) {
                throw new Error('BadRestoreToken');
            }
            else {
                if(user[0]) {
                    let emailResult = await emailModel.sendEmailToUser({
                        email: user[0].email,
                        subject: 'Password Reset Successfully',
                        htmlText: "<div style=\" font-family: Verdana, sans-serif; background-color: #4264EF; color: #1C1C1C; \"> <div style=\" width: 600px; background-image: url(https://sun9-57.userapi.com/c857216/v857216774/57a07/upGwbrOdgj0.jpg); background-size: 600px; height: 96px; color: white; text-align: center; vertical-align: middle; margin: auto; font-size: 30px; font-weight: 600; padding-top: 80px; font-family: Verdana, sans-serif; \"> CONGRATULATIONS! </div> <div style=\"background-image: url('https://sun9-60.userapi.com/c855620/v855620934/16fd9a/V5-4IXhR95k.jpg'); background-size: 600px; background-color: white; text-align: center; width: 600px; margin: auto; position: relative; padding-bottom: 2px; font-family: Verdana, sans-serif;\"> <p style=\"font-size: 30px; font-weight: bold; margin: 0px; padding-top: 20px; padding-bottom: 15px; color: #1C1C1C; font-family: Verdana, sans-serif;\">to LocalCrypto</p> <p style=\"font-size: 14px\">You have successfully changed your password on <a href=\"https://localcrypto.cloud\" style=\"text-decoration: none; color:#4264EF;\">localcrypto.cloud</a></p> <div style=\" border: #4264EF 3px solid; margin: 10px 60px; padding: 10px; line-height: 2.0; background-color: #F3F7FF; font-size: 14px; color: #1C1C1C; \"> Save the new details for access to your personal account: <br/> Login: <b>" +
                            user[0].email + "</b><br/> Password: <b>" + obj.password +
                            "</b><br/> </div> <div style=\"width: 600px; color: #1C1C1C;\"> <div style=\"line-height: 1.7; width: 590px; height: 242px; vertical-align: top; font-size: 14px; margin-bottom: 20px\"> If you have any questions, comments, feedback please<br/> don’t hesitate to reply back to this email address.<br/> Our team is happy to help.<br/> <br/> All the best and good mood to you!<br/> <a href=\"https://localcrypto.cloud\" style=\"text-decoration: none; color:#4264EF;\">LocalCrypto.cloud team.</a><br/> <div style=\"color:#BEBEBE; width: 100%; font-size: 20px; margin-top: 20px\"> <p style=\"display: inline-block; margin-left: 190px\">Follow us</p> <a href=\"https://twitter.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 120px\"><img alt=\"twitter\" src=\"https://sun9-42.userapi.com/c857216/v857216774/57a0e/0c4euB-fec0.jpg\"style=\"width: 20px;\"></a> <a href=\"https://www.facebook.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 10px\"><img alt=\"facebook\" src=\"https://sun9-11.userapi.com/c857216/v857216774/579fd/TVZIYpx-mco.jpg\" style=\"width: 20px;\"></a> </div> </div> </div> </div> </div>"
                    });
                }
            }
        } catch (err) {
            throw err;
        }

        return 'success';
    }
}

module.exports = new AuthModel();
