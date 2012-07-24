
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , path = require('path')
  , fs = require('fs')
  , url = require('url')
  , routes = require('./routes')
  , db = require('./db');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.register('.html', require('jade'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.all('/*.html', function(req, res, next) {
    //console.log('req.url:'+req.url);
    //console.log(path.extname('req.url:'+req.url));
    var realPath = __dirname + '/public/html' + url.parse(req.url).pathname;
    //console.log('real path:'+realPath);
    if (path.existsSync(realPath)) {
        res.end(fs.readFileSync(realPath));
    } else {
        res.end('404');
    }
});
app.get('/', routes.index);
app.get('/new', routes.new);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
