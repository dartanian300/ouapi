// tags can be an array
newPlainText: function(name, site, description, content, group, readGroup, tags, lockToSite, deferred) {
    console.log("--newPlainTextAsset--");
    if (typeof group == 'undefined') group = 'Everyone';
    if (typeof readGroup == 'undefined') readGroup = 'Everyone';
    if (typeof lockToSite == 'undefined') lockToSite = true;

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