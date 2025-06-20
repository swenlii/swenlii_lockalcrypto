$(document).ready(function() {
    // $("#depositeMax").keyup(function (event) {
    //    alert('dsfsd1f');
    // });
  // alert('sdfdsf');
});



function createSellOffer() {

    $("#sellOfferCreation").load( "/parts/createSellOffer/", function () {

        insertCryptoName(document.getElementById('currencySelect'));
        insertFiatName(document.getElementById('fiatCurrencySelect'));

        $('#depositeMax').keypress(function (e) {
            if (e.which == 44) {
                e.preventDefault();
                alert('To divide the amount into decimal numbers, please use a dot.');
            }
        });

        $('#howMuchReceiveFiat').keypress(function (e) {
            if (e.which == 44) {
                e.preventDefault();
                alert('To divide the amount into decimal numbers, please use a dot.');
            }
        });

        $("#howMuchReceiveFiat").on("keyup", function (event) {
           //alert(this.value);
            if ($.isNumeric(this.value) == false || $.isNumeric($("#depositeMax").val()) == false) {
                return;
            }

            var amount = parseFloat($("#depositeMax").val()*$("#howMuchReceiveFiat").val());
            var comissionText = "Fee is 1% from the transaction. It is paid in the fiat. In your case, the Fee will be: "+(amount*0.01)+ " "+$("#fiatCurrencySelect").find("option:selected").text()+" or less (if you sell less, then all deposite). Paid after a successful transaction in 7 days term.";
            $("#comissionCalculation").text(comissionText);
        });

        $("#depositeMax").on("keyup", function (event) {
            //alert(this.value);
            if ($.isNumeric(this.value) == false || $.isNumeric($("#howMuchReceiveFiat").val()) == false) {
                return;
            }

            var amount = parseFloat($("#depositeMax").val()*$("#howMuchReceiveFiat").val());
            var comissionText = "Fee is 1% from the transaction. It is paid in the fiat. In your case, the Fee will be: "+(amount*0.01)+ " "+$("#fiatCurrencySelect").find("option:selected").text()+" or less (if you sell less, then all deposite). Paid after a successful transaction in 7 days term.";
            $("#comissionCalculation").text(comissionText);
        });
    } );
}

function createBuyOffer() {

}

function sendSellOffer(userEmail) {
    var emailFormed = userEmail;

    if (emailFormed == "false") {   // bool passed as string from ejs
        emailFormed = $.trim($("#userEmail").val());
    }

   var sellObj = {
        cryptoId : $.trim($("#currencySelect").val()),
        fiatId : $.trim($("#fiatCurrencySelect").val()),
        deposite : $.trim($("#depositeMax").val()),
        exchangeRate : $.trim($("#howMuchReceiveFiat").val()),
        canUserBuyOnlyAll : $.trim($("#canUserDivideOffer").is(':checked')),
        sellingCountryId : $.trim($("#countriesList").val()),
        canSellByBank : $.trim($("#checkBankPayment").is(':checked')),
        canSellByPersonalMeeting : $.trim($("#checkPersonalMeeting").is(':checked')),
        cannSellByExchange : $.trim($("#checkOtherCoins").is(':checked')),
        cannSellByPaypal : $.trim($("#checkPaypal").is(':checked')),
        shortTitle : $.trim($("#titleOffer").val()),
        descr : $.trim($("#offerDescription").val()),
        emailInOfferMoment : emailFormed,
        userId : Cookies.get('uHashL')
   };

    console.log("before send sellObj: ", sellObj);
    // basic validation
    if (sellObj.fiatId == '' || sellObj.deposite == '' || sellObj.exchangeRate == '' || sellObj.sellingCountryId == '' || sellObj.shortTitle == '' || sellObj.descr == '' || sellObj.emailInOfferMoment == '') {
        alert('Please, fill all fields.');
        return;
    }

    if ($.isNumeric(sellObj.cryptoId) === false || $.isNumeric(sellObj.fiatId) === false || $.isNumeric(sellObj.deposite) === false || $.isNumeric(sellObj.exchangeRate) === false || $.isNumeric(sellObj.sellingCountryId) === false) {
        alert('Please enter only numbers in the numeric fields.');
        return;
    }

    socket.emit('postSellOffer', sellObj, function(error, responseObj) {
       if (error) {
           alert('Sorry, some error in sending the sell offer.');
       } else {
           console.log('success posting ', responseObj);
           $("#sellOfferCreation").html("<b>Thank you, now you will receive email with approve link. ("+sellObj.emailInOfferMoment+")</b>");
       }
    });



}

function showDescrDiv(event, id) {
    event.preventDefault();
    $("#actionId"+id).toggle();
}

function calculateInfo(event, thisObj, exchangeRate, id, deposite, name) {
 //   console.log(arguments);

    if ($.isNumeric(thisObj.value) == false) {
        thisObj.value = '0';
        $("#infoAmount"+id).text('0');
        return;
    }
    var amount = thisObj.value*exchangeRate;
    // console.log('thisObj.value: ', thisObj.value);
    // console.log('deposite: ', deposite);

    if (deposite < thisObj.value) {
        alert('The user does not have so much '+name+'.');
        thisObj.value = '0';
        $("#infoAmount"+id).text('0');
        return;
    }

    $("#infoAmount"+id).text(amount.toFixed(2));
    //console.log('good ', thisObj.value*exchangeRate);
}

function initiateTransaction(thisObj, id) {

    var paymentsType = $("#paymentsOptions"+id).val();
    if (typeof paymentsType != "string" || paymentsType == "select") {
        alert('Please, select payment type');
        return;
    }

    var cryptoAmount = $("#buyCryptoList"+id).val();
    var fiatAmount = $("#infoAmount"+id).text();
    // initiatedTransaction
    var transObj = {
        cryptoAmount: cryptoAmount,
        fiatAmount: fiatAmount,
        offerId: id,
        token: Cookies.get('uHashL'),
        payment: paymentsType
    };
    
    $("#buyCryptoList"+id).prop('disabled', true);
    $("#paymentsOptions"+id).prop('disabled', true);
    $(thisObj).hide();

    socket.emit('initiatedTransaction', transObj, function (error, responseHtml) {
        if (error) {
            alert('Sorry, some error, try later');
            console.log('error initiatedTransaction:', error);
            return;
        } else {
            $("#initiatedTransaction"+id).html(responseHtml);
        }
    });

    console.log(cryptoAmount+" "+fiatAmount);
}

function fillBuyerEmail(dealId) {
    var setEmailObj = {
        dealId: dealId,
        token: Cookies.get('uHashL'),
        email : $("#fillEmail"+dealId).val()
    };

    socket.emit('fillBuyerEmail', setEmailObj, function(error, response) {
        if (error) {
            console.log(error);
            alert('Here is some error, try later');
        } else {
            $("#emailInfo"+dealId).hide();
            console.log('success fill email: ', response);
            alert('Success filled email');
        }
    });
}

function unFillEmail(dealId) {
    var noEmailObj = {
        dealId: dealId,
        token: Cookies.get('uHashL')
    };

    socket.emit('buyerWantsAnonym', noEmailObj, function(error, responseString) {
        if (error) {
            console.log(error);
            alert(error);
        } else {
            $("#emailInfo"+dealId).hide();
            alert('Success set deal as anonym');
        }
    });
}
function revealInitiateButton(thisObj, id) {
    if (thisObj.value != "select") {
        $("#initiateButton"+id).show();
    } else {
        $("#initiateButton"+id).hide();
    }
}

function showAddCryptoBlock(event) {
    event.preventDefault();
    $("#addNewCrypto").toggle();
}





function insertCryptoName(inputObj) {
   // console.log("hehe.", inputObj);
    var cryptoName = $(inputObj).find("option:selected").text();
    $("#selectedCrypto").text(cryptoName);
    $("#selectedCrypto2").text(cryptoName);
    $("#selectedCrypto3").text(cryptoName);
}

function insertFiatName(inputObj) { 
    // console.log("hehe.", inputObj);
     var fiatName = $(inputObj).find("option:selected").text();
     $("#selectedFiat").text(fiatName);
 }

function addNewCryptoForm() {

    if ($("#newCrypto").val().length < 2) {
        $("#newCrypto").css({
            'border-bottom': '1px solid orange'
        });

        alert ('Please, fill cryptocurrency name.');
        return;
    } else {
        $("#newCrypto").css({
            'border-bottom': '1px solid green'
        });
    }

    if ($("#shortCrypto").val().length < 2) {
        $("#shortCrypto").css({
            'border-bottom': '1px solid orange'
        });

        alert ('Please, fill shortcode.');
        return;
    } else {
        $("#shortCrypto").css({
            'border-bottom': '1px solid green'
        });
    }

    var obj = {
        fullName : $("#newCrypto").val(),
        shortName : $("#shortCrypto").val(),
        isDivisible : $("#isDivided").is(":checked")
    }
    socket.emit('addNewCrypto', obj, function(error, insertedCurrencyObj) {
        if (error) {
            console.log(error);
            alert('Some error, please try later');
        } else {
            $("#addNewCrypto").hide();
            $('#currencySelect').val('');
            $('#currencySelect').append('<option selected value="'+insertedCurrencyObj.id+'">'+insertedCurrencyObj.name+'</option>');
        }
    })
}