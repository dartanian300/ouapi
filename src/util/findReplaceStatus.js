findReplaceStatus: function(site, searchId){
    console.log("--findReplaceStatus--");
    var deferred = new $.Deferred();

    var endpoint = gadget.get('apihost') + '/sites/findreplacestatus';
    var params = {
        authorization_token: gadget.get('token'), 

        id: searchId, 
        site: site
    };
    var pingInterval = 2000;
    
    var interval = setInterval(function(){
        $.ajax({
            type: "GET",
            url: endpoint, 
            data: params
        }).then(
            function(statusResponse){
                if (statusResponse.error == true){
                    clearInterval(interval);
                    deferred.reject(statusResponse);
                }
                if (statusResponse.finished == true){
                    clearInterval(interval);
                    deferred.resolve(statusResponse);
                }
            },
            function (resp){
                clearInterval(interval);
                deferred.reject(resp);
            }
        );
    }, pingInterval);
    
    return deferred.promise();
}