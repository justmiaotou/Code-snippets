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
    models.getUser(req.body.login_field, M.md5WithSalt(req.body.password, config.auth_secret), function(user) {
        genSession(res, user, { maxAge: 1000*60*60*24*7 });
        res.redirect('/');
    }, function(errorType) {
        switch(errorType) {
            case 'pw_error':
                res.redirect('/login?error=pw');
                break;
            case 'un_error':
                res.redirect('/login?error=un');
                break;
        }
    });
}

function genSession(res, user, option) {
    var authToken = M.encryptSessionId(user.username + '\t' + user.email + '\t' + user.password + '\t' + user._id);
    res.cookie(config.auth_cookie_name, authToken, option);
}
