var fs = require('fs')
var http = require('http')

http.createServer(function(request, response) {
    var newFile = fs.createWriteStream("read_copy.md");
    request.pipe(newFile);
    request.on("end", function() {
        response.end("uploaded!");
    });
}).listen(8080);

console.log("listen on port 8080:")
