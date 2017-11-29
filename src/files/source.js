source: function(path, site, brokenTags, deferred) {
    console.log("--removeSnippet--");
    if (typeof brokenTags == 'undefined') brokenTags = true;

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