// tags can be an array
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
newForm: function(name, site, description, formContents, emails, group, readGroup, tags, lockToSite, extra, deferred) {
    console.log("--newFormAsset--");
    if (typeof formContents == 'undefined' || formContents == '') formContents = '[]';
    if (typeof emails == 'undefined' || emails == '') emails = '[]';
    if (typeof group == 'undefined') group = 'Everyone';
    if (typeof readGroup == 'undefined') readGroup = 'Everyone';
    if (typeof lockToSite == 'undefined') lockToSite = true;

    if (typeof extra == 'undefined')
        extra = {
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