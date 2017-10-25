//TODO: test this
list: function(site, deferred) {
    console.log("--listSnippets/Categories--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/snippets/list';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
    };
    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}