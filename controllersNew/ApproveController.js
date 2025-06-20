let approveModel = require('./../modelsNew/ApproveModel');

class ApproveController {
    constructor() {}

    approveSellOffer (req, res) {

        if (typeof req.params.hash === "string" && req.params.hash.length > 10) {
            approveModel.approveSellOffer(req.params.hash)
                .then(success => {
                    res.cookie('approveStatus', 'yes');
                    res.redirect('/#approve-page');
                })
                .catch(e => {
                    res.end(e.message)
                })
        } else {
            res.end('error with hash');
        }
    }
    //
    // approveEmailChange (req, output) {
    //     if (typeof req.params.hash == "string" && req.params.hash.length > 10 && req.params.hash != "changed") {
    //
    //         approveModel.approveNewEmail(req.params.hash)
    //             .then(responseSuccess => {
    //                 output.render('shortMessage', { message: 'Your email has been changed successfully.', userObj : req.userObj, userObligations : req.userObligations });
    //             })
    //             .catch(error => {
    //                 console.log("error in approveEmailChange", error);
    //                 output.render('400', { errorMessage: error , userObj : req.userObj, userObligations : req.userObligations});
    //             })
    //     } else {
    //         output.render('404', { errorMessage: "Error with hash.", userObj : req.userObj, userObligations : req.userObligations });
    //     }
    // }
}

module.exports = new ApproveController();


