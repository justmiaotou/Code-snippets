'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var app = require('../app'),
    fs = require('fs'),
    models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    config = require('../config'),
    Snippet = models.Snippet;

var rLogin = require('./login'),
    rLogout = require('./logout'),
    rRegister = require('./register'),
    rUpsertSnippets = require('./upsert-snippets'),
    rShowSnippets = require('./show-snippets'),
    rUserPage = require('./userpage'),
    rExceptions = require('./exceptions'),
    Combo = require('../submod/combo');

app.get('/*.html', function(req, res, next) {
    var realPath = __dirname + '/public/html' + url.parse(req.url).pathname;
    //console.log('real path:'+realPath);
    if (fs.existsSync(realPath)) {
        res.end(fs.readFileSync(realPath));
    } else {
        rExceptions['404'](req, res);
    }
});

// 统一处理异常
process.on('uncaughtException', function(err) {
    console.error(err);
    if (err.res) {
        err.res.status(err.code);
        err.res.render('chicken-page', {
            title: 'Code Snippets',
            html: '<h3>Error:' + err.code + '</h3><p>' + err.msg + '</p>'
        });
    }
});

app.get('/combo', (new Combo(config.combo)).handler);

app.get('/login', rLogin.get);
app.post('/login', rLogin.post);

app.get('/logout', rLogout.get);

app.get('/register', rRegister.get);
app.post('/register', rRegister.post);

app.get('/', rShowSnippets.snippets);
app.get('/s/new', rUpsertSnippets.new);
app.post('/s/upload', rUpsertSnippets.upload);

app.get('/s/:id', rShowSnippets.snippet);

app.get('/s/mod/:id', rUpsertSnippets.modifyGet);
app.post('/s/mod', rUpsertSnippets.modifyPost);

app.post('/s/del/:id', rUpsertSnippets.del);

app.get('/u/:id', rUserPage.get);

app.get('*', function(req, res) {
    rExceptions['404'](req, res);
});
