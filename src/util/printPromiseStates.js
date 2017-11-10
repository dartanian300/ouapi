printPromiseStates: function(){
    var states = "";
    $.each(promises, function(i, prom){
        states += prom.state()+", ";
    });
    console.log("ouapi promise states: "+ states);
}