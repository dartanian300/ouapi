createCategory: function(name, site, deferred) {
    console.log("--createSnippetCategory--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/snippets/addcategory';
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