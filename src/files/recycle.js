// TODO: test this
// path can be string or array of strings
recycle: function(path, site, deferred) {
    console.log("--recycleFiles--");

    var endpoint = gadget.get('apihost') + '/files/recycle';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path
    };

    ajaxC({
        type: "POST",
        url: endpoint, 
        data: $.param(params, true),
        deferred: deferred
    });
    return deferred.promise();
}