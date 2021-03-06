// asset Id is also the same as the dependency tag (only numbers)
checkout: function(site, assetId, deferred) {
    console.log("--checkoutAsset--");

    var endpoint = gadget.get('apihost') + '/assets/checkout';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        asset: assetId
    };

    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}