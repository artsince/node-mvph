module.exports = function () {
    'use strict';

    var http = require('http');
    var fs = require('fs');
    var mongoose = require('mongoose');
    var Member = require('./models/Member')(mongoose);

    var MAX_MV = 6972;

    var _sendDefaultImage = function (res) {
        var filePath = './public/img/tbmm.jpg';
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
                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg',
                        'Content-Length': imgBuffer.length
                    });
                    res.end(imgBuffer);

                    fs.close(fd);
                });
            });
        });
    };

    var _downloadImage = function (id, res) {
        var httpGetOptions = {
                host: 'tbmm.gov.tr',
                port: 80,
                path: '/mv_resim/' + id + '.jpg',
                method: 'GET'
            };

            var req = http.request(httpGetOptions, function (tbmmRes) {
                if(tbmmRes.statusCode !== 200) {
                    _sendDefaultImage(res);
                    
                    if(tbmmRes.statusCode === 404) {
                        Member.addMemberWithoutPhoto(id);
                    }

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
                    res.writeHead(200, {
                        'Content-Type': tbmmResContentType,
                        'Content-Length': imgBuffer.length
                    });
                    res.end(imgBuffer);

                    Member.addMemberWithPhoto(id, imgBuffer);
                });
            });

            req.on('error', function (err) {
                console.log(err);
                res.status(500).send();
                return;
            });

        req.end();
    };

    var _random = function (req, res) {
       var id = 1 + Math.floor(Math.random() * (MAX_MV - 1));

       Member.retrievePhoto(id, function (err, status, img) {
            if(err) {
                res.status(500).send();
                return;
            }

            switch(status) {
                case Member.Status.NotFound:
                    _downloadImage(id, res);
                    break;
                case Member.Status.MissingPhoto:
                    _random(req, res); // recursive!
                    break;
                case Member.Status.NoProblem:
                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg',
                        'Content-Length': img.length
                    });
                    res.end(img);
                    break;
            }
        });
    };

    var _getMP = function (req, res) {
        var id = req.params.id || undefined;
        if(id === undefined) {
            res.status(400).send();
            return;
        }

        if(id < 1 || id > MAX_MV) {
            res.status(400).send();
            return;
        }

        Member.retrievePhoto(id, function (err, status, img) {
            if(err) {
                res.status(500).send();
                return;
            }

            switch(status) {
                case Member.Status.NotFound:
                    _downloadImage(id, res);
                    break;
                case Member.Status.MissingPhoto:
                    res.status(404).send();
                    break;
                case Member.Status.NoProblem:
                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg',
                        'Content-Length': img.length
                    });
                    res.end(img);
                    break;
            }
        });
    };

    return {
        random: _random,
        getMP: _getMP
    };
}();

