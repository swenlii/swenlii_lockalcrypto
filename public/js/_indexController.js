function registerUser(event) {
    event.preventDefault();
    let obj = {
        email : $("#emailaddress-register").val(),
        password: $("#password-register").val(),
        passwordRepeat: $("#password-repeat-register").val(),
        clientIp: $("#clientIp").val(),
        isCompany: $("#exchangerRegitser").is(":checked"),
        companyName: $("#company-name").val(),
        responsiblePerson: $("#responsible-person-register").val(),
        weekdaysWorkTimeStart: $("#weekdays-worktime-start").val(),
        weekdaysWorkTimeEnd: $("#weekdays-worktime-end").val(),
        workOnWeekends: $("#workOnWeekend").is(":checked"),
        saturdayWorkTimeStart: $("#saturday-worktime-start").val(),
        saturdayWorkTimeEnd: $("#saturday-worktime-end").val(),
        sundayWorkTimeStart: $("#sunday-worktime-start").val(),
        sundayWorkTimeEnd: $("#sunday-worktime-end").val(),
    }
    if ($("#password-register").val() !== $("#password-repeat-register").val()) {
        $("#validation-error-alert").css("display", "block");
        return;
    }
    if ($("#password-register").val().length < 6){
        swal('Error', 'Password length less than 6', 'error');
    }
    if (obj.isCompany === true) {
        obj.countryName = app.registerForm.countryName;
        obj.countryCode = app.registerForm.countryCode;
        obj.city = app.registerForm.city;
        obj.street = app.registerForm.streetName;
        obj.house = app.registerForm.house,
        obj.zipCode = app.registerForm.zipCode;
        obj.telCountryCode = app.registerForm.telCountryCode;
        obj.telNumber = app.registerForm.telNumber;
    } else {
        obj.countryName = app.registerForm.countryName;
        obj.countryCode = app.registerForm.countryCode;
        obj.city = app.registerForm.city;
        obj.street = null;
        obj.house = null;
        obj.zipCode = app.registerForm.zipCode;
        obj.companyName = null;
        obj.responsiblePerson = null;
        obj.weekdaysWorkTimeStart = null;
        obj.weekdaysWorkTimeEnd = null;
        obj.workOnWeekends = null;
        obj.building = null;
        obj.telCountryCode = null;
        obj.telNumber = null;
    }
    if (obj.workOnWeekends !== true) {
        obj.saturdayWorkTimeStart = null;
        obj.saturdayWorkTimeEnd = null;
        obj.sundayWorkTimeStart = null;
        obj.sundayWorkTimeEnd = null;
    }

    socket.emit('registerUser', obj, function (error, success) {
        console.log('registerUser inside')
        if (error) {
            if (error === 'validation error in auth modul') {
                $("#validation-error-alert").css("display", "block");
                location.hash = '#validation-error-alert';
            } else if (error === 'The email address you have entered is already registered!') {
                $("#duplicate-email-alert").css("display", "block");
                location.hash = '#duplicate-email-alert';
                $("#emailaddress-register").addClass("invalidInput");
            } else {
                $("#error-alert").css("display", "block");
                location.hash = '#error-alert';
                app.errorInRegistr = 'Error: ' + error;
                //swal('Error', error, 'error')
            }
        } else {
            Cookies.set('uHashL', success.uHash, { expires: 365 });
            $.magnificPopup.close();
            swal('Success', 'You have registered successfully.', 'success');
            location.reload();
        }
    })
}

function loginUser(event) {
    event.preventDefault()

    let obj = {
        email : $("#emailaddress").val(),
        pass: $("#password").val()
    };

    if (obj.pass.length < 6){
        swal('Error', 'Password length less than 6', 'error');
    }

    socket.emit('loginUser', obj, function (error, response) {
        if (error) {
            document.getElementById('error').textContent = error;
            console.log('error', error)
        } else {
            console.log('response', response);
            Cookies.set('uHashL', response.uHash, { expires: 365, secure: false });
            $.magnificPopup.close();
            var my_param = getUrlParameter('run');
            if (my_param === "sign-in") {
                window.location.href = '/'
            }
            else {
                location.reload();
            }
        }
    })
}

function sendResetLink (obj) {
    socket.emit('restorePassword', obj, function (error, response) {
        if (error) {
            console.log('Restore password error:', error);
            if (error ==='EmailNotExists') {
                $("#bad-email-restore").css("display", "block");
                $("#email-input-restore").addClass("invalidInput");
            } else {
                alert(`Error: ${error}`);
            }
        } else {
            $.magnificPopup.close();
            swal(
                'Success',
                'The recovery link has been sent on '  + obj.email + '. Please, check your email.',
                'success'
            );
        }
    });
}
