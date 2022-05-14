var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");

const mimeTypes = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpg",
};

var portName = "localhost";
var port = "8080";

http.createServer((req, res) => {
    var MY_URL = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(MY_URL));
    console.log("File you are looking for is:" + fileName);
    var loadFile;

    try {
        loadFile = fs.lstatSync(fileName);
    } catch (error) {
        res.writeHead(404, {
            "Content-Type": "text/plain",
        });
        res.write("404 Internal Error");
        res.end();
        return;
    }

    if (loadFile.isFile()) {
        var mimeType =
            mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {
            "Content-Type": mimeType,
        });
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (loadFile.isDirectory()) {
        res.writeHead(302, {
            Location: "./html-css/index.html",
        });
        res.end();
    } else {
        res.writeHead(500, {
            "Content-Type": "text/plain",
        });
        res.write("500 Internal Error");
        res.end();
    }
}).listen(port, portName, () => {
    console.log(`Server is running on server http://${portName}:${port}`);
});
