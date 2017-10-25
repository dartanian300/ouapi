//TODO: test this
dependents: function(path, site, deferred) {
    console.log("--fileDependents--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/dependents';
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