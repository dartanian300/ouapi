remove: function(name, site, category, deferred) {
    console.log("--removeSnippet--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/snippets/removesnippet';
    var params = {
        authorization_token: gadget.get('token'), 

        snippet: name,
        site: site,
        category: category
    };
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}