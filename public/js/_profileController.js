function saveChanges() {

    var obj = {
        name : $("#name").val(),
        email : $("#email").val(),
        countryId : $("#country").val(),
        token : Cookies.get('uHashL')
    };

    socket.emit("saveUserDetailsProfile", obj, function (error, result) {
       if (error) {
           console.log(error);

           alert('Sorry, some error, try later');
       } else {
            alert('Success change!');
            location.reload();
       }
    });
}
