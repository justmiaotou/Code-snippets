var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var models = require('../models'),
    url = require('url'),
    M = require('../util'),
    config = require('../config'),
    User = models.User;

exports.get = function(req, res) {
    res.render('login', {title:'登录Code Snippet'});
}

exports.post = function(req, res) {
    User.find({$or : [{ username: req.body.login_field}, { email: req.body.login_field }]}, function(err, docs) {
        console.log(docs);
        if (docs.length == 1) {
            if (M.md5WithSalt(req.body.password, config.auth_secret) == docs[0]['password']) {
                res.cookie('SESSION_ID', M.encryptSessionId(docs[0]['password']), { maxAge: 900000 });
                res.redirect('/');
            } else {
                res.redirect('/login?error=pw');
            }
        } else {
            res.redirect('/login?error=un');
        }
    });
}
