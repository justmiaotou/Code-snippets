var models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    Vote = models.Vote,
    helper = require('./helper'),
    config = require('../config');

exports.get = function(req, res) {
    helper.getPage({
        model: Vote,
        params: M.parseQuery(url.parse(req.url).query),
        done: function(docs, pagination) {
            if (!docs.length) {
                res.render('vote/chicken-page', {
                    title: 'Week Report',
                    html: '还没有人发起过投票哦！来做第一个发起者吧！<a href="/vote/new" class="btn_2">Go>>></a>',
                    user: req.user,
                    showNewBtn: true
                });
            } else {
                res.render('vote/show', { title: 'Vote', reports:docs, user: req.user, pagination: pagination, showNewBtn:true});
            }
        }
    });
};

exports.getNew = function(req, res) {
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    res.render('vote/new', {title: 'Vote', user:req.user, showListBtn:true, showNewBtn:false});
};

exports.postNew = function(req, res) {
};

exports.getMod = function(req, res) {
};

exports.postMod = function(req, res) {
};

exports.getResult = function(req, res) {
};
