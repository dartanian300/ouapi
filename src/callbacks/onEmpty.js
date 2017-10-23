// runs when queue is empty
onEmpty: function(callback){
    console.log("\n **** ON EMPTY CALLS **** \n");
    $(this).on("ouapi.empty", function(e){
        callback && callback();
    });
}