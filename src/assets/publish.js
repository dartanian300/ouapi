// forms & galleries use .json - others use .html
//TODO: figure out best way to handle .json vs .html file extensions
publish: function(site, filename, versionDesc, deferred) {
    console.log("--publishAsset--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/publish';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: '/OMNI-ASSETS/'+filename,
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