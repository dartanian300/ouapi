test: function(site, deferred) {
    console.log("--test--");
    
    ouapi.sites.list(site).done(function(sites){
        console.log("sites: ", sites);
        
        // list snippets
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
        
    });
    return deferred.promise();
}