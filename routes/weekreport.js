var models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    WeekReport = models.WeekReport,
    config = require('../config');

exports.get = function(req, res) {
    WeekReport.find({}, function(err, docs) {
        console.log(docs);
        if (docs && docs.length > 0) {
            var finishedCount = 0;
            for (var i = 0, l = docs.length; i < l; ++i) {
                (function(index) {
                    // 从缓冲池中获取用户对象
                    models.getUserById(docs[index].authorId, function(user) {
                        finishedCount++;
                        docs[index].author = user;
                        // 全部数据获取完毕，则可发送给用户
                        if (finishedCount == docs.length) {
                            res.render('week-report/index', { title: 'Week Report', reports:docs, user: req.user});
                        }
                    });
                })(i);
            }
        } else {
            res.render('week-report/chicken-page', {
                title: 'Week Report',
                html: '还木有人提交！你可以<a href="/netease/week-report/new" class="btn_2">提交</a>第一份报告哦亲~',
                user: req.user
            });
        }
    });
};

exports.newGet = function(req, res) {
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    res.render('week-report/edit', {title: 'Week Report', user:req.user, action:'new', showReportsBtn: true});
};
exports.newPost = function(req, res) {
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    var body = req.body,
        report = new WeekReport();
    report.lastWeek = body['last-week'];
    report.thisWeek = body['this-week'];
    report.authorId = req.user._id;
    report.date = new Date();
    report.save(function(err) {
        res.header('Content-type', 'application/json');
        if (err) {
            res.end(JSON.stringify({status: 0, msg:'保存失败，请重试'}));
        } else {
            res.end(JSON.stringify({status: 1}));
        }
    });
};

exports.user = function(req, res) {
    var uid = req.params.id;
    models.getUserById(uid, function(owner) {
        WeekReport.find({
            authorId: uid
        }, function(err, docs) {
            if (docs && docs.length > 0) {
                for (var i in docs) {
                    docs[i].author = owner;
                }
                res.render('week-report/index', { title: 'Week Report', reports:docs, user: req.user, showReportsBtn: true});
            } else {
                res.render('week-report/chicken-page', {
                    title: 'Code Snippets',
                    html: 'Shit！这个用户一份周报都没有发布！！',
                    user: req.user,
                    showReportsBtn: true
                });
            }
        });
    }, function() {
        res.render('week-report/chicken-page', {
            title: '用户失踪了？？',
            html: '你查找的用户失踪了……！！',
            user: req.user
        });
    });
};

exports.del = function(req, res) {
    if (!req.user) {
        res.end(JSON.stringify({status: 0, msg: '请先登录'}));
        return;
    }
    if (req.params.id) {
        WeekReport.findById(req.params.id, function(err, doc) {
            if (err) {
                return;
            }
            doc.remove(function(err, product) {
                if (err) {
                    res.end(JSON.stringify({status: 0, msg:'删除失败，请重试'}));
                } else {
                    res.end(JSON.stringify({status:1}));
                }
            });
        });
    }
};

exports.modGet = function(req, res) {
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    WeekReport.findById(req.params.id, function(err, doc) {
        if (!doc) {
            return;
        }
        res.render('week-report/edit', {title: 'Week Report', report:doc, user:req.user, action:'mod', showReportsBtn: true});
    });
};
exports.modPost = function(req, res) {
    WeekReport.findById(req.body.reportid, function(err, doc) {
        if (!err) {
            doc.lastUpdateDate = new Date();
            doc.lastWeek = req.body['last-week'];
            doc.thisWeek = req.body['this-week'];

            doc.save(function(err) {
                res.header('Content-type', 'application/json');
                if (err) {
                    res.end(JSON.stringify({status: 0, msg:'保存失败，请重试'}));
                } else {
                    res.end(JSON.stringify({status: 1}));
                }
            });
        }
    });
};

exports.sum = function(req, res) {
    var today = new Date(),
        from = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0 , 0, 0).getTime(),
        to = new Date(from).setDate(today.getDate() + 1);
    WeekReport.find({date: { $gt: from, $lt: to }}, function(err, docs) {
        if (docs && docs.length > 0) {
            var str = '';
            var finishedCount = 0;
            for (var i = 0, l = docs.length; i < l; ++i) {
                (function(index) {
                    // 从缓冲池中获取用户对象
                    models.getUserById(docs[index].authorId, function(user) {
                        finishedCount++;
                        docs[index].author = user;
                        // 全部数据获取完毕，则可发送给用户
                        if (finishedCount == docs.length) {
                            res.render('week-report/summary', { title: 'Week Report', reports:docs, user: req.user, showReportsBtn: true});
                        }
                    });
                })(i);
            }
        } else {
            res.render('week-report/chicken-page', {
                title: 'oh shit……',
                html: '今天一份报告都木有啊亲，<a href="/netease/week-report/new">提交</a>一个呗~',
                user: req.user
            });
        }
    });
};
