(function () {
    var express = require('express');
    var api = require('./api');
    var application_root = __dirname;
    var path = require('path');
    var mongoose = require('mongoose');
    var app = express();

    app.configure(function () {
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(application_root + '/public'));
        mongoose.connect('mongodb://localhost/mvph-dev');
    });

    app.get('/random', api.random);
    app.get('/p/:id', api.getMP);

    app.listen(process.env.PORT || 4242);

}).call(this);

