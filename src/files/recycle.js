// path can be string or array of strings
recycle: function(path, site, deferred) {
    console.log("--recycleFiles--");

    var endpoint = gadget.get('apihost') + '/files/recycle';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path
    };

    var intDeferred = new $.Deferred();
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: $.param(params, true),
        deferred: intDeferred
    }).then(function(resp){
        return ouapi.util.fileStatus(site, resp.id);
    }).then(function(r){
        deferred.resolve(r);
    }).fail(function(data){
        deferred.reject(data);
    });
    
    
    
    return deferred.promise();
}