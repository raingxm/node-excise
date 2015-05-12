var express = require('express');
var utility = require('utility');

var app = express();

app.get('/', function(request, response) {
    var q = request.query.q;
    var md5Value = utility.md5(q);
    response.send(md5Value);
});

app.listen(3000, function() {
    console.log("listen on port 3000...");
});