function sealPayment(totalAmount, dealsIds, paymentMethod) {
    var obj = {
        totalAmount : totalAmount,
        dealsIds : dealsIds,
        token : Cookies.get('uHashL'),
        paymentMethod : paymentMethod
    };


    socket.emit("sealPayment", obj, function (error, vsObj) {
        if (error) {
            alert('Sorry, some error, try later or contact support');
        } else {
            // // 1 show payment div
            // $("#paymentBankInfo").show();
            // $("#vsPay").text(vsObj.vs);
            // $("#vsPay2").text(vsObj.vs);
            // change UI (also implement same UI change after first page load)
            var allDealsArr = JSON.parse(dealsIds);

            console.log('array:', allDealsArr);
            allDealsArr.forEach(function (oneDeal) {
                $("#obligation"+oneDeal).css('opacity', '0.3');
                $("#obStatus"+oneDeal).text('Reserved');
            });

            $("#buttonInit").hide();
            $("#paymentToCoinBase").attr('href', 'https://commerce.coinbase.com/checkout/'+vsObj.vsCoinBase);
            $("#paymentToCoinBase").show();

            //window.open('https://commerce.coinbase.com/checkout/'+vsObj.vsCoinBase, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");

          //  $("#coinbasePayment").attr('src', 'https://commerce.coinbase.com/checkout/'+vsObj.vsCoinBase);
        }
    });
}

socket.on("updatePaymentStatus", function (socketObj) {
    console.log('i am receive message! updatePaymentStatus:', socketObj);
    if (socketObj.what) {
        drawProcessingPaymentDiv(socketObj);
    }
    if (socketObj.what && socketObj.dealIds && socketObj.what === 'confirmed') {
        try {
            var dealIds = JSON.parse(socketObj.dealIds)
            dealIds.forEach(function (oneDeal) {
                $("#obStatus"+oneDeal).text('Paid');
            })
        } catch (e) {
            throw new Error(e);
        }
    }
});

function drawProcessingPaymentDiv(socketObj) {
    let div = '';
    if (socketObj.what === 'created') {
            $("#possilbleOpacityPayButton").css('opacity', '0.3');

            div = `        <div id="p${socketObj.id}">
            <div>Generated invoice number: <b id="invSmallNumber${socketObj.id}">${socketObj.id}</b></div>
            <div>Status: <b>Generated and waiting for payment</b></div>
            <div>We check your payment every second, don't worry.</div>
            <div>You have only 1 hour for payment after invoice generation, please consider, that in this time blockchain must confirm your payment.</div>
            <div>Lost payment link? He is here <b id="pLink${socketObj.id}"><a href="https://commerce.coinbase.com/checkout/${socketObj.coinbaseiD}" target="_blank">https://commerce.coinbase.com/checkout/${socketObj.coinbaseiD}</a></b></div>
        </div>`;

            $(div).prependTo( "#processingInvoices" );

    } else if (socketObj.what === 'confirmed') {
        div = `<div>Generated invoice number: <b id="invSmallNumber${socketObj.id}">${socketObj.id}</b></div>
            <div>Status: <b>Paid!</b></div>`;

        $("#p"+socketObj.id).html(div);

    } else if (socketObj.what === 'expired') {
        div = `<div>Generated invoice number: <b id="invSmallNumber${socketObj.id}">${socketObj.id}</b></div>
            <div>Status: <b>Expired and canceled!</b></div>`;

        $("#p"+socketObj.id).html(div);
    }
}
