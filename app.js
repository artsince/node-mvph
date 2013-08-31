var express = require('express');
var api = require('./api');
var app = express();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.get('/random', api.random);

app.listen(process.env.PORT || 4242);

module.exports = app;