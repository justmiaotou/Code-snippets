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
        proxyAssign: ['userLoadedFinished'],
        onDocsReady: function(err, docs, proxy) {
            if (docs && docs.length > 0) {
                proxy.after('userLoaded', docs.length, function() {
                    proxy.emit('userLoadedFinished');
                });
                for (var i = 0, l = docs.length; i < l; ++i) {
                    (function(index) {
                        // 从缓冲池中获取用户对象
                        models.getUserById(docs[index].authorId, function(user) {
                            docs[index].author = user;
                            proxy.emit('userLoaded');
                        });
                    })(i);
                }
            } else {
                res.render('vote/chicken-page', {
                    title: 'Week Report',
                    html: '还没有人发起过投票哦！来做第一个发起者吧！<a href="/vote/new" class="btn_2">Go>>></a>',
                    user: req.user,
                    showNewBtn: true,
                    showListBtn: true
                });
            }
        },
        done: function(docs, pagination) {
            res.render('vote/show', {
                title: 'Vote',
                votes: docs,
                user: req.user,
                pagination: pagination,
                showNewBtn: true
            });
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
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    var body = req.body,
        vote = new Vote(),
        updateResult;

    res.header('Content-type', 'application/json');

    updateResult = updateVote(vote, body);

    if (updateResult !== true) {
        sendJSONResult(res, updateResult.type, updateResult.msg);
        return;
    }

    vote.authorId = req.user._id;

    vote.date = Date.now();

    vote.save(function(err) {
        if (err) {
            res.end(JSON.stringify({status: 0, msg:'保存失败，请重试'}));
        } else {
            res.end(JSON.stringify({type: 200, msg: '保存成功~””\\\\(￣ー￣) (￣ー￣)//””[鼓掌] '}));
        }
    });
};

exports.getVote = function(req, res) {
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    Vote.findById(req.params.id, function(err, doc) {
        if (doc) {
            var voters = doc.voters,
                uid = req.user._id,
                hasVoted = false,
                currentTime = Date.now(),
                // 由于时间是从零时开始算起，故最后一天要加1
                toTime = doc.toDate.setDate(doc.toDate.getDate() + 1),
                // 投票状态，-1为未开始，0为进行中，1为已过期
                state = 0;
            for (var i = 0, l = voters.length; i < l; i++) {
                if (voters[i] == uid) {
                    hasVoted = true;
                    break;
                }
            }
            if (doc.fromDate.getTime() > currentTime) {
                state = -1;
                hasVoted = true;
            }  else if (toTime < currentTime) {
                hasVoted = true;
                state = 1;
            }
            // 从缓冲池中获取用户对象
            models.getUserById(doc.authorId, function(user) {
                doc.author = user;
                if (hasVoted) {
                    doc.opts.forEach(function(opt, index) {
                        opt.voters.forEach(function(voterId) {
                            if (voterId == uid) {
                                // 标记该选项为用户投票选项
                                opt.hasVoted = true;
                            }
                        });
                    });
                    // 已投票，显示结果
                    res.render('vote/show', { title: doc.title, votes:[doc], user: req.user, showResult: true, showNewBtn:true, showListBtn:true, state:state });
                } else {
                    // 未投票，显示投票界面
                    res.render('vote/show', { title: doc.title, votes:[doc], user: req.user, singleVote: true, showNewBtn:true, showListBtn:true });
                }
            });
        } else {
            res.render('vote/chicken-page', {
                title: 'Vote',
                html: '木有找到请求的投票，要不你来发起一个？<a href="/vote/new">>>Go!</a>',
                user: req.user,
                showNewBtn: true,
                showListBtn: true
            });
        }
    });
};

exports.postVote = function(req, res) {
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    var body = req.body,
        selected = body.opt;

    Vote.findById(body['vote-id'], function(err, doc) {
        var voters = doc.voters,
            uid = req.user._id,
            hasVoted = false;

        if (doc) {
            for (var i = 0, l = voters.length; i < l; i++) {
                if (voters[i] == uid) {
                    hasVoted = true;
                    break;
                }
            }
            // 从缓冲池中获取用户对象
            models.getUserById(doc.authorId, function(user) {
                doc.author = user;
                if (hasVoted) {
                    sendJSONResult(res, 403, '您已经在这里投过票啦！');
                } else {
                    if (/^\d+$/.test(selected)) {
                        if (+selected > doc.opts.length) {
                            sendJSONResult(res, 403, '选项有误，请重选！');
                            return;
                        }

                        doc.opts[selected].voters.push(uid);
                        doc.opts[selected].count++;
                    } else if (doc.type != 1 && Array.isArray(selected)) {
                        for (var i = 0, l = selected.length; i < l; ++i) {
                            if (+selected[i] > doc.opts.length) {
                                sendJSONResult(res, 403, '选项有误，请重选！');
                                return;
                            }

                            doc.opts[selected[i]].voters.push(uid);
                            doc.opts[selected[i]].count++;
                        };
                    } else {
                        sendJSONResult(res, 403, '选项出错了，请重试~');
                        return;
                    }

                    doc.voters.push(uid);

                    doc.save(function(err) {
                        if (err) {
                            sendJSONResult(res, 500, '保存失败，请重试！');
                        } else {
                            sendJSONResult(res, 200, '投票成功！');
                        }
                    });
                }
            });
        } else {
            res.render('vote/chicken-page', {
                title: 'Vote',
                html: '出错了！回到<a href="/vote">投票首页</a>',
                user: req.user,
                showNewBtn: true,
                showListBtn: true
            });
        }
    });
};

exports.getMod = function(req, res) {
};

exports.postMod = function(req, res) {
};

function updateVote(vote, body) {
    var opts = [];
    if (!('selecttype' in body)) {
        return {
            type: 403,
            msg: '请选择您的投票类型为单选或多选'
        };
    }
    for (var name in body) {
        value = body[name];
        switch(name) {
            case 'title':
                if (value.length > 100) {
                    return {
                        type: 403,
                        msg: '标题不能超过100个字符！'
                    };
                }
                vote.title = value;
                break;
            case 'description':
                vote[name] = value;
                break;
            case 'fromDate':
            case 'toDate':
                var today = new Date(),
                    targetDay = new Date(value + ' 0:0:0');
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                if (targetDay.getDate() == NaN || today.getTime() > targetDay.getTime()) {
                    return {
                        type: 403,
                        msg: '时间有误，请重新输入！'
                    };
                }

                vote[name] = targetDay.getTime();
                break;
            case 'selecttype':
                switch(value) {
                    case 'single':
                        vote.type = 1;
                        break;
                    case 'multi':
                        vote.type = 2;
                        break;
                    default:
                        return {
                            type: 403,
                            msg: '请选择类型！'
                        };
                }
                break;
            case 'tag':
                    vote.tags = value.split(/,|;|，|；/);
                break;
            default:
                if (/^opt-\d+$/.test(name)) {
                    opts.push({
                        description: value,
                        voters: [],
                        count: 0
                    });
                }
        }
    }

    if (vote.toDate < vote.fromDate) {
        return {
            type: 403,
            msg: '结束日期不能在开始日期之前！'
        };
    }

    if (opts.length < 2) {
        return {
            type: 403,
            msg: '至少需要2个选项！'
        };
    }

    if (body.selecttype == 'multi') {
        vote.minToSelect = /^\d+$/.test(body.minselected) ? body.minselected : 1;
        vote.maxToSelect = /^\d+$/.test(body.maxselected) && body.maxselected < opts.length ? body.maxselected : opts.length;

        if (vote.minToSelect > vote.maxToSelect) {
            return {
                type: 403,
                msg: '最多可选个数不能大于最少可选个数！'
            };
        }
    }

    vote.opts = opts;

    return true;
}

function sendJSONResult(res, code, msg) {
    res.end(JSON.stringify({
        type: code,
        msg: msg
    }));
}
