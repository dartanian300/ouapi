// asset Id is also the same as the dependency tag (only numbers)
view: function(site, assetId, deferred) {
    console.log("--viewAsset--");

    var endpoint = gadget.get('apihost') + '/assets/view';
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
View Assets:

GET
assets/view

Params:
site:_test
asset:145350
*/

/*
Response: 
{"type_name":"generic","site":"_test","is_published":false,"name":"Web content asset","site_locked":true,"description":"description","asset":146296,"type":0,"content":"web content","enabled":true,"tags":[]}
*/