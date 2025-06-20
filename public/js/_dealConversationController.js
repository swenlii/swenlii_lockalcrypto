$(document).ready(function() {
    console.log('inside dealConversation');

    socket.on("connect", function() {

        socket.on("receiveChatMessage", function (textObj) {

            var formattedDate = new Date(textObj.date).toLocaleDateString("de-CH");
            var formattedTime = new Date(textObj.date).toLocaleTimeString("de-CH");

            var name = `Anonymous${textObj.userId}`;
            if (typeof textObj.userName != "undefined" && textObj.userName != false) {
                name = textObj.userName;
            }

            // console.log("haha textObj: ", textObj);
            var newLi = `<li>
             <div>Time: ${formattedDate}, ${formattedTime}</div>
             <div>
             <div>From: ${name}</div>
             <div><b>${textObj.text}</b></div>
             </div>
             </li>`;

            $("#socketChatUl").append(newLi);
        });

        socket.on('thisDealWasClosed', function (buyerId) {
            if (isUserBueyr === false) { // if user is seller, close deal by socket message
                alert('Buyer set this deal as closed!');
                location.reload();
            }

        });
    });

});

function sendChatMessage(dealId) {
    var obj = {
        dealId: dealId,
        authToken: Cookies.get('uHashL'),
        text: $("#chatMessage").val()
    };

    socket.emit("sendChatMessage", obj, function (error, response) {
        if (!error) {
            console.log(response);
            $("#chatMessage").val("");
          //  location.reload();
        } else {
            alert(error);
        }
    })
}

function closeDeal(dealId) {
    var obj = {
        dealId: dealId,
        authToken: Cookies.get('uHashL')
    };

    socket.emit("closeDeal", obj, function (error, response) {
        if (!error) {
            console.log(response);
            $("#completeTransaction").html("<p><b>Transaction success complete!</b></p>");
            location.reload();
        } else {
            console.log(error);
            alert('Some error, try later, thank you.');
        }
    });
}

function submitReview(event, dealId) {
    event.preventDefault();

    var obj = {
        dealId: dealId,
        authToken: Cookies.get('uHashL'),
        reviewText : event.target.textReview.value,
        stars : event.target.stars.value
    };

    socket.emit('writeReview', obj, function (error, response) {
        if (error) {
            console.log('error writeReview:', error)
            alert('Sorry, some error: '+ error);
        } else {
            alert('Success reviewed!');
            location.reload();
        }
    })
}

function canUserReview(dealId) {
    var obj = {
        dealId: dealId,
        authToken: Cookies.get('uHashL')
    };
    socket.emit('canUserReview', obj, function (error, response) {
        if (error) {
            console.log('error canUserReview:', error)
            $("#reviewsDiv").hide();
        } else {
            console.log('success canUserReview:', response)
            $("#reviewsDiv").show();
        }
    })

}