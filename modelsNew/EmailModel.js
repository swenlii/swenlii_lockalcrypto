var mysql = require('mysql');
var pool = require('./DBConnectionModel').returnPoolConnection();
var crypto = require('crypto');
var nodemailer = require('nodemailer');

class EmailModel {
    constructor() {
    }

    sendEmailToUser(emailObj) {
        return new Promise((resolve, reject) => {

            var transporter = nodemailer.createTransport({
                service: 'Yandex',
                auth: {
                    user: 'test_service@localcrypto.cloud',
                    pass: 'ZZjndaAzzkfZAAZh1x!'
                }
            });

            transporter.sendMail({
                from: 'test_service@localcrypto.cloud',
                to: emailObj.email,
                subject: emailObj.subject,
                html: emailObj.htmlText
            }, (error, infoSuccess) => {
                if (error) {
                    console.log("error in sending email: ", error);
                    return reject(error);
                } else {
                    console.log("success in sending email: ", infoSuccess);
                    return resolve(infoSuccess);
                }
            });
        })
    }

    async sendVerifOfferEmail(offerObj, userObj, approve_hash) {
        let emailObj = {};
        emailObj.email = userObj.email;
        emailObj.subject = "Confirmation of posting offer on localcrypto.cloud";
        emailObj.htmlText = '<p>Good day, <br />for confirmation click on the link below.</p>' +
            '<a href="https://localcrypto.cloud/approve/offer/' + approve_hash + '">https://localcrypto.cloud/approve/offer/' + approve_hash + '</a>' +
            '<p>Kind regards, <br />LocalCrypto.cloud</p>';

        try {
            var result = await this.sendEmailToUser(emailObj)
        } catch (e) {
            throw new Error(e)
        }

        return result;
    }

    async subscribeToNewsletter(subscribeObj) {

        try {
            var result = await pool.query("INSERT INTO userSubscriptionEmails(email, ip_address) VALUES(?, ?)", [subscribeObj.email, subscribeObj.ip]);
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') {
                throw Error('ER_DUP_ENTRY')
            } else {
                throw e
            }
        }

        let emailObj = {
            email: subscribeObj.email,
            subject: 'You have subscribed to the newsletter',
            htmlText: "<div style=\" font-family: Verdana, sans-serif; background-color: #4264EF; color: #1C1C1C; \"> <div style=\" width: 600px; background-image: url(https://sun9-57.userapi.com/c857216/v857216774/57a07/upGwbrOdgj0.jpg); background-size: 600px; height: 96px; color: white; text-align: center; vertical-align: middle; margin: auto; font-size: 30px; font-weight: 600; padding-top: 80px; font-family: Verdana, sans-serif; \"> CONGRATULATIONS! </div> <div style=\"background-image: url('https://sun9-60.userapi.com/c855620/v855620934/16fd9a/V5-4IXhR95k.jpg'); background-size: 600px; background-color: white; text-align: center; width: 600px; margin: auto; position: relative; padding-bottom: 2px; font-family: Verdana, sans-serif;\"> <p style=\"font-size: 30px; font-weight: bold; margin: 0px; padding-top: 20px; padding-bottom: 15px; color: #1C1C1C; font-family: Verdana, sans-serif;\">You have</p> <p style=\"font-size: 14px\">...successfully subscribed to our newsletter. Thanks for joining us.</p> <p style=\"font-size: 14px\"> Every now and again we will send you breaking news about <br/> cryptocurrency.</p> <p style=\"font-size: 14px\"> To make sure you receive all the emails, whitelist us.</p> <div style=\"width: 600px; color: #1C1C1C;\"> <div style=\"line-height: 1.7; width: 590px; height: 242px; vertical-align: top; font-size: 14px; margin-bottom: 40px\"> If you have any questions, comments, feedback please<br/> don’t hesitate to reply back to this email address.<br/> Our team is happy to help.<br/> <br/> Thank you,<br/> <a href=\"https://localcrypto.cloud\" style=\"text-decoration: none; color:#4264EF;\">LocalCrypto.cloud team.</a><br/> <div style=\"color:#BEBEBE; width: 100%; font-size: 20px; margin-top: 65px\"> <p style=\"display: inline-block; margin-left: 190px\">Follow us</p> <a href=\"https://twitter.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 120px\"><img alt=\"twitter\" src=\"https://sun9-42.userapi.com/c857216/v857216774/57a0e/0c4euB-fec0.jpg\"style=\"width: 20px;\"></a> <a href=\"https://www.facebook.com\" style=\"display: inline-block; margin-right: 10px; margin-left: 10px\"><img alt=\"facebook\" src=\"https://sun9-11.userapi.com/c857216/v857216774/579fd/TVZIYpx-mco.jpg\" style=\"width: 20px;\"></a> </div> </div> </div> </div> </div>"
        };


        try {
            let emailResponse = emailModel.sendEmailToUser(emailObj)
        } catch (e) {
            throw e
        }

        return 'all ok'
    }
}

module.exports = new EmailModel();
