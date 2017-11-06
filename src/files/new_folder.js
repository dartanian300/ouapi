new_folder: function(name, path, site, deferred) {
    console.log("--new_folder--");

    var endpoint = gadget.get('apihost') + '/files/new_folder';
    var params = {
        authorization_token: gadget.get('token'), 

        name: name,
        site: site,
        path: path
    };

    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}