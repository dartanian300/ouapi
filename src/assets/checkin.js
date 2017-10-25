// TODO: test this
// asset Id is also the same as the dependency tag (only numbers)
checkin: function(site, assetId, deferred) {
    console.log("--checkinAsset--");

    var endpoint = gadget.get('apihost') + '/assets/checkin';
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