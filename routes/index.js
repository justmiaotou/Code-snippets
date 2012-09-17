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
    , rExceptions = require('./exceptions');

app.all('/*.html', function(req, res, next) {
    var realPath = __dirname + '/public/html' + url.parse(req.url).pathname;
    //console.log('real path:'+realPath);
    if (fs.existsSync(realPath)) {
        res.end(fs.readFileSync(realPath));
    } else {
        rExceptions['404'](res);
    }
});

app.get('/login', rLogin.get);
app.post('/login', rLogin.post);

app.get('/logout', rLogout.get);

app.get('/register', rRegister.get);
app.post('/register', rRegister.post);

app.get('/', rShowSnippets.snippets);
app.get('/snippets', rShowSnippets.snippets);
app.get('/snippets/:id', rShowSnippets.snippets);

app.get('/new-snippet', rUpsertSnippets.new);
app.post('/snippet-upload', rUpsertSnippets.upload);

app.get('/mod-snippet/:id', rUpsertSnippets.modifyGet);
app.post('/mod-snippet', rUpsertSnippets.modifyPost);

app.get('*', function(req, res) {
    rExceptions['404'](res);
});
