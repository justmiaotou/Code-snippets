var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var models = require('../models'),
    url = require('url'),
    M = require('../public/js/common.js'),
    Snippet = models.Snippet;

exports.get = function(req, res) {
    res.render('login', {title:'登录Code Snippet'});
}

exports.post = function(req, res) {
}
