add: function(name, path, site, description, category, deferred) {
    console.log("--addSnippet--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/snippets/addsnippet';
    var params = {
        authorization_token: gadget.get('token'), 

        name: name,
        snippet: name,
        path: path,
        site: site,
        description: description,
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