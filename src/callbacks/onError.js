// runs when a request is not successful
onError: function(callback){
    console.log("\n **** ON ERROR CALLS **** \n");
    $(this).on("ouapi.error", function(e, data){
        callback && callback(data);
    });
}