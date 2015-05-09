var fs = require("fs");
var http = require("http");

http.createServer(function(request, response) {
    var newFile = fs.createWriteStream("uploadfile");
    var uploadedBytes = 0;
    var fileBytes = request.headers["content-length"];
    request.on("readable", function() {
        var chunk = null;
        while(null !== (chunk = request.read())) {
            uploadedBytes += chunk.length;
            var progress = (uploadedBytes / fileBytes) * 100;
            response.write("progress: " + parseInt(progress, 10) + "%\n");
        }
    });
    request.pipe(newFile);

    request.on("end", function() {
        response.end();
    });
}).listen(8080);

console.log("listen on port 8080:");