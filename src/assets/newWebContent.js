// tags can be an array
newWebContent: function(name, site, description, content, group, readGroup, tags, lockToSite, deferred) {
    console.log("--newWebContentAsset--");
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
        type: 0
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
Web Content:

POST
assets/new

Params:
name:New Asset Name
site:_test
group:Webgroup
readers:Webgroup
description:New Asset Description
site_locked:true
content:Great new content

type:0
tags:Newtag
tags:newtag2*/