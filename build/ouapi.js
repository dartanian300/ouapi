"use strict";

// create closure
(function () {

    // these settings seem to work well
    var maxNumConnections = 3;
    var delay = 2000;
    var delayAfter = 5; // delay after this many requests
    var promises = []; // holds promises for all executed calls since last wait
    var whenApplied = false;

    // set library vars
    var currentDelayAfter = 0; // current count for how many requests have been made
    var numConnections = 0; // number of currently open connections
    var queue = []; // queue of backlogged requests

    var stats = {
        requestsQueued: 0, // # requests currently in wait queue
        requestsFinished: 0, // # requests that have finished (both failed and successful) --
        requestsMade: 0, // total # requests given to ouapi. requestsQueued + requestsFinished + requestsPending
        requestsSuccessful: 0, // # requests that were successfully resolved --
        requestsFailed: 0, // # requests that were rejected --
        requestsPending: 0 // # requests currently processing


        // 		debug(dequeue);
        // 		debug(checkQueue);
        // 		debug(closeConnection);
        // 		debug(ajaxC);
        // 		debug(callNext);

        /**
            Calls next queued request (after delay & sometimes delayAfter)
        */
    };function dequeue() {
        console.log("--dequeue--");
        debugger;
        //             closeConnection();
        console.log("queue length " + currentDelayAfter + ": ", queue.length);
        console.log("promise queue length: ", promises.length);
        console.log("numConnections: ", numConnections);

        if (currentDelayAfter >= delayAfter) {
            console.log("ready to wait");
            if (whenApplied == false) {
                console.log("when is not applied yet");
                whenApplied = true;
                $.when.apply($, promises).always(function () {
                    console.log("when fires");
                    setTimeout(function () {
                        console.log("timeout fires");

                        //closeConnection();
                        resetClump();
                        // 							numConnections = 0;
                        // 							currentDelayAfter = 0;
                        // 							promises = [];
                        // 							whenApplied = false;
                        callNext(maxNumConnections);
                    }, delay);
                });
            }
        } else {
            console.log("call next");
            //closeConnection();
            callNext();
        }
    }

    /**
        Calls the next 'num' number of methods in the wait queue
    */
    function callNext() {
        var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        debugger;
        // don't try to call more methods than are queued
        num = num <= queue.length ? num : queue.length;
        for (i = 0; i < num; i++) {
            var method = queue.shift();
            method.func.apply(ouapi, method.args);
        }
    }

    /**
        A wrapper around the $.ajax method. Once complete, it automatically tries to start next request in queue.
        @return deferred object
    */
    function ajaxC(params) {
        debugger;
        var origComplete = params.complete || null;
        var origSuccess = params.success || null;
        var origError = params.error || null;

        var methodData = {
            params: params.data
        };
        params.success = function (data, jqXHR, textStatus) {
            stats.requestsPending--;
            dequeue();
            data.methodData = methodData;

            // don't report success if response has error
            if (data.error) {
                stats.requestsFailed++;
                params.deferred.reject(data);
                if (origError) origError(data, jqXHR, textStatus);
                $(ouapi).trigger('ouapi.error', data);
            } else {
                stats.requestsSuccessful++;
                params.deferred.resolve(data);
                if (origSuccess) origSuccess(data, jqXHR, textStatus);
                $(ouapi).trigger('ouapi.success', data);
            }
        };
        params.error = function (data, jqXHR, textStatus) {
            stats.requestsPending--;
            stats.requestsFailed++;

            dequeue();
            data.methodData = methodData;
            params.deferred.reject(data);
            if (origError) origError(data, jqXHR, textStatus);
            $(ouapi).trigger('ouapi.error', data);
        };
        params.complete = function (data, jqXHR, textStatus) {
            closeConnection();
            data.methodData = methodData;
            if (origComplete) origComplete(data, jqXHR, textStatus);
            $(ouapi).trigger('ouapi.complete', data);
        };

        stats.requestsPending++;
        return $.ajax(params);
    }

    /**
        Determines if there are available connections
        @return bool
    */
    function checkConnections() {
        debugger;
        if (numConnections < maxNumConnections) {
            return true;
        } else {
            return false;
        }
    }

    /**
        Does necessary housekeeping to symbolically open a connection
    */
    function openConnection() {
        debugger;
        numConnections++;
        currentDelayAfter++;
    }

    /**
        Does necessary housekeeping to symbolically close a connection
    */
    function closeConnection() {
        debugger;
        console.log("--close connection - requestsFinished: ", stats.requestsFinished);
        numConnections--;
        stats.requestsFinished++;
        if (queue.length < 1) $(ouapi).trigger('ouapi.empty');
    }

    /**
        Resets variables so the next clump can begin
    */
    function resetClump() {
        //numConnections = 0;
        currentDelayAfter = 0;
        promises = [];
        whenApplied = false;
    }

    /**
        Determines if a varible contains a promise object
        @return bool
    */
    function isPromise(x) {
        if (x.promise && !isDeferred(x)) return true;
        return false;
    }

    /**
        Determines if a varible contains a deferred object
        @return bool
    */
    function isDeferred(x) {
        if (x.promise && x.notify) return true;
        return false;
    }

    /**
        If there is an available connection, "opens" the connection via incrementing the open
        connection counter and return true so that the method may be called.
        If there is not an available connection, queues the arguments and method to be called
        when a connection opens up.
        @param string group - the object key in which the method is stored
        @param string method - the name of the method that needs to be called
        @param array - arguments to pass to method 
        @return bool - true if connections available, false if not (which also queues the method)
    */
    function checkQueue(group, method, args) {
        console.log("--checkQueue--");
        debugger;

        // grab deferred (always last element)
        var deferred = args[args.length - 1];

        if (!checkConnections()) {
            queue.push({ func: ouapi[group][method], args: args });
            return false;
        }
        promises.push(deferred.promise());
        openConnection();
        return true;
    }

    var ouapi = {
        snippets: {
            //TODO: test this
            add: function add(name, path, site, description, category, deferred) {
                console.log("--addSnippet--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/snippets/addsnippet';
                var params = {
                    authorization_token: gadget.get('token'),

                    name: name,
                    snippet: name,
                    path: path,
                    site: site,
                    description: description,
                    category: category
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            createCategory: function createCategory(name, site, deferred) {
                console.log("--createSnippetCategory--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/snippets/addcategory';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    category: name
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            removeCategory: function removeCategory(name, site, deferred) {
                console.log("--removeSnippetCategory--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/snippets/removecategory';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    category: name
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            }
        },

        files: {
            //TODO: test this
            checkedOut: function checkedOut(site, deferred) {
                console.log("--checkedOutFiles--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/checkedout';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site
                };
                ajaxC({
                    type: "GET",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            //TODO: test this
            checkin: function checkin(path, site, deferred) {
                console.log("--checkinFile--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/checkin';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            create: function create(filename, path, site, overwrite, deferred) {
                console.log("--createFile--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/templates/new';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path,
                    template: "20_newfile.tcf",
                    submit: "Create",
                    tcf_value_0: filename, // filename
                    tcf_value_1: overwrite, // overwrite
                    tcf_value_2: "*inherit*" // Access Group
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            // TODO: test this
            delete: function _delete(path, site) {
                var remote = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                var deferred = arguments[3];

                console.log("--deleteFile/Folder--");

                var endpoint = gadget.get('apihost') + '/files/delete';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path,
                    remote: remote
                };

                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: $.param(params, true),
                    deferred: deferred
                });
                return deferred.promise();
            },
            //TODO: test this
            dependents: function dependents(path, site, deferred) {
                console.log("--fileDependents--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/dependents';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path
                };
                ajaxC({
                    type: "GET",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            get: function get(path, site, deferred) {
                console.log("--getFiles--");

                var endpoint = gadget.get('apihost') + '/files/list';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path
                };

                ajaxC({
                    type: "GET",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            // TODO: test this
            new_folder: function new_folder(name, path, site, deferred) {
                console.log("--new_folder--");

                var endpoint = gadget.get('apihost') + '/files/new_folder';
                var params = {
                    authorization_token: gadget.get('token'),

                    name: name,
                    site: site,
                    path: path
                };

                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            //TODO: test this
            publish: function publish(path, site, versionDesc, deferred) {
                console.log("--publishFile--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/publish';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path,
                    log: versionDesc
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            }

            /*
            Params:
            site:_test
            path:/index.pcf
            log:test version
            target:_test
            tweet:
            wall_post:
            */
            , //TODO: test this
            publishMulti: function publishMulti(paths, site, versionDesc) {
                var includeCheckedout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                var includeScheduled = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
                var includePendingApproval = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
                var changedOnly = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
                var useLastPublishedVersion = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
                var includeUnpublishedDependencies = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
                var deferred = arguments[9];

                console.log("--publishMultiFile--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/multipublish';
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
                    include_unpublished: includeUnpublishedDependencies
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
            , // TODO: test this
            // path can be string or array of strings
            recycle: function recycle(path, site, deferred) {
                console.log("--recycleFiles--");

                var endpoint = gadget.get('apihost') + '/files/recycle';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path
                };

                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: $.param(params, true),
                    deferred: deferred
                });
                return deferred.promise();
            }
        },

        sites: {
            //TODO: test this
            list: function list() {
                var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
                var site = arguments[1];
                var account = arguments[2];
                var deferred = arguments[3];

                console.log("--sitesList--");

                if (typeof site == 'undefined') site = gadget.get('site');
                if (typeof account == 'undefined') account = gadget.get('account');

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/sites/list';
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
        },

        assets: {
            // TODO: test this
            // asset Id is also the same as the dependency tag (only numbers)
            checkin: function checkin(site, assetId, deferred) {
                console.log("--checkinAsset--");

                var endpoint = gadget.get('apihost') + '/assets/checkin';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    asset: assetId
                };

                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            // TODO: test this
            // asset Id is also the same as the dependency tag (only numbers)
            checkout: function checkout(site, assetId, deferred) {
                console.log("--checkoutAsset--");

                var endpoint = gadget.get('apihost') + '/assets/checkout';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    asset: assetId
                };

                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            // TODO: test this
            // asset Id is also the same as the dependency tag (only numbers) - can be array
            delete: function _delete(site, assetId, deferred) {
                console.log("--deleteAsset--");

                var endpoint = gadget.get('apihost') + '/assets/delete';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    asset: assetId
                };

                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: $.param(params, true),
                    deferred: deferred
                });
                return deferred.promise();
            },
            //TODO: test this
            // asset Id is also the same as the dependency tag (only numbers)
            dependents: function dependents(assetId, site, deferred) {
                console.log("--assetDependents--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/dependents';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: '/OMNI-ASSETS/' + assetId + '.html'
                };
                ajaxC({
                    type: "GET",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            //TODO: test this
            list: function list(site) {
                var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
                var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
                var sortKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'name';
                var sortOrder = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'asc';
                var deferred = arguments[5];

                console.log("--listAssets--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/assets/list';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: '/OMNI-ASSETS',
                    count: count,
                    start: start,
                    sort_key: sortKey,
                    sort_order: sort_order, sortOrder: sortOrder,
                    ignore_readers: true // ignore read-access rules
                };
                ajaxC({
                    type: "GET",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            }

            /*
            Params:
            count:100
            start:1
            sort_key:name
            sort_order:asc
            ignore_readers:false
            type:
            */
            , new: function _new() {}
            /*
            Web Content:
            
            POST
            assets/new
            
            Params:
            name:New Asset Name
            description:New Asset Description
            site_locked:true
            group:Webgroup
            readers:Webgroup
                content:Great new content
            site:_test
            type:0
            tags:Newtag
            tags:newtag2*/

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

            /*
            Source Code:
            
            POST
            assets/new
            
            name:New Asset Name 3
            description:New Asset Description
            site_locked:true
            group:Webgroup
            readers:Webgroup
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

            /*
            Image Gallery Add Image:
            
            POST
            assets/add_image
            
            Params:
            Query string params:
            site:_test
            asset:145350
            image:30b8bead-fd25-db48-0ebc-b02436df5212.jpg
            thumb_width:100
            thumb_height:100
            
            Has content payload (need to look at upload to get more info on how to do this)
            */

            /*
            Image Gallery Save:
            
            POST
            assets/save
            
            Params:
            thumbnail_width:100
            thumbnail_height:100
            force_crop:false
            advanced:advanced content
            site:_test
            type:3
            asset:145350
            images:{"87a68eb1-e37c-41d6-b989-8b884d3271bc.jpg":{"title":"title here","description":"description here","caption":"caption here","link":"link here"},"ae63de1e-4e31-472e-b3a2-700f972bc54c.jpg":{"title":"title here","description":"description here","caption":"caption here","link":"link here"}}
            */

            /*
            Image Gallery Delete Image:
            
            POST
            assets/delete_image
            
            Params
            site:_test
            asset:145350
            image:ae63de1e-4e31-472e-b3a2-700f972bc54c.jpg
            */

            /*
            Forms:
            
            POST
            assets/new
            
            Params:
            name:New Asset Name 5
            description:New Asset Description
            site_locked:true
                pass_message:Great success message!
                fail_message:Bad fail message :(
                use_database:true
            group:Webgroup
            readers:Webgroup
                elements:[{"name":"singlelinetextfieldlabel1","type":"input-text","required":true,"label":"Single-Line Text Field label 1","default_value":"text","validation":"email","validation_fail":"fail message","advanced":"advanced","format":"Date and Time","options":[]},{"name":"singlelinetextfieldlabel2","type":"input-text","required":false,"label":"Single-Line Text Field label 2","default_value":"","validation":"minlength:2","validation_fail":"min length failure message","advanced":"","format":"Date and Time","options":[]},{"name":"singlelinetextfieldlabel3","type":"input-text","required":false,"label":"Single-Line Text Field label 3","default_value":"","validation":"regex:regexp","validation_fail":"regexp fail message","advanced":"","format":"Date and Time","options":[]},{"name":"multilinetextfieldlabel","type":"textarea","required":false,"label":"Multi-Line Text field label","default_value":"text","validation":"","validation_fail":"","advanced":"advanced","format":"Date and Time","options":[]},{"name":"radiobuttonlabels","type":"input-radio","required":false,"label":"Radio Button labels","default_value":"","validation":"","validation_fail":"","advanced":"","format":"Date and Time","options":[{"value":"Radio 1","selected":false,"text":"Radio 1"},{"value":"Radio 2","selected":true,"text":"Radio 2"},{"value":"Radio 3","selected":false,"text":"Radio 3"}]},{"name":"checkboxes","type":"input-checkbox","required":false,"label":"Checkboxes","default_value":"","validation":"","validation_fail":"","advanced":"advanced","format":"Date and Time","options":[{"value":"checkbox 1","selected":false,"text":"checkbox 1"},{"value":"checkbox 2","selected":true,"text":"checkbox 2"},{"value":"checkbox 3","selected":true,"text":"checkbox 3"}]},{"name":"dropdownlabel1","type":"select-single","required":false,"label":"Dropdown label 1","default_value":"","validation":"","validation_fail":"","advanced":"advanced","format":"Date and Time","options":[{"value":"option 1","selected":false,"text":"option 1"},{"value":"option 2","selected":false,"text":"option 2"},{"value":"option 3","selected":true,"text":"option 3"}]},{"name":"multiselectlabel1","type":"select-multiple","required":false,"label":"Multi-select label 1","default_value":"","validation":"","validation_fail":"","advanced":"","format":"Date and Time","options":[{"value":"option 1","selected":false,"text":"option 1"},{"value":"option 2","selected":true,"text":"option 2"},{"value":"option 3","selected":true,"text":"option 3"}]}]
                emails:[{"to":"chardi17@kennesaw.edu;awill217@kennesaw.edu","from":"OU Campus","subject":"New Email Subject","body":"This is a cool email body\n\nIt does great things"},{"to":"awill217@kennesaw.edu","from":"chardi17@kennesaw.edu","subject":"Multiple Emails","body":"wow, such content"}]
            site:_test
            type:4
                captcha:false
            tags:n
            tags:s
            */

            /*
            Assets Info:
            
            GET
            assets/info
            
            Params:
            site:_test
            asset:145350
            */

            /*
            View Assets:
            
            GET
            assets/view
            
            Params:
            site:_test
            asset:145350
            */

            /*
            Assets Save (same endpoint as image gallery save - same for all 3 text-based assets):
            
            POST
            assets/save
            
            Params:
            site:_test
            asset:145346
            content:Great new content
            */
            , //TODO: test this
            publish: function publish(name, site, versionDesc, deferred) {
                console.log("--publishAsset--");

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/publish';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: '/OMNI-ASSETS/' + name,
                    log: versionDesc
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            }
        },

        reports: {
            generate: function generate() {
                stats.requestsQueued = queue.length;
                stats.requestsMade = stats.requestsQueued + stats.requestsFinished + stats.requestsPending;
                return stats;
            }
        },

        callbacks: {
            // runs when a request completes (success or fail)
            onComplete: function onComplete(callback) {
                console.log("\n **** ON COMPLETE CALLS **** \n");
                $(this).on("ouapi.complete", function (e, data) {
                    callback && callback(data);
                });
            },
            // runs when queue is empty
            onEmpty: function onEmpty(callback) {
                console.log("\n **** ON EMPTY CALLS **** \n");
                $(this).on("ouapi.empty", function (e) {
                    callback && callback();
                });
            },
            // runs when a request is not successful
            onError: function onError(callback) {
                console.log("\n **** ON ERROR CALLS **** \n");
                $(this).on("ouapi.error", function (e, data) {
                    callback && callback(data);
                });
            },
            // runs when a request is successful
            onSuccess: function onSuccess(callback) {
                console.log("\n **** ON SUCCESS CALLS **** \n");
                $(this).on("ouapi.success", function (e, data) {
                    callback && callback(data);
                });
            }
        },

        ready: function ready(callback) {
            // Your code should call this asynchronous method (once) before doing anything that
            // requires an API token or any of the other data provided by the private
            // `getEnvironment` method. The main logic of the gadget should be wrapped in a
            // function that is called when the `ready` method has completed.
            // You can provide the callback function either as an argument to the `ready`
            // method itself, as in `gadget.ready(myFunc)`, or as an argument to the `then` method
            // of the jQuery Deferred object that this method returns, as in
            // `gadget.ready().then(myFunc)`.

            console.log("ready() start");

            var deferred = new $.Deferred();
            if (this.isReady) {
                console.log("ready - true");
                isReady = true;
                callback && callback();
                deferred.resolve();
            } else {
                console.log("ready - false");
                $(this).one('ouapi.ready', function () {
                    console.log("ready callback");
                    callback && callback();
                    deferred.resolve();
                });
            }
            //var err = new Error();
            //console.log("stack trace: ", err.stack);

            return deferred;
        }
    };

    console.log("api: ", ouapi);

    var globalCodeMethodExceptions = ['ready', 'reports', 'callbacks']; // root-level keys in which to skip adding global code
    var bindMethodExceptions = ['callbacks']; // root-level keys in which to skip binding to ouapi in its literal position

    // bind all methods to the ouapi object
    for (var group in ouapi) {
        if ($.inArray(group, bindMethodExceptions)) continue;
        //console.log("group: ", group);
        for (var method in ouapi[group]) {
            //console.log("method: ", method);
            ouapi[group][method] = ouapi[group][method].bind(ouapi);
        }
    }

    // pull callback functions into top-level ouapi object
    for (var method in ouapi['callbacks']) {
        ouapi[method] = ouapi['callbacks'][method].bind(ouapi);
    }

    // add same code to top of all functions
    for (var group in ouapi) {
        if ($.inArray(group, globalCodeMethodExceptions) > -1) continue;
        //if (group == 'ready' || group == 'reports' || group == 'onEmpty') continue;

        for (var method in ouapi[group]) {
            var originalMethod = ouapi[group][method];

            if (typeof originalMethod === 'function') {
                ouapi[group][method] = function (originalMethod, group, method) {
                    return function () {
                        debugger;
                        //console.log("closure - method: ", method);
                        //console.log("closure - group: ", group);							

                        // convert arguments to array
                        var args = Array.prototype.slice.call(arguments);

                        // use deferred if present. Else, make one
                        var deferred = args[args.length - 1];
                        if (!isDeferred(deferred)) {
                            deferred = new $.Deferred();
                            args.push(deferred);
                        }

                        //console.log("----arguments: ", args);
                        var check = checkQueue(group, method, args);

                        // if no connections available, return response
                        if (!check) return deferred.promise();

                        // connections available, call method
                        return originalMethod.apply(this, args);
                    };
                }(originalMethod, group, method);
            }
        }
    }

    // make the gadget object available as a global variable
    window.ouapi = ouapi;

    ouapi.isReady = true;
    $(ouapi).trigger('ouapi.ready');
})();