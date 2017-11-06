// asset Id is also the same as the dependency tag (only numbers)
info: function(site, assetId, deferred) {
    console.log("--assetInfo--");

    var endpoint = gadget.get('apihost') + '/assets/info';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        asset: assetId
    };

    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}

/*
Assets Info:

GET
assets/info

Params:
site:_test
asset:145350
*/