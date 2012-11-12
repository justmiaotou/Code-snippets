'use strict';

var models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    Snippet = models.Snippet,
    helper = require('./helper'),
    config = require('../config');

exports.get = function(req, res) {
    var uid = req.params.id,
        owner = null;
    models.getUserById(uid, function(owner) {
        helper.getPage({
            model: Snippet,
            params: M.parseQuery(url.parse(req.url).query),
            query: {
                authorId: uid
            },
            done: function(docs, pagination) {
                if (docs && docs.length > 0) {
                    for (var i in docs) {
                        docs[i].author = owner;
                    }
                    res.render('snippets', { title: 'Code Snippets', snippets:docs, user: req.user, pagination: pagination});
                } else {
                    res.render('chicken-page', {
                        title: 'Code Snippets',
                        html: 'Shit！这个用户一条snippet都没有发布！！',
                        user: req.user
                    });
                }
            }
        });
    }, function() {
        res.render('chicken-page', {
            title: '用户失踪了？？',
            html: '你查找的用户失踪了……！！',
            user: req.user
        });
    });
};
