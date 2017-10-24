// TODO: test this
delete: function(path, site, remote = false, deferred) {
    console.log("--deleteFile/Folder--");

    var endpoint = gadget.get('apihost') + '/files/delete';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path,
        remote: remote
    };

    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params, true,
        deferred: deferred
    });
    return deferred.promise();
}