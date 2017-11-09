// create closure
(function () {

    // these settings seem to work well
    var maxNumConnections = 3;
    var delay = 2000;
    var delayAfter = 5;				// delay after this many requests
    var promises = [];				// holds promises for all executed calls since last wait
    var whenApplied = false;



    // set library vars
    var currentDelayAfter = 0;		// current count for how many requests have been made
    var numConnections = 0;			// number of currently open connections
    var queue = [];					// queue of backlogged requests

    var stats = {
        requestsQueued: 0,			// # requests currently in wait queue
        requestsFinished: 0,		// # requests that have finished (both failed and successful) --
        requestsMade: 0,			// total # requests given to ouapi. requestsQueued + requestsFinished + requestsPending
        requestsSuccessful: 0,		// # requests that were successfully resolved --
        requestsFailed: 0,			// # requests that were rejected --
        requestsPending: 0,			// # requests currently processing
    }
    
    var isReady = false;

// 		debug(dequeue);
// 		debug(checkQueue);
// 		debug(closeConnection);
// 		debug(ajaxC);
// 		debug(callNext);

    /**
        Calls next queued request (after delay & sometimes delayAfter)
    */
    function dequeue(){
        console.log("--dequeue--");
        debugger;
//             closeConnection();
        console.log("queue length "+currentDelayAfter+": ", queue.length);
        console.log("promise queue length: ", promises.length);
        console.log("numConnections: ", numConnections);

        if (currentDelayAfter >= delayAfter){
            console.log("ready to wait");
            if (whenApplied == false){
                console.log("when is not applied yet");
                whenApplied = true;
                $.when.apply($, promises).always(function(){
                    console.log("when fires");
                    setTimeout(function(){
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
//            closeConnection();
            callNext();
        }
    }



    /**
        Calls the next 'num' number of methods in the wait queue
    */
    function callNext(num = 1){
        debugger;
        // don't try to call more methods than are queued
        num = num <= queue.length ? num : queue.length;
        for (var i = 0; i < num; i++){
            var method = queue.shift();
            method.func.apply(ouapi, method.args);
        }
    }

    /**
        A wrapper around the $.ajax method. Once complete, it automatically tries to start next request in queue.
        @return deferred object
    */
    function ajaxC(params){
        debugger;
        var origComplete = params.complete || null;
        var origSuccess = params.success || null;
        var origError = params.error || null;

        var methodData = {
            params: params.data
        }
        params.success = function(data, jqXHR, textStatus){
            stats.requestsPending--;
            dequeue();
            data.methodData = methodData;

            // don't report success if response has error
            if (data.error){
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
        params.error = function(data, jqXHR, textStatus){
            stats.requestsPending--;
            stats.requestsFailed++;

            dequeue();
            data.methodData = methodData;
            params.deferred.reject(data);
            if (origError) origError(data, jqXHR, textStatus);
            $(ouapi).trigger('ouapi.error', data);
        };
        params.complete = function(data, jqXHR, textStatus){
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
    function checkConnections(){
        debugger;
        if (numConnections < maxNumConnections){
            return true;
        }
        else{
            return false;
        }
    }

    /**
        Does necessary housekeeping to symbolically open a connection
    */
    function openConnection(){
        debugger;
        numConnections++;
        currentDelayAfter++;
    }

    /**
        Does necessary housekeeping to symbolically close a connection
    */
    function closeConnection(){
        debugger;
        console.log("--close connection - requestsFinished: ", stats.requestsFinished);
        numConnections--;
        stats.requestsFinished++;
        if (queue.length < 1)
            $(ouapi).trigger('ouapi.empty');
    }

    /**
        Resets variables so the next clump can begin
    */
    function resetClump(){
        //numConnections = 0;
        currentDelayAfter = 0;
        promises = [];
        whenApplied = false;
    }

    /**
        Determines if a varible contains a promise object
        @return bool
    */
    function isPromise(x){
        if (typeof x == 'undefined')
            return false;
        
        if (x.promise && !isDeferred(x))
            return true;
        return false;
    }

    /**
        Determines if a varible contains a deferred object
        @return bool
    */
    function isDeferred(x){
        if (typeof x == 'undefined')
            return false;
        
        if (x.promise && x.notify)
            return true;
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
    function checkQueue(group, method, args){
        console.log("--checkQueue--");
        debugger;

        // grab deferred (always last element)
        var deferred = args[args.length - 1];

        if (!checkConnections()){
            queue.push({func: ouapi[group][method], args: args});
            return false;
        }
        promises.push(deferred.promise());
        openConnection();
        return true;

    }


    var ouapi = {
        snippets: {
            /* insert:snippets */
        },

        files: {
            /* insert:files */
        },

        directories: {
            /* insert:directories */
        },
        
        sites: {
            /* insert:sites */
        },

        assets: {
            /* insert:assets */
        },

        reports: {
            /* insert:reports */
        },
        
        util: {
            /* insert:util */
        },

        callbacks: {
            /* insert:callbacks */
        },



        ready: function (callback) {
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

    var globalCodeMethodExceptions = ['ready', 'reports', 'callbacks', 'util'];	// root-level keys in which to skip adding global code
    var bindMethodExceptions = ['callbacks'];							// root-level keys in which to skip binding to ouapi in its literal position

    // bind all methods to the ouapi object
    for (var group in ouapi) {
        if ($.inArray(group, bindMethodExceptions)) continue;
        //console.log("group: ", group);
        for (var method in ouapi[group]){
            //console.log("method: ", method);
            ouapi[group][method] = ouapi[group][method].bind(ouapi);
        }
    }

    // pull callback functions into top-level ouapi object
    for (var method in ouapi['callbacks']){
        ouapi[method] = ouapi['callbacks'][method].bind(ouapi);
    }

    // add same code to top of all functions
    for (var group in ouapi) {
        if ($.inArray(group, globalCodeMethodExceptions) > -1) continue;
        //if (group == 'ready' || group == 'reports' || group == 'onEmpty') continue;

        for (var method in ouapi[group]){
            var originalMethod = ouapi[group][method];

            if (typeof originalMethod === 'function'){
                ouapi[group][method] = (function(originalMethod, group, method) {
                    return function() {
                        debugger;
                        //console.log("closure - method: ", method);
                        //console.log("closure - group: ", group);							
                        console.log("original method # params: ", originalMethod.length);
                        // convert arguments to array
                        var args = Array.prototype.slice.call(arguments);

                        // make sure all expected parameters are received (even if undefined). Excludes deferred.
                        if (args.length < originalMethod.length - 1){
                            // make up difference in parameters
                            var diff = originalMethod.length - 1 - args.length;
                            for (var i = 0; i < diff; i++){
                                args.push(undefined);
                            }
                        }
                        
                        console.log("args (arguments): ", args);
                        // use deferred if present. Else, make one
                        var deferred = args[args.length - 1];
                        if (!isDeferred(deferred)){
                            deferred = new $.Deferred();
                            args.push(deferred);
                        }

                        //console.log("----arguments: ", args);
                        var check = checkQueue(group, method, args);

                        // if no connections available, return response
                        if (!check)
                            return deferred.promise();

                        // connections available, call method
                        return originalMethod.apply(this, args);
                    }
                })(originalMethod, group, method);
            }
        }
    }


    // make the gadget object available as a global variable
    window.ouapi = ouapi;

    ouapi.isReady = true;
    $(ouapi).trigger('ouapi.ready');

})();


