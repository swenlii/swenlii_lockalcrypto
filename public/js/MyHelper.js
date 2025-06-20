Array.prototype.remove = function (data) {   // remove any value from array (if exist)
    const dataIdx = this.indexOf(data)
    if (dataIdx >= 0) {
        this.splice(dataIdx, 1);
    }
    return this.length;
}

Number.prototype.trimNum = function(places, rounding) {
    rounding = rounding || "round";
    var num = parseFloat(this), multiplier = Math.pow(10, places);
    return(Number(Math[rounding](num * multiplier) / multiplier));
}

// show values from reactive object, without setters&getters
function rLog(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

function ThousandSeparator(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function getHashValue(key) {
    var matches = location.hash.match(new RegExp(key + '=([^&]*)'));
    return matches ? matches[1] : null;
}

let autocomplete;

function initAutocomplete() {
    let postOfferInput = document.getElementById('autocomplete-post-offer');
    if (postOfferInput) {
        let POAutocomplete = new google.maps.places.Autocomplete(postOfferInput, {types: ['(cities)']});
        POAutocomplete.addListener('place_changed', function () {
            parsePostOffer(POAutocomplete.getPlace().geometry.location);
        });

        postOfferInput.oninput  = () => {
            parsePostOffer();
        };
    }
    let registerInput = document.getElementById('autocomplete-register');
    if (registerInput) {
        let registerAutocomplete = new google.maps.places.Autocomplete(registerInput);
        registerAutocomplete.addListener('place_changed', function () {
            var place = registerAutocomplete.getPlace();
            let country = place.address_components.find(function(el) {
                return el.types[0] === 'country';
            });

            if (!country) {
                app.registerForm.locationInputError = 'You forgot to enter your country';
                $("#enter-location-alert").css("display", "block");
                $("#autocomplete-register").addClass("invalidInput");
                return;
            }

            let city = place.address_components.find(function(el) {
                return el.types[0] === 'locality';
            });
            if (!city) {
                app.registerForm.locationInputError = 'You forgot to enter your city';
                $("#enter-location-alert").css("display", "block");
                $("#autocomplete-register").addClass("invalidInput");
                return;
            }
            let street = place.address_components.find(function(el) {
                return el.types[0] === 'route';
            });
            if (!street) {
                app.registerForm.locationInputError = 'You forgot to enter your street';
                $("#enter-location-alert").css("display", "block");
                $("#autocomplete-register").addClass("invalidInput");
                return;
            }
            let house = place.address_components.find(function(el) {
                return el.types[0] === 'street_number';
            });
            if (!house) {
                app.registerForm.locationInputError = 'You forgot to enter your house number';
                $("#enter-location-alert").css("display", "block");
                $("#autocomplete-register").addClass("invalidInput");
                return;
            }

            $("#enter-location-alert").css("display", "");
            $("#autocomplete-register").removeClass("invalidInput");

            app.registerForm.streetName = street.long_name;
            app.registerForm.house = house.short_name;
            parseRegister(place.geometry.location);
        });
    }

    let listingOfferInput = document.getElementById('autocomplete-listing-offer');
    if (listingOfferInput) {
        let listingOfferAutocomplete = new google.maps.places.Autocomplete(listingOfferInput, {types: ['(cities)']});
        listingOfferAutocomplete.addListener('place_changed', function () {
            parseListingOffer(listingOfferAutocomplete.getPlace().geometry.location);
        });
    }

    let listingCompaniesInput = document.getElementById('autocomplete-listing-companies');
    if (listingOfferInput) {
        let listingCompaniesAutocomplete = new google.maps.places.Autocomplete(listingCompaniesInput, {types: ['(cities)']});
        listingCompaniesAutocomplete.addListener('place_changed', function () {
            parseListingCompanies(listingCompaniesAutocomplete.getPlace().geometry.location);
        });
    }
}

function parsePostOffer(place) {
    if (!place) {
        app.$refs.postOffer.city = '';
        app.$refs.postOffer.countryName = '';
        app.$refs.postOffer.countryCode =  '';
        app.$refs.postOffer.lat =  '';
        app.$refs.postOffer.long = '';
        app.$refs.postOffer.zipCode = '';
        return;
    }
    geoModel.decodeLatLong(place.lat(), place.lng())
        .then(geoObj => {
            app.$refs.postOffer.city = geoObj.city;
            app.$refs.postOffer.countryName = geoObj.country;
            app.$refs.postOffer.countryCode = geoObj.countryCode;
            app.$refs.postOffer.lat = place.lat();
            app.$refs.postOffer.long = place.lng();
            app.$refs.postOffer.zipCode = geoObj.zipcode;
        })
        .catch(error => {
            console.log('error parse location:', error)
        })
}

function parseRegister(place) {
    geoModel.decodeLatLong(place.lat(), place.lng())
        .then(geoObj => {
            app.registerForm.city = geoObj.city;
            app.registerForm.countryName = geoObj.country;
            app.registerForm.countryCode = geoObj.countryCode;
            app.updatePhoneByCountry();
            app.registerForm.zipCode = geoObj.zipcode;
        })
        .catch(error => {
            console.log('error parse location:', error)
        })
}

function parseListingOffer(place) {
    app.$refs.listingOffers.parseLatLong(place.lat(), place.lng(), function (error, success) {
        if (error) {
            alert('Error: ' + error)
        } else {
            app.$refs.listingOffers.onlyYourCity = false;
            app.$refs.listingOffers.readAnotherOffers();
        }
    });
}

function parseListingCompanies(place) {
    app.$refs.listingCompanies.parseLatLong(place.lat(), place.lng(), function (error, success) {
        if (error) {
            alert('Error: ' + error)
        } else {
            app.$refs.listingCompanies.onlyYourCity = false;
            app.$refs.listingCompanies.search = 0;
            app.$refs.listingCompanies.readCompanies();
            console.log('companies.length22');
        }
    });
}

function fillInAddress() {
    var place = autocomplete.getPlace().geometry.location;
    console.log(place, place.lat(), place.lng());
    // index.$data.long = place.lng(); // first change long
    // index.$data.lat = place.lat();
    app.$refs.listingOffers.parseLatLong(place.lat(), place.lng(), function (error, success) {
        if (error) {
            alert('Error: ' + error)
        } else {
            app.$refs.listingOffers.onlyYourCity = false;
            app.$refs.listingOffers.readAnotherOffers();
        }
    })
}

function isMyScriptLoaded(url) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        if (scripts[i].src === url) return true;
    }
    return false;
}
