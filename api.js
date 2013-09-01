var http = require('http');
var fs = require('fs');

var sendDefaultImage = function (res) {
    var filePath = './public/img/no-img.jpg';
    fs.stat(filePath, function (err, stats) {
        if(err) {
            res.status(500).send();
            return;
        }

        fs.open(filePath, "r", function (err, fd) {
            if(err) {
                res.status(500).send();
                return;
            }

            var imgBuffer = new Buffer(stats.size);

            fs.read(fd, imgBuffer, 0, imgBuffer.length, null, function (err, bytesRead, imgBuffer) {
                res.contentType = 'image/jpeg';
                res.send(imgBuffer);

                fs.close(fd);
            });
        });
    });
};

var downloadImage = function (id, res) {
    var httpGetOptions = {
            host: 'tbmm.gov.tr',
            port: 80,
            path: '/mv_resim/' + id + '.jpg',
            method: 'GET'
        };

        var req = http.request(httpGetOptions, function (tbmmRes) {
            if(tbmmRes.statusCode !== 200) {
                sendDefaultImage(res);
                return;
            }

            var offset = 0;
            var tbmmResLen = parseInt(tbmmRes.headers['content-length']);
            var tbmmResContentType = tbmmRes.headers['content-type'];
            var imgBuffer = new Buffer(tbmmResLen);

            tbmmRes.setEncoding('binary');

            tbmmRes.on('data', function (chunk) {
                imgBuffer.write(chunk, offset, 'binary');
                offset += chunk.length;
            });

            tbmmRes.on('end', function () {
                res.contentType = tbmmResContentType;
                res.send(imgBuffer);
            });
        });

        req.on('error', function (err) {
            console.log(err);
            res.status(500).send();
            return;
        });

    req.end();
};

exports.random = function (req, res) {
   var id = 1 + Math.floor(Math.random() * 6000);
   downloadImage(id, res, true);
};

exports.getMP = function (req, res) {
    var id = req.params.id || undefined;
    if(id === undefined) {
        res.status(400).send();
        return;
    }

    downloadImage(id, res);
};