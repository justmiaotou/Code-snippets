var models = require('../models'),
    url = require('url'),
    M = require('../util'),
    config = require('../config'),
    User = models.User;

exports.get = function(req, res) {
    res.render('register', {title:'注册Code Snippet'});
}

exports.post = function(req, res) {
    var errors = {
            'UN_EXIST': { type: 1, msg: '用户名已存在' },
            'EMAIL_EXIST': { type: 2, msg: '所用邮箱已在本站注册' },
            'UNKNOW': { type: 9, msg: '发生未知错误，请稍后重试' }
        },
        suc = {type:0, msg: '注册成功'};

    var isUnExist = false,
        isEmailExist = false;
    res.header('Content-Type', 'application/json');
    User.find({username: req.body.username}, function(err, docs) {
        if (docs.length > 0) {
            res.end(JSON.stringify(errors.UN_EXIST));
        } else {
            User.find({email: req.body.email}, function(err, docs) {
                if (docs.length > 0) {
                    res.end(JSON.stringify(errors.EMAIL_EXIST));
                } else {
                    var newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: M.md5WithSalt(req.body.password, config.auth_secret)
                    });
                    newUser.save(function(err) {
                        if (err) {
                            res.end(JSON.stringify(errors.UNKNOW));
                        } else {
                            res.end(JSON.stringify(suc));
                        }
                    });
                }
            });
        }
    });
}
