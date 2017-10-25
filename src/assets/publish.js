//TODO: test this
publish: function(name, site, versionDesc, deferred) {
    console.log("--publishAsset--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/publish';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: '/OMNI-ASSETS/'+name,
        log: versionDesc
    };
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}