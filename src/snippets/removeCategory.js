removeCategory: function(name, site, deferred) {
    console.log("--removeSnippetCategory--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/snippets/removecategory';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        category: name,
    };
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}