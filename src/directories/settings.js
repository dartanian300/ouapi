//TODO: test this
settings: function(path, site, deferred) {
    console.log("--directorySettings--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/directories/settings';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path,
    };
    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}