function login(event) {
    event.preventDefault();

    var obj = {
        privateKey : event.target.privateKey.value
    };

    socket.emit('authorizeUserHands', obj, function (error, responseObj) {
        if (error) {
            console.log('authorizeUserHands error:', error);
            alert('Wrong private key or server error. Please try again later.');
        } else {
            Cookies.set('uHashL', responseObj.userHash, { expires: 77 });
            Cookies.set('countryCode', responseObj.countryCode, { expires: 77 });
            alert('Success authorized!');
            location.reload();
        }
    })
}