// TODO: test this
// tags can be an array
newPlainText: function(name, site, description, group, readGroup, content, tags, lockToSite = true, deferred) {
    console.log("--newPlainTextAsset--");

    var endpoint = gadget.get('apihost') + '/assets/new';
    var params = {
        authorization_token: gadget.get('token'), 

        name: name,
        site: site,
        description: description,
        group: group,
        readers: readGroup,
        content: content,
        tags: tags,
        site_locked: lockToSite,
        type: 2
    };

    ajaxC({
        type: "POST",
        url: endpoint, 
        data: $.param(params, true),
        deferred: deferred
    });
    return deferred.promise();
}

/*
Plain Text:

POST
assets/new

Params:
name:New Asset Name2
description:New Asset Description
site_locked:true
group:Webgroup
readers:Webgroup
    content:great new content
site:_test
type:2
tags:Newtag
*/