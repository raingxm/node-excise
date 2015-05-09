var http = require("http")

http.createServer(function(request, response) {
    response.writeHead(200);
    request.on("readable", function() {
        var chunk = null;
        while(null !== (chunk = request.read())) {
            console.log(chunk.toString());
        }
    });

    request.on("end", function() {
        response.end();
    });
}).listen(8080);

console.log("listen on port 8080:");