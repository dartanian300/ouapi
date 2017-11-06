save: function(path, site, content, deferred) {
    console.log("--saveFile--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/save';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path,
        text: content
    };
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}