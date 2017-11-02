checkin: function(path, site, deferred) {
    console.log("--checkinFile--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/checkin';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path,
    };
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}