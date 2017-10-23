create: function(site, path, filename, overwrite, deferred) {
    console.log("--createFile--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/templates/new';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: path,
        template: "20_newfile.tcf",
        submit: "Create",
        tcf_value_0: filename,			// filename
        tcf_value_1: overwrite,			// overwrite
        tcf_value_2: "*inherit*"		// Access Group
    };
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}