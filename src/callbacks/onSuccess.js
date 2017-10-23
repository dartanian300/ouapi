// runs when a request is successful
onSuccess: function(callback){
    console.log("\n **** ON SUCCESS CALLS **** \n");
    $(this).on("ouapi.success", function(e, data){
        callback && callback(data);
    });
}