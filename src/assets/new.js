new: function(){}


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