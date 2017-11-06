// asset Id is also the same as the dependency tag (only numbers) - can be array
delete: function(site, assetId, deferred) {
    console.log("--deleteAsset--");

    var endpoint = gadget.get('apihost') + '/assets/delete';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        asset: assetId
    };

    ajaxC({
        type: "POST",
        url: endpoint, 
        data: $.param(params, true),
        deferred: deferred
    });
    return deferred.promise();
}