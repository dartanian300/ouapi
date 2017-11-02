checkedOut: function(site, deferred) {
    console.log("--checkedOutFiles--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/checkedout';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
    };
    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}