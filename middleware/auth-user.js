'use strict';

var config = require('../config'),
    M = require('../util'),
    models = require('../models');

exports.auth = function (req, res, next) {
    // console.log(req.url);
    if (req.cookies[config.auth_cookie_name]) {
        var authInfos = M.decryptSessionId(req.cookies[config.auth_cookie_name]).split('\t');
        if (authInfos.length == 4) {
            models.getUserById(authInfos[3], function(user) {
                if (authInfos[2] == user.password) {
                    req.user = user;
                }
                next();
            }, function() {
                next();
            });
        } else {
            next();
        }
    } else {
        next();
    }
};
