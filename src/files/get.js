get: function(path, site, deferred) {
    console.log("--getFiles--");

    var endpoint = gadget.get('apihost') + '/files/list';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path
    };

    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}