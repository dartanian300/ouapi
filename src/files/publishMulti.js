// paths can be an array
publishMulti: function(paths,
                        site,
                        versionDesc,
                        includeCheckedout,
                        includeScheduled,
                        includePendingApproval,
                        changedOnly,
                        useLastPublishedVersion,
                        includeUnpublishedDependencies,
                        deferred)
{
    console.log("--publishMultiFile--");
    if (typeof includeCheckedout == 'undefined') includeCheckedout = false;
    if (typeof includeScheduled == 'undefined') includeScheduled = false;
    if (typeof includePendingApproval == 'undefined') includePendingApproval = false;
    if (typeof changedOnly == 'undefined') changedOnly = false;
    if (typeof useLastPublishedVersion == 'undefined') useLastPublishedVersion = false;
    if (typeof includeUnpublishedDependencies == 'undefined') includeUnpublishedDependencies = true;
    
    
    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/files/multipublish';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
        path: paths,
        log: versionDesc,
        type: 0,
        
        include_checked_out: includeCheckedout,
        include_scheduled_publish: includeScheduled,
        include_pending_approval: includePendingApproval,
        changed_only: changedOnly,
        last_published: useLastPublishedVersion,
        include_unpublished: includeUnpublishedDependencies,
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
Params:
site:_test
log:new test desc

path:/index-34525.pcf
path:/index.pcf
type:0

target:_test

include_checked_out:false
include_scheduled_publish:false
include_pending_approval:false
changed_only:false
last_published:false
include_unpublished:false


de:http://a.cms.omniupdate.com/10?skin=kennesaw&account=kennesaw&site=_test&action=de&path=
*/