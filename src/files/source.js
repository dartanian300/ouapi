//TODO: test this
source: function(site, path, brokenTags = true, deferred) {
    console.log("--removeSnippet--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/source';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path,
        brokentags: brokenTags
    };
    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}