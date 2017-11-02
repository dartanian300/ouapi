info: function(path, site, deferred) {
    console.log("--fileInfo--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/info';
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