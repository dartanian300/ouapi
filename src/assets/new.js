new: function(){}
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