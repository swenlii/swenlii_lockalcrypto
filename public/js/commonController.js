function saveDealCounts(value) {
    localStorage.setItem('dealsCount', value);
}

function getDealCounts() {
    if (typeof localStorage.getItem('dealsCount') == "undefined") {
        return "(0)";
    } else {
        return localStorage.getItem('dealsCount');
    }
}


if (typeof Cookies.get('uHashL') != "undefined") {
    socket.emit('getDealsCount', Cookies.get('uHashL'), function (error, responseNumber) {
        if (!error) {
            $("#dealsCount").text("("+responseNumber+")");
            saveDealCounts("("+responseNumber+")");
        } else {
            console.log('error with get deals count ', error);
        }
    });
}