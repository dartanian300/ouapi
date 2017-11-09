// type string - 'string' or 'regex'
// negexts bool - if true, exclude extensions. If false, use only the extensions
// paths array - strings of paths to search
find: function(site, find, caseSensitive, includeLocked, paths, type, negexts, extensions, deferred) {
//    console.log("this: ", this);
    console.log("--siteFind--");
    if (typeof caseSensitive == 'undefined') caseSensitive = false;
    if (typeof includeLocked == 'undefined') includeLocked = true;
//    if (typeof paths == 'undefined') paths = "";
    if (typeof type == 'undefined') type = 'string';
    if (typeof negexts == 'undefined') negexts = true;
    if (typeof extensions == 'undefined') extensions = [];
    
    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/sites/findreplace';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        srchstr: find,
        casesensitive: caseSensitive,
        includelocked: includeLocked,
        paths: JSON.stringify(paths),
        srchtype: type,
        negexts: negexts,
        extensions: extensions
    };
//    ajaxC({
//        type: "POST",
//        url: endpoint, 
//        data: $.param(params, true),
//        deferred: deferred
//    });
//    return deferred.promise();
    
    var intDeferred = new $.Deferred(); // internal deferred
    // search entire site
    if (typeof paths == 'undefined'){
        ouapi.files.list('/', site).then(function(fileList){
//            console.log("test");
            var paths = $.map( fileList.entries, function(n){ return n.staging_path; });
//            console.log("paths: ", paths);

            params.paths = JSON.stringify(paths);
            ajaxC({
                type: "POST",
                url: endpoint, 
                data: $.param(params, true),
                deferred: intDeferred
            }).then(function(resp){
                return ouapi.util.findReplaceStatus(site, resp.id);
            }).then(function(searchData){
                // return data with promise.resolve
                deferred.resolve(searchData);
            }).fail(function(resp){
                deferred.reject(resp);
            });
        });
    }
    else {
        // just search the given paths
        ajaxC({
            type: "POST",
            url: endpoint, 
            data: $.param(params, true),
            deferred: intDeferred
        }).then(function(resp){
            return ouapi.util.findReplaceStatus(site, resp.id);
        }).then(function(searchData){
            // return data with promise.resolve
            deferred.resolve(searchData);
        }).fail(function(resp){
            deferred.reject(resp);
        });
    }
    
    return deferred.promise();
}


//srchtype:string
//srchstr:sport
//casesensitive:false
//rplcstr:
//negexts:true
//paths:
//includelocked
//
//
//negexts
//extensions
