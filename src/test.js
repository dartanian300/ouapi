gadget.ready(function(){
		console.log("gadget ready");
		ouapi.ready(function(){
            console.log("ouapi ready");
            $button = $("<button>Start Test</button>");
			$button.click(doTest);
			$("body").append($button);
        });
});


function doTest(){
    // snippets
    var site = "_test";
    var snippetCategory = "main";
//    ouapi.snippets.add("Test snippet", "../hello", site, "I have no description", snippetCategory).then( function(){ console.log("snippets add done"); } );
//    ouapi.snippets.createCategory("Test Category", site).then( function(){ console.log("create snippet category done"); } );
//    ouapi.snippets.list(site).then( function(data){ console.log("list done: ", data); } );
//    ouapi.snippets.remove("Test snippet", site, snippetCategory).then( function(data){ console.log("remove snippet done"); } );
//    ouapi.snippets.removeCategory("Test Category", site).then( function(data){ console.log("remove snippet category done"); } );
    
    // sites
//    ouapi.sites.list().then( function(data){ console.log("list sites done: ", data); } );
    
    // files
    var path = "/index.pcf";
//    ouapi.files.source(site, path).then( function(data){ console.log("files source done: ", data); } );
//    ouapi.files.get(path, site).then( function(data){ console.log("files get done: ", data); } );
//    ouapi.files.info(path, site).then( function(data){ console.log("files info done: ", data); } );
//    ouapi.files.list(path, site).then( function(data){ console.log("files list done: ", data); } );
//    ouapi.files.dependents(path, site).then( function(data){ console.log("files dependents done: ", data); } );
//    ouapi.files.checkedOut(site).then( function(data){ console.log("files checked out done: ", data); } );
    
//    ouapi.files.checkout(path, site).then( function(data){ console.log("check out file done: ", data); } );
//    ouapi.files.checkin(path, site).then( function(data){ console.log("files checkin done: ", data); } );
    
//    ouapi.files.create("index2.pcf", "/", site).then( function(data){ console.log("files create done: ", data); } );
//    ouapi.files.new_folder("new_folder", "/", site).then( function(data){ console.log("files new folder done: ", data); } );
//    ouapi.files.publish(path, site, "New test version").then( function(data){ console.log("files publish done: ", data); } );
//    ouapi.files.recycle(path, site).then( function(data){ console.log("files recycle done: ", data); } );
//    ouapi.files.save(path, site, "this is some new content").then( function(data){ console.log("files save done: ", data); } );
//    ouapi.files.delete(path, site).then( function(data){ console.log("files delete done: ", data); } );
//    
//    ouapi.files.publishMulti(['/index.pcf', '/index-34525.pcf'],
//                        site,
//                        "Multipublish version description",
//                        true,
//                        true,
//                        true,
//                       ).then( function(data){ console.log("publish multi done: ", data); } );
    
    
    // assets
    
    //var assetId = '146290';
    var assetId = '146296';
//    ouapi.assets.newPlainText("Plain Text asset", site, "Cool description", "Some awesome content").then( function(data){ console.log("assets newPlainText done: ", data); } );
//    ouapi.assets.newImageGallery("Image Gallery Asset", site, "cool description").then( function(data){ console.log("assets newImageGallery done: ", data); } );
//    ouapi.assets.newSourceCode("Source Code Asset", site, 'description', '<html></html>').then( function(data){ console.log("assets newSourceCode done: ", data); } );
//    ouapi.assets.newWebContent("Web content asset", site, 'description', 'web content').then( function(data){ console.log("assets newWebContent done: ", data); } );
//    ouapi.assets.newForm('Form asset 3', site, 'description', '', '', 'Webgroup', 'Webgroup', ['tag1', 'tag2', 'tag3'], false, {
//        pass_message: "SUCCESS!",
//        fail_message: "please try again",
//        use_database: true,
//        captcha: false,
//        
//    }).then( function(data){ console.log("assets newForm done: ", data); } );
    
//    ouapi.assets.checkin(site, assetId).then( function(data){ console.log("assets checkin done: ", data); } );
//    ouapi.assets.checkout(site, assetId).then( function(data){ console.log("assets checkout done: ", data); } );
//    ouapi.assets.view(site, assetId).then( function(data){ console.log("assets view done: ", data); } );
//    ouapi.assets.list(site).then( function(data){ console.log("assets list done: ", data); } );

//    ouapi.assets.dependents(assetId, site).then( function(data){ console.log("assets dependents done: ", data); } );
//    ouapi.assets.info(site, assetId).then( function(data){ console.log("assets info done: ", data); } );
        
//    ouapi.assets.publish(site, 'a'+assetId+'.html', 'new version').then( function(data){ console.log("assets publish done: ", data); } );
    ouapi.assets.delete(site, assetId).then( function(data){ console.log("assets delete done: ", data); } );
};


//QUnit.test("prettydate basics", function( assert ) {
//    var done = assert.async();
//    ouapi.snippets.add("Test snippet", "../hello", "_test", "I have no description", "main").then(
//        function(){
//            // success
//            ouapi.snippets.list("_test").then(
//                function(snippets){
//                    // list success
//                    snippets[0][0][1]
//                },
//                function(){
//                    // list fail
//                }
//            );
//            done();
//        },
//        function(){
//            // fail
//            done();
//        }
//    );
//    
//    
//    var now = "2008/01/28 22:25:00";
//    assert.equal(prettyDate(now, "2008/01/28 22:24:30"), "just now");
//    assert.equal(prettyDate(now, "2008/01/28 22:23:30"), "1 minute ago");
//    assert.equal(prettyDate(now, "2008/01/28 21:23:30"), "1 hour ago");
//    assert.equal(prettyDate(now, "2008/01/27 22:23:30"), "Yesterday");
//    assert.equal(prettyDate(now, "2008/01/26 22:23:30"), "2 days ago");
//    assert.equal(prettyDate(now, "2007/01/26 22:23:30"), undefined);
//});
//
//function snippetPresent(snippet, groups){
//    
//}