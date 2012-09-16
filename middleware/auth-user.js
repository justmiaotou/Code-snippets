var config = require('../config'),
    M = require('../util'),
    models = require('../models');

// TODO 建立对象池进行缓存
exports.auth = function (req, res, next) {
    if (req.cookies[config.auth_cookie_name]) {
        var authInfos = M.decryptSessionId(req.cookies[config.auth_cookie_name]).split('\t');
        authInfos.length == 4 && models.getUser(authInfos[0], authInfos[2], function(user) {
            console.log('auth user:');
            console.log(user);
            req.user = user;
        });
    }
    next();
};
