// tags can be an array
/*
    @param object extra - can contain these keys:
    thumbnail_width: int
    thumbnail_height: int
    force_crop: bool
    advanced: string
*/
newImageGallery: function(name, site, description, group, readGroup, tags, lockToSite, extra, deferred) {
    console.log("--newImageGalleryAsset--");
    if (typeof group == 'undefined') group = 'Everyone';
    if (typeof readGroup == 'undefined') readGroup = 'Everyone';
    if (typeof lockToSite == 'undefined') lockToSite = true;

    if (typeof extra == 'undefined')
        extra = {
            thumbnail_width:100,
            thumbnail_height:100,
            force_crop:false
        };
    
    var endpoint = gadget.get('apihost') + '/assets/new';
    var params = {
        authorization_token: gadget.get('token'), 

        name: name,
        site: site,
        description: description,
        group: group,
        readers: readGroup,
        tags: tags,
        site_locked: lockToSite,
        type: 3
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
Image Gallery:

POST
assets/new

name:New Asset Name 4
description:New Asset Desc
group:Everyone
readers:Everyone
    thumbnail_width:100
    thumbnail_height:100
    force_crop:false
    advanced:advanced content
site_locked:true
site:_test
type:3
tags:n
*/