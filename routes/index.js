'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var app = require('../app'),
    fs = require('fs'),
    models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    Snippet = models.Snippet;

var rLogin = require('./login')
    , rLogout = require('./logout')
    , rRegister = require('./register')
    , rUpsertSnippets = require('./upsert-snippets')
    , rShowSnippets = require('./show-snippets')
    , rUserPage = require('./userpage')
    , rExceptions = require('./exceptions')
    , rWeekReport = require('./weekreport');

app.all('/*.html', function(req, res, next) {
    var realPath = __dirname + '/public/html' + url.parse(req.url).pathname;
    //console.log('real path:'+realPath);
    if (fs.existsSync(realPath)) {
        res.end(fs.readFileSync(realPath));
    } else {
        rExceptions['404'](req, res);
    }
});

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

// 周报处理
app.get('/netease/week-report', rWeekReport.get);
app.get('/netease/week-report/new', rWeekReport.newGet);
app.post('/netease/week-report/new', rWeekReport.newPost);
app.post('/netease/week-report/del/:id', rWeekReport.del);
app.get('/netease/week-report/u/:id', rWeekReport.user);
app.get('/netease/week-report/mod/:id', rWeekReport.modGet);
app.post('/netease/week-report/mod', rWeekReport.modPost);
app.get('/netease/week-report/sum', rWeekReport.sum);

app.get('*', function(req, res) {
    rExceptions['404'](req, res);
});
