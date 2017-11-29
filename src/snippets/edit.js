edit: function(name, path, site, description, category, newName, newPath, newDescription, newCategory, deferred) {
    console.log("--editSnippet--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/snippets/editsnippet';
    var params = {
        authorization_token: gadget.get('token'), 

        snippet: name,
        path: path,
        site: site,
        description: description,
        category: category,
        selected: false
    };
    
    if (typeof newName != 'undefined' && newName != name)
        params.name = newName;
    else
        params.name = name;
    if (typeof newPath != 'undefined' && newPath != path)
        params.path = newPath;
    if (typeof newDescription != 'undefined' && newDescription != description)
        params.description = newDescription;
    if (typeof newCategory != 'undefined' && newCategory != category){
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
