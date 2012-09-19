
/**
 * Module dependencies.
 */

var express = require('express')
    , mongoose = require('mongoose')
    , path = require('path')
    , fs = require('fs')
    , url = require('url')
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
    app.use(express.static(__dirname + '/public'));

    // 验证用户
    app.use(require('./middleware').authUser);

    app.use(app.router);

});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
require('./routes');

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
