'use strict';

var config = require('../config');

exports.get = function(req, res) {
    res.cookie(config.auth_cookie_name, '', {maxAge:-1});
    res.redirect('/login');
};
