var http = require('http')

http.createServer(function(request, response) {
    response.writeHead(200);
    response.write("Hello, she is liu.");
    setTimeout(function() {
        response.write("liu is done");
        response.end();
    }, 5000);
}).listen(8080);

console.log("Listen on port 8080.....")