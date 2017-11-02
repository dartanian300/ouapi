// I NEED TO LOOK AT THIS MORE - NOT DONE

// TODO: test this
// TODO: figure out payload (file)
// asset Id is also the same as the dependency tag (only numbers)
add_image: function(site, assetId, image, thumb_width, thumb_height, deferred) {
    console.log("--assetAddImage--");
    if (typeof thumb_width == 'undefined') thumb_width = 100;
    if (typeof thumb_height == 'undefined') thumb_height = 100;

    var form = new FormData();
    var file = new File([fileContents], filename, {type: "image/jpeg"});
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