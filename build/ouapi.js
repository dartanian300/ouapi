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
    };

    var isReady = false;

    // 		debug(dequeue);
    // 		debug(checkQueue);
    // 		debug(closeConnection);
    // 		debug(ajaxC);
    // 		debug(callNext);

    /**
        Calls next queued request (after delay & sometimes delayAfter)
    */
    function dequeue() {
        void 0;
        
        //             closeConnection();
        void 0;
        void 0;
        void 0;

        if (currentDelayAfter >= delayAfter) {
            void 0;
            if (whenApplied == false) {
                void 0;
                whenApplied = true;
                $.when.apply($, promises).always(function () {
                    void 0;
                    setTimeout(function () {
                        void 0;

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
            void 0;
            //            closeConnection();
            callNext();
        }
    }

    /**
        Calls the next 'num' number of methods in the wait queue
    */
    function callNext() {
        var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        
        // don't try to call more methods than are queued
        num = num <= queue.length ? num : queue.length;
        for (var i = 0; i < num; i++) {
            var method = queue.shift();
            method.func.apply(ouapi, method.args);
        }
    }

    /**
        A wrapper around the $.ajax method. Once complete, it automatically tries to start next request in queue.
        @return deferred object
    */
    function ajaxC(params) {
        
        var origComplete = params.complete || null;
        var origSuccess = params.success || null;
        var origError = params.error || null;

        var methodData = {
            params: params.data
        };
        params.success = function (data, jqXHR, textStatus) {
            closeConnection();
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
            closeConnection();
            stats.requestsPending--;
            stats.requestsFailed++;

            dequeue();
            data.methodData = methodData;
            params.deferred.reject(data);
            if (origError) origError(data, jqXHR, textStatus);
            $(ouapi).trigger('ouapi.error', data);
        };
        params.complete = function (data, jqXHR, textStatus) {
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
        
        numConnections++;
        currentDelayAfter++;
    }

    /**
        Does necessary housekeeping to symbolically close a connection
    */
    function closeConnection() {
        
        void 0;
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
        if (typeof x == 'undefined') return false;

        if (x.promise && !isDeferred(x)) return true;
        return false;
    }

    /**
        Determines if a varible contains a deferred object
        @return bool
    */
    function isDeferred(x) {
        if (typeof x == 'undefined') return false;

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
        void 0;
        

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
            add: function add(name, path, site, description, category, deferred) {
                void 0;

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
                void 0;

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
            edit: function edit(name, path, site, description, category, newName, newPath, newDescription, newCategory, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/snippets/editsnippet';
                var params = {
                    authorization_token: gadget.get('token'),

                    snippet: name,
                    path: path,
                    site: site,
                    description: description,
                    category: category,
                    selected: false
                };

                if (typeof newName != 'undefined' && newName != name) params.name = newName;else params.name = name;
                if (typeof newPath != 'undefined' && newPath != path) params.path = newPath;
                if (typeof newDescription != 'undefined' && newDescription != description) params.description = newDescription;
                if (typeof newCategory != 'undefined' && newCategory != category) {
                    params.category = newCategory;
                    params.old_category = category;
                }

                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            }

            //snippet:hgd - old name
            //name: hdg2 - new name
            //path:j - new
            //description:d - new
            //category:Calendars
            //selected:false
            //old_category:main
            //site:_test

            , list: function list(site, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/snippets/list';
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
            }

            /*
            OUTPUT:
            [
              [
                {
                  "Main Content": [
                    {
                      "snippet": "Link List (2 columns)",
                      "path": "/_resources/snippets/cantina_two_col.html",
                      "description": "List of links with image and title"
                    },
                    {
                      "snippet": "Link List (3 columns)",
                      "path": "/_resources/snippets/cantina.html",
                      "description": "List of links with image and title"
                    },
                    {
                      "snippet": "Page Feature",
                      "path": "/_resources/snippets/transmission_announcement.html",
                      "description": "Page-wide gray bar with image, title, text and link"
                    },
                    {
                      "snippet": "Preview (4 columns)",
                      "path": "/_resources/snippets/fleet.html",
                      "description": "Four column layout with linked image and text"
                    },
                    {
                      "snippet": "Preview (1 column)",
                      "path": "/_resources/snippets/fleet_onecol.html",
                      "description": "One column layout with linked image and text"
                    },
                    {
                      "snippet": "Show/Hide Accordion",
                      "path": "/_resources/snippets/accordion.html",
                      "description": "Show/Hide accordion with title and text content"
                    },
                    {
                      "snippet": "Teaser",
                      "path": "/_resources/snippets/teaser_w_photo.html",
                      "description": "List of items each having a photo, title, description and optional links"
                    },
                    {
                      "snippet": "Teaser (no image)",
                      "path": "/_resources/snippets/teaser_no_photo.html",
                      "description": "List of items each having a title, description and optional links"
                    },
                    {
                      "snippet": "Button",
                      "path": "/_resources/snippets/button.html",
                      "description": "Clickable button with link"
                    },
                    {
                      "snippet": "Table",
                      "path": "/_resources/snippets/table.html",
                      "description": "A simple table"
                    },
                    {
                      "snippet": "Two-Column Layout",
                      "path": "/_resources/snippets/two_columns.html",
                      "description": "Splits a page into 2 columns"
                    },
                    {
                      "snippet": "EMS Event Feed",
                      "path": "/_resources/snippets/ksu_campus_cal.html",
                      "description": "An event feed from EMS"
                    },
                    {
                      "snippet": "Course Listing",
                      "path": "/_resources/snippets/courses_listing.html",
                      "description": "Lists all graduate and/or undergraduate courses for a given course prefix"
                    },
                    {
                      "snippet": "Tumblr Feed",
                      "path": "/_resources/snippets/tumblr_feed.html",
                      "description": "Pulls content from a tumblr account and displays it"
                    },
                    {
                      "snippet": "Preview (3 columns)",
                      "path": "/_resources/snippets/fleet_threecol.html",
                      "description": "Three column layout with linked image and text"
                    },
                    {
                      "snippet": "Gold Header",
                      "path": "/_resources/snippets/gold_header.html",
                      "description": "A gold header"
                    },
                    {
                      "snippet": "Twitter Feed",
                      "path": "/_resources/snippets/twitter_feed.html",
                      "description": "A twitter feed"
                    },
                    {
                      "snippet": "Long List (Alphabetized)",
                      "path": "/_resources/snippets/long_list_alphabetized.html",
                      "description": "Automatically alphabetizes the content and outputs a zebra-striped list"
                    },
                    {
                      "snippet": "Faculty/Staff Listing",
                      "path": "/_resources/snippets/faculty_staff_listing.html",
                      "description": "An alphabetical listing of faculty and staff"
                    },
                    {
                      "snippet": "Academic Calendar",
                      "path": "/_resources/snippets/academic_calendar.html",
                      "description": "Pulls events from EMS to create an academic calendar for the year"
                    },
                    {
                      "snippet": "Calendar Listing",
                      "path": "/_resources/snippets/calendar_listing.html",
                      "description": "A calendar listing of events from an OwlLife or Master Calendar RSS feed"
                    },
                    {
                      "snippet": "Preview (2 columns)",
                      "path": "/_resources/snippets/fleet_twocol.html",
                      "description": "Two column layout with linked image and text"
                    },
                    {
                      "snippet": "Heading with Link",
                      "path": "/_resources/snippets/heading_with_link.html",
                      "description": "A heading with a link beside it"
                    }
                  ]
                },
                {
                  "Utility": [
                    {
                      "snippet": "Utility - Index List",
                      "path": "/_resources/snippets/index-listing.html",
                      "description": "Pulls section nav for overview page"
                    },
                    {
                      "snippet": "Utility - Widgets Home",
                      "path": "/_resources/snippets/modules.pcf",
                      "description": "Complete Listing of All Modules / Widgets / Snippets"
                    }
                  ]
                },
                {
                  "training": [
                    {
                      "snippet": "Teaser",
                      "path": "/_resources/snippets/teaser_w_photo.html",
                      "description": ""
                    }
                  ]
                },
                {
                  "Blog": [
                    {
                      "snippet": "Image with Caption",
                      "path": "/_resources/snippets/blog/img-caption.html",
                      "description": ""
                    },
                    {
                      "snippet": "Blog Posts By Category",
                      "path": "/_resources/snippets/blog_posts_by_category.html",
                      "description": "Pull blog posts based on a category"
                    },
                    {
                      "snippet": "Blog Posts By Tag",
                      "path": "/_resources/snippets/blog_posts_by_tag.html",
                      "description": "Pull blog posts based on a tag"
                    },
                    {
                      "snippet": "Blog Recent Posts",
                      "path": "/_resources/snippets/blog_recent_posts.html",
                      "description": "Pull recent posts"
                    }
                  ]
                },
                {
                  "Sidebar": [
                    {
                      "snippet": "Feature",
                      "path": "/_resources/snippets/tie_bomber.html",
                      "description": "Gray content box"
                    },
                    {
                      "snippet": "Link List",
                      "path": "/_resources/snippets/tie_advanced.html",
                      "description": "List of links with gold title"
                    },
                    {
                      "snippet": "Social Media",
                      "path": "/_resources/snippets/social_media.html",
                      "description": "Displays your social media icons with links"
                    },
                    {
                      "snippet": "Feature (no background)",
                      "path": "/_resources/snippets/tie_fighter.html",
                      "description": "Content box with blue title and no background"
                    }
                  ]
                },
                {
                  "All Snippets": [
                    {
                      "snippet": "Utility - Widgets Home",
                      "path": "/_resources/snippets/modules.pcf",
                      "description": "Complete Listing of All Modules / Widgets / Snippets"
                    },
                    {
                      "snippet": "Sidebar - Feature (no background)",
                      "path": "/_resources/snippets/tie_fighter.inc",
                      "description": "Content box with blue title and no background"
                    },
                    {
                      "snippet": "Sidebar - Feature",
                      "path": "/_resources/snippets/tie_bomber.html",
                      "description": "Gray content box"
                    },
                    {
                      "snippet": "Main Content - Link List (3 columns)",
                      "path": "/_resources/snippets/cantina.html",
                      "description": "List of links with image and title"
                    },
                    {
                      "snippet": "Main Content - Preview (4 columns)",
                      "path": "/_resources/snippets/fleet.html",
                      "description": "Four column layout with linked image and text"
                    },
                    {
                      "snippet": "Main Content - Link List (2 columns)",
                      "path": "/_resources/snippets/cantina_two_col.html",
                      "description": "List of links with image and title"
                    },
                    {
                      "snippet": "ksu_group",
                      "path": "/_resources/snippets/ksu_group.html",
                      "description": "Use this table snippet to insert multiple snippets next to each other on a page. "
                    },
                    {
                      "snippet": "Main Content - Teaser",
                      "path": "/_resources/snippets/teaser_w_photo.html",
                      "description": "??????\r\n\r\nTeaser element with photo. Use KSU Teaser Group Table Snippet to have proper formatting. Can be used on page by itself but will stretch the content. "
                    },
                    {
                      "snippet": "Main Content - Teaser (no image)",
                      "path": "/_resources/snippets/teaser_no_photo.html",
                      "description": "???????\r\n\r\n\r\nTeaser element without a photo. Use KSU Teaser Group Table Snippet to have proper formatting. Can be used on page by itself but will stretch the content. "
                    },
                    {
                      "snippet": "Sidebar - Link List",
                      "path": "/_resources/snippets/tie_advanced.html",
                      "description": "List of links with gold title"
                    },
                    {
                      "snippet": "Home - User Groups",
                      "path": "/_resources/snippets/user_groups.html",
                      "description": "Six user group table for image, title and content link."
                    },
                    {
                      "snippet": "Main Content - Page Feature",
                      "path": "/_resources/snippets/transmission_announcement.html",
                      "description": "Page-wide gray bar with image, title, text and link"
                    },
                    {
                      "snippet": "Home - News Feed",
                      "path": "/_resources/snippets/news_feed.html",
                      "description": "Home Events feed table with title, url(rss feed.xml), number of items, category and section title/link. "
                    },
                    {
                      "snippet": "Home - Events Feed",
                      "path": "/_resources/snippets/events_feed.html",
                      "description": "Home Events feed table with title, url(rss feed.xml), number of items, category and section title/link. "
                    },
                    {
                      "snippet": "Home - Cantina",
                      "path": "/_resources/snippets/home_cantina.html",
                      "description": "Table with image, heading, short description and content link(read more) from the home page. "
                    },
                    {
                      "snippet": "General - Button",
                      "path": "/_resources/snippets/button.html",
                      "description": "Clickable button with link"
                    },
                    {
                      "snippet": "News - Landing RSS",
                      "path": "/_resources/snippets/news_landing_feed.html",
                      "description": "News Landing Page Feed. "
                    },
                    {
                      "snippet": "News - Social Media Feature",
                      "path": "/_resources/snippets/social_tie_bomber.html",
                      "description": "Social tie bomber for news landing page."
                    },
                    {
                      "snippet": "Main Content - Preview (1 column)",
                      "path": "/_resources/snippets/fleet_onecol.html",
                      "description": "One column layout with linked image and text"
                    },
                    {
                      "snippet": "News - HootFeed RSS",
                      "path": "/_resources/snippets/ksu_hootfeed.html",
                      "description": "KSU Hoots. Feed widget from news landing page.. "
                    },
                    {
                      "snippet": "News - Around Campus RSS",
                      "path": "/_resources/snippets/ksu_campus_cal.html",
                      "description": "KSU around campus calendar widget from news landing page. "
                    },
                    {
                      "snippet": "Main Content - Show/Hide Accordion",
                      "path": "/_resources/snippets/accordion.html",
                      "description": "Show/Hide accordion with title and text content"
                    },
                    {
                      "snippet": "Utility - Index List",
                      "path": "/_resources/snippets/index-listing.html",
                      "description": "Pulls section nav for overview page"
                    }
                  ]
                }
              ]
            ]
            */
            , remove: function remove(name, site, category, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/snippets/removesnippet';
                var params = {
                    authorization_token: gadget.get('token'),

                    snippet: name,
                    site: site,
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
            removeCategory: function removeCategory(name, site, deferred) {
                void 0;

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
            checkedOut: function checkedOut(site, deferred) {
                void 0;

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
            checkin: function checkin(path, site, deferred) {
                void 0;

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
            checkout: function checkout(path, site, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/checkout';
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
                void 0;
                if (typeof overwrite == 'undefined') overwrite = false;

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
            // path can be array
            delete: function _delete(path, site, remote, deferred) {
                void 0;
                if (typeof remote == 'undefined') remote = false;

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
            dependents: function dependents(path, site, deferred) {
                void 0;

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
                void 0;

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
            info: function info(path, site, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/info';
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
            list: function list(path, site, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/list';
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
            new_folder: function new_folder(name, path, site, deferred) {
                void 0;

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
            publish: function publish(path, site, versionDesc, deferred) {
                void 0;

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
            },
            // paths can be an array
            publishMulti: function publishMulti(paths, site, versionDesc, includeCheckedout, includeScheduled, includePendingApproval, changedOnly, useLastPublishedVersion, includeUnpublishedDependencies, deferred) {
                void 0;
                if (typeof includeCheckedout == 'undefined') includeCheckedout = false;
                if (typeof includeScheduled == 'undefined') includeScheduled = false;
                if (typeof includePendingApproval == 'undefined') includePendingApproval = false;
                if (typeof changedOnly == 'undefined') changedOnly = false;
                if (typeof useLastPublishedVersion == 'undefined') useLastPublishedVersion = false;
                if (typeof includeUnpublishedDependencies == 'undefined') includeUnpublishedDependencies = true;

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
            , // path can be string or array of strings
            recycle: function recycle(path, site, deferred) {
                void 0;

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
            },
            save: function save(path, site, content, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/save';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path,
                    text: content
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            source: function source(path, site, brokenTags, deferred) {
                void 0;
                if (typeof brokenTags == 'undefined') brokenTags = true;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/source';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: path,
                    brokentags: brokenTags
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

        directories: {
            //TODO: test this
            settings: function settings(path, site, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/directories/settings';
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
            }
        },

        sites: {
            // type string - 'string' or 'regex'
            // negexts bool - if true, exclude extensions. If false, use only the extensions
            // paths array - strings of paths to search
            find: function find(site, _find, caseSensitive, includeLocked, paths, type, negexts, extensions, deferred) {
                //    console.log("this: ", this);
                void 0;
                if (typeof caseSensitive == 'undefined') caseSensitive = false;
                if (typeof includeLocked == 'undefined') includeLocked = true;
                //    if (typeof paths == 'undefined') paths = "";
                if (typeof type == 'undefined') type = 'string';
                if (typeof negexts == 'undefined') negexts = true;
                if (typeof extensions == 'undefined') extensions = [];

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/sites/findreplace';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    srchstr: _find,
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
                if (typeof paths == 'undefined') {
                    //ignore this connection
                    closeConnection();
                    ouapi.files.list('/', site).then(function (fileList) {
                        //            console.log("test");
                        var paths = $.map(fileList.entries, function (n) {
                            return n.staging_path;
                        });
                        //            console.log("paths: ", paths);

                        params.paths = JSON.stringify(paths);
                        ajaxC({
                            type: "POST",
                            url: endpoint,
                            data: $.param(params, true),
                            deferred: intDeferred
                        }).then(function (resp) {
                            return ouapi.util.findReplaceStatus(site, resp.id);
                        }).then(function (searchData) {
                            // return data with promise.resolve
                            deferred.resolve(searchData);
                        }).fail(function (resp) {
                            deferred.reject(resp);
                        });
                    });
                } else {
                    // just search the given paths
                    ajaxC({
                        type: "POST",
                        url: endpoint,
                        data: $.param(params, true),
                        deferred: intDeferred
                    }).then(function (resp) {
                        return ouapi.util.findReplaceStatus(site, resp.id);
                    }).then(function (searchData) {
                        // return data with promise.resolve
                        deferred.resolve(searchData);
                    }).fail(function (resp) {
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

            , list: function list(site, account, count, deferred) {
                if (typeof count == 'undefined') count = 5000;
                void 0;

                void 0;

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
            },
            test: function test(site, deferred) {
                void 0;

                ouapi.sites.list(site).done(function (sites) {
                    void 0;

                    // list snippets
                    var protocol = "http:";
                    var endpoint = /*protocol +*/gadget.get('apihost') + '/snippets/list';
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
                });
                return deferred.promise();
            }
        },

        assets: {
            // I NEED TO LOOK AT THIS MORE - NOT DONE

            // TODO: test this
            // TODO: figure out payload (file)
            // asset Id is also the same as the dependency tag (only numbers)
            add_image: function add_image(site, assetId, image, thumb_width, thumb_height, deferred) {
                void 0;
                if (typeof thumb_width == 'undefined') thumb_width = 100;
                if (typeof thumb_height == 'undefined') thumb_height = 100;

                var form = new FormData();
                var file = new File([fileContents], filename, { type: "image/jpeg" });
                form.append(filename, file);

                var endpoint = gadget.get('apihost') + '/assets/add_image';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    asset: assetId,
                    image: image,
                    thumb_width: thumb_width,
                    thumb_height: thumb_height
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

            /*function uploadFile(site, path, filename, fileContents, overwrite){
            				console.log("upload file...");
            				checkConnections();
            				logConnections();
            				var overwrite = (overwrite == true ? "true" : "false");
            				var endpoint = gadget.get('apihost') + '/files/upload?site='+site+'&path='+path+'&overwrite='+overwrite+'&access=*inherit*&authorization_token='+gadget.get('token');
            				
            				// create uploadable file
            				var form = new FormData();
            				var file = new File([fileContents], filename, {type: "text/plain"});
            				form.append(filename, file);
            				
            				var params = {
            					file: file
            				};
            				
            				console.log("sending request....");
            				return $.ajax({
            					type: "POST",
            					url: endpoint, 
            					data: form,
            					contentType: false,
            					processData: false,
            					complete: function(){
            						alert("ajax always");
            						closeConnection();
            					},
            					success: function(){
            						alert("ajax success");
            					},
            					error: function(){
            						alert("ajax error");
            					}
            				});
            			}*/
            , // asset Id is also the same as the dependency tag (only numbers)
            checkin: function checkin(site, assetId, deferred) {
                void 0;

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
            // asset Id is also the same as the dependency tag (only numbers)
            checkout: function checkout(site, assetId, deferred) {
                void 0;

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
            // asset Id is also the same as the dependency tag (only numbers) - can be array
            delete: function _delete(site, assetId, deferred) {
                void 0;

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
            // asset Id is also the same as the dependency tag (only numbers)
            dependents: function dependents(assetId, site, deferred) {
                void 0;

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
            // asset Id is also the same as the dependency tag (only numbers)
            info: function info(site, assetId, deferred) {
                void 0;

                var endpoint = gadget.get('apihost') + '/assets/info';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    asset: assetId
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
            Assets Info:
            
            GET
            assets/info
            
            Params:
            site:_test
            asset:145350
            */
            , list: function list(site, count, start, sortKey, sortOrder, deferred) {
                void 0;
                if (typeof count == 'undefined') count = 100;
                if (typeof start == 'undefined') start = 1;
                if (typeof sortKey == 'undefined') sortKey = 'name';
                if (typeof sortOrder == 'undefined') sortOrder = 'asc';

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/assets/list';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: '/OMNI-ASSETS',
                    count: count,
                    start: start,
                    sort_key: sortKey,
                    sort_order: sortOrder,
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
            Assets Save (same endpoint as image gallery save - same for all 3 text-based assets):
            
            POST
            assets/save
            
            Params:
            site:_test
            asset:145346
            content:Great new content
            */
            , // tags can be an array
            /*
                @param object extra - can contain these keys:
                pass_message: string
                fail_message: string
                use_database: bool
                captcha: bool
            */
            /*
                formContents & emails are JSON
                
                emails format:
                [{"to":"toemail@email.com","from":"from3mail@email.com","subject":"Subject line","body":"A cool\nbody \nemail\n\nyeah"}]
            */
            newForm: function newForm(name, site, description, formContents, emails, group, readGroup, tags, lockToSite, extra, deferred) {
                void 0;
                if (typeof formContents == 'undefined' || formContents == '') formContents = '[]';
                if (typeof emails == 'undefined' || emails == '') emails = '[]';
                if (typeof group == 'undefined') group = 'Everyone';
                if (typeof readGroup == 'undefined') readGroup = 'Everyone';
                if (typeof lockToSite == 'undefined') lockToSite = true;

                if (typeof extra == 'undefined') extra = {
                    pass_message: "Thank you for your submission",
                    fail_message: "There was an error. Please try again.",
                    use_database: true,
                    captcha: false
                };

                var endpoint = gadget.get('apihost') + '/assets/new';
                var params = {
                    authorization_token: gadget.get('token'),

                    name: name,
                    site: site,
                    description: description,
                    group: group,
                    readers: readGroup,
                    elements: formContents,
                    emails: emails,
                    tags: tags,
                    site_locked: lockToSite,
                    type: 4
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
            , // tags can be an array
            /*
                @param object extra - can contain these keys:
                thumbnail_width: int
                thumbnail_height: int
                force_crop: bool
                advanced: string
            */
            newImageGallery: function newImageGallery(name, site, description, group, readGroup, tags, lockToSite, extra, deferred) {
                void 0;
                if (typeof group == 'undefined') group = 'Everyone';
                if (typeof readGroup == 'undefined') readGroup = 'Everyone';
                if (typeof lockToSite == 'undefined') lockToSite = true;

                if (typeof extra == 'undefined') extra = {
                    thumbnail_width: 100,
                    thumbnail_height: 100,
                    force_crop: false
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
            , // tags can be an array
            newPlainText: function newPlainText(name, site, description, content, group, readGroup, tags, lockToSite, deferred) {
                void 0;
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
            , // tags can be an array
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
            newSourceCode: function newSourceCode(name, site, description, content, group, readGroup, tags, lockToSite, extra, deferred) {
                void 0;
                if (typeof group == 'undefined') group = 'Everyone';
                if (typeof readGroup == 'undefined') readGroup = 'Everyone';
                if (typeof lockToSite == 'undefined') lockToSite = true;

                if (typeof extra == 'undefined') extra = {};

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
            , // tags can be an array
            newWebContent: function newWebContent(name, site, description, content, group, readGroup, tags, lockToSite, deferred) {
                void 0;
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
            , // forms & galleries use .json - others use .html
            //TODO: figure out best way to handle .json vs .html file extensions
            publish: function publish(site, filename, versionDesc, deferred) {
                void 0;

                var protocol = "http:";
                var endpoint = /*protocol +*/gadget.get('apihost') + '/files/publish';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    path: '/OMNI-ASSETS/' + filename,
                    log: versionDesc
                };
                ajaxC({
                    type: "POST",
                    url: endpoint,
                    data: params,
                    deferred: deferred
                });
                return deferred.promise();
            },
            // asset Id is also the same as the dependency tag (only numbers)
            view: function view(site, assetId, deferred) {
                void 0;

                var endpoint = gadget.get('apihost') + '/assets/view';
                var params = {
                    authorization_token: gadget.get('token'),

                    site: site,
                    asset: assetId
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
            View Assets:
            
            GET
            assets/view
            
            Params:
            site:_test
            asset:145350
            */

            /*
            Response: 
            {"type_name":"generic","site":"_test","is_published":false,"name":"Web content asset","site_locked":true,"description":"description","asset":146296,"type":0,"content":"web content","enabled":true,"tags":[]}
            */
        },

        reports: {
            generate: function generate() {
                stats.requestsQueued = queue.length;
                stats.requestsMade = stats.requestsQueued + stats.requestsFinished + stats.requestsPending;
                return stats;
            }
        },

        util: {
            findReplaceStatus: function findReplaceStatus(site, searchId) {
                void 0;
                var deferred = new $.Deferred();

                var endpoint = gadget.get('apihost') + '/sites/findreplacestatus';
                var params = {
                    authorization_token: gadget.get('token'),

                    id: searchId,
                    site: site
                };
                var pingInterval = 2000;

                var interval = setInterval(function () {
                    $.ajax({
                        type: "GET",
                        url: endpoint,
                        data: params
                    }).then(function (statusResponse) {
                        if (statusResponse.error == true) {
                            clearInterval(interval);
                            deferred.reject(statusResponse);
                        }
                        if (statusResponse.finished == true) {
                            clearInterval(interval);
                            deferred.resolve(statusResponse);
                        }
                    }, function (resp) {
                        clearInterval(interval);
                        deferred.reject(resp);
                    });
                }, pingInterval);

                return deferred.promise();
            },
            printPromiseStates: function printPromiseStates() {
                var states = "";
                $.each(promises, function (i, prom) {
                    states += prom.state() + ", ";
                });
                void 0;
            }
        },

        callbacks: {
            // runs when a request completes (success or fail)
            onComplete: function onComplete(callback) {
                void 0;
                $(this).on("ouapi.complete", function (e, data) {
                    callback && callback(data);
                });
            },
            // runs when queue is empty
            onEmpty: function onEmpty(callback) {
                void 0;
                $(this).on("ouapi.empty", function (e) {
                    callback && callback();
                });
            },
            // runs when a request is not successful
            onError: function onError(callback) {
                void 0;
                $(this).on("ouapi.error", function (e, data) {
                    callback && callback(data);
                });
            },
            // runs when a request is successful
            onSuccess: function onSuccess(callback) {
                void 0;
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

            void 0;

            var deferred = new $.Deferred();
            if (this.isReady) {
                void 0;
                isReady = true;
                callback && callback();
                deferred.resolve();
            } else {
                void 0;
                $(this).one('ouapi.ready', function () {
                    void 0;
                    callback && callback();
                    deferred.resolve();
                });
            }
            //var err = new Error();
            //console.log("stack trace: ", err.stack);

            return deferred;
        }
    };

    void 0;

    var globalCodeMethodExceptions = ['ready', 'reports', 'callbacks', 'util']; // root-level keys in which to skip adding global code
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
                        
                        //console.log("closure - method: ", method);
                        //console.log("closure - group: ", group);							
                        void 0;
                        // convert arguments to array
                        var args = Array.prototype.slice.call(arguments);

                        // make sure all expected parameters are received (even if undefined). Excludes deferred.
                        if (args.length < originalMethod.length - 1) {
                            // make up difference in parameters
                            var diff = originalMethod.length - 1 - args.length;
                            for (var i = 0; i < diff; i++) {
                                args.push(undefined);
                            }
                        }

                        void 0;
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