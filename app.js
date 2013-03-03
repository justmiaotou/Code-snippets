'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    middleware = require('./middleware'),
    config = require('./config');

var app = module.exports = express();

// Configuration
app.configure(function(){
    //app.set('env', 'production');
    app.set('port', 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.engine('.html', require('jade').__express);
    // 浏览器会请求favicon.ico，这里拦截住可防止多一次用户验证
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    /*app.use(express.session({
        secret: config.session_secret,
    }));*/
    //app.use(express.methodOverride());
    // 下面两句写反了将使静态资源链接引向404页面
    // 但如果不定义后面的404处理app.get('*' ,...})则不会……
    app.use(express.static(path.join(__dirname, '/public')));

    // 日志。不记录静态文件请求。
    //app.use(express.logger());
    // 验证用户
    app.use(middleware.authUser);
    // 500等错误的处理
    app.use(middleware.error);

    app.use(app.router);

});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    // header中添加X-Response-Time字段
    app.use(express.responseTime());
    app.use(express.errorHandler());
});

// Routes
require('./routes');

http.createServer(app).listen(app.get('port'), function() {
    console.log("Snippet It server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
