
/**
 * Module dependencies.
 */

var express = require('express')
    , mongoose = require('mongoose')
    , path = require('path')
    , fs = require('fs')
    , url = require('url')
    , routes = require('./routes')
    , db = require('./db')
    , config = require('./config');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.register('.html', require('jade'));
    // header中添加X-Response-Time字段
    app.use(express.responseTime());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.session_secret,
    }));
    app.use(express.methodOverride());
    // 下面两句写反了将使静态资源链接引向404页面
    // 但如果不定义后面的404处理app.get('*' ,...})则不会……
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.all('/*.html', function(req, res, next) {
    var realPath = __dirname + '/public/html' + url.parse(req.url).pathname;
    //console.log('real path:'+realPath);
    if (fs.existsSync(realPath)) {
        res.end(fs.readFileSync(realPath));
    } else {
        res.end('404');
    }
});
app.get('/', routes.snippets);
app.get('/snippets', routes.snippets);
app.get('/snippets/:id', routes.snippets);

app.get('/new-snippet', routes.newSnippet);
app.post('/snippet-upload', routes.snippetUpload);

app.get('/mod-snippet/:id', routes.snippetModifyGet);
app.post('/mod-snippet', routes.snippetModifyPost);

app.get('*', routes['404']);

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
