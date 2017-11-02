// TODO: test this
delete: function(path, site, remote, deferred) {
    console.log("--deleteFile/Folder--");
    if (typeof remote == 'undefined') remote = false;

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
        data: $.param(params, true),
        deferred: deferred
    });
    return deferred.promise();
}