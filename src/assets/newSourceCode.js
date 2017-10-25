// TODO: test this
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
newSourceCode: function(name, site, description, group, readGroup, content, tags, lockToSite = true, extra = {}, deferred) {
    console.log("--newSourceCodeAsset--");

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