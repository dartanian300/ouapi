// runs when a request completes (success or fail)
onComplete: function(callback){
    console.log("\n **** ON COMPLETE CALLS **** \n");
    $(this).on("ouapi.complete", function(e, data){
        callback && callback(data);
    });
}