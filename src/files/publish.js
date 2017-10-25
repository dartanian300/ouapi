//TODO: test this
publish: function(path, site, versionDesc, deferred) {
    console.log("--publishFile--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/publish';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path,
        log: versionDesc
    };
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}



/*
Params:
site:_test
path:/index.pcf
log:test version
target:_test
tweet:
wall_post:
*/