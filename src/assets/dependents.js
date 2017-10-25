//TODO: test this
// asset Id is also the same as the dependency tag (only numbers)
dependents: function(assetId, site, deferred) {
    console.log("--assetDependents--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/dependents';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: '/OMNI-ASSETS/'+assetId+'.html',
    };
    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}