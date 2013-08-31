var http = require('http');

var downloadImage = function (id, res) {
    var httpGetOptions = {
            host: 'tbmm.gov.tr',
            port: 80,
            path: '/mv_resim/' + id + '.jpg',
            method: 'GET'
        };

        var req = http.request(httpGetOptions, function (tbmmRes) {
            if(tbmmRes.statusCode !== 200) {
                res.status(404).send();
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
   downloadImage(id, res);
};

exports.getMP = function (req, res) {
    var id = req.params.id || undefined;
    if(id === undefined) {
        res.status(400).send();
        return;
    }

    downloadImage(id, res);
};