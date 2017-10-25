//TODO: test this
list: function(site, count = 100, start = 1, sortKey = 'name', sortOrder = 'asc', deferred) {
    console.log("--listAssets--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/assets/list';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: '/OMNI-ASSETS',
        count: count,
        start: start,
        sort_key: sortKey,
        sort_order, sortOrder,
        ignore_readers: true    // ignore read-access rules
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
Params:
count:100
start:1
sort_key:name
sort_order:asc
ignore_readers:false
type:
*/