// tags can be an array
/*
    @param object extra - can contain these keys:
    syntax: string
    theme: default
    line-number:
    query:
    replaceText:
    isRegex: bool
    matchCase: bool
*/
newSourceCode: function(name, site, description, content, group, readGroup, tags, lockToSite, extra, deferred) {
    console.log("--newSourceCodeAsset--");
    if (typeof group == 'undefined') group = 'Everyone';
    if (typeof readGroup == 'undefined') readGroup = 'Everyone';
    if (typeof lockToSite == 'undefined') lockToSite = true;
    
    if (typeof extra == 'undefined')
        extra = {};

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
        type: 1
    };

    $.extend(params, extra);
    
    ajaxC({
        type: "POST",
        url: endpoint, 
        data: $.param(params, true),
        deferred: deferred
    });
    return deferred.promise();
}

/*
Source Code:

POST
assets/new


    syntax:ou_htmlmixed_dm
    theme:default
    line-number:
    query:
    replaceText:
    isRegex:false
    matchCase:false
content:asset content
site:_test
type:1
tags:Newtag
tags:newtag2
*/