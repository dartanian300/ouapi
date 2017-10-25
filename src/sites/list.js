//TODO: test this
list: function(count = 5000, site, account, deferred) {
    console.log("--sitesList--");

    if (typeof site == 'undefined')
        site = gadget.get('site');
    if (typeof account == 'undefined')
        account = gadget.get('account');
    
    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/sites/list';
    var params = {
        authorization_token: gadget.get('token'), 

        count: count, 
        account: account, 
        site: site
    };
    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}