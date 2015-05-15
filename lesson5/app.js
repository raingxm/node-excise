var async = require('async');
var concurrentCount = 0;

var fetchUrl = function(url, callback) {
    var delayTime = parseInt((Math.random()*100000)%2000, 10);
    concurrentCount++;

    console.log("current concurrent num is: " + concurrentCount + ", url is: " + url + " and need to take about " + delayTime + "ms");
    setTimeout(function(){
        concurrentCount--;
        callback(null, "handle url: " + url);
    }, delayTime);
};

var urls = [];
for(var i=0; i<30; i++) {
    urls.push('raingxm.lofter.com:' + i);
}

async.mapLimit(urls, 5, function(item, callback) {
    fetchUrl(item, callback);
}, function(err, results) {
    console.log("err: " + err);
    console.log("final:");
    console.log(results);
});

