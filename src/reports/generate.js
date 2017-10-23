generate: function(){
    stats.requestsQueued = queue.length;
    stats.requestsMade = stats.requestsQueued + stats.requestsFinished + stats.requestsPending;
    return stats;
}