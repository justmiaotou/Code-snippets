var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    Snippet = models.Snippet,
    render404 = require('./exceptions')['404'],
    //DelSnippet =  models.Snippet,
    config = require('../config');

function fillSnippet(body, doc) {
    var snippet = doc || new Snippet();

    var codes = [],
        tags = [],
        codeType = '';
    for (var field in body) {
        switch(field) {
            /*case 'author':
                snippet.author = body[field];
                break;*/
            case 'description':
                snippet.desc = body[field];
                break;
            case 'title':
                snippet.title = body[field];
                break;
            case 'type':
                snippet.type = body[field];
                break;
            case 'tags':
                tags = tags.concat(body.tags.split(','));
                break;
            case 'hasEffectBtn':
                snippet.hasEffectBtn = body[field];
                break;
            case 'effectBtnId':
                snippet.effectBtnId = body[field];
                break;
            case 'lastUpdateDate':
                snippet.lastUpdateDate = body[field];
            default:
                if (/.*code/.test(field)) {
                    codeType = field.split('-')[0];
                    codes.push({
                        type: codeType,
                        code: body[field]
                    });
                    if (body.type == 3) {
                        if (M.modArrItem(tags, function(tag) {
                            if (tag == codeType) return false;
                        })) {
                            tags.push(codeType);
                        }
                    }
                }
        }
    }
    //snippet.date = new Date(); // 第一次提交日期手动设置
    snippet.codes = codes;
    M.modArrItem(tags, function(tag, index, arr) {
        arr[index] = tag.trim();
    });
    snippet.tags = tags;

    return snippet;
}

exports.new= function(req, res) {
    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    res.render('edit-snippet', { title: '编辑新代码段', action: 'new', codeTypeList: config.getCodeTypeList(), user: req.user });
}

exports.modifyGet = function(req, res) {
    if (!req.user) {
        res.redirect('/login?redirect=' + req.url);
        return;
    }

    var dbQuery = {};

    if (req.params.id) {
        dbQuery['_id'] = req.params.id;
        Snippet.find(dbQuery, function(err, docs) {
            if (docs && docs.length > 0) {
                //console.log(docs[0]);
                if (docs[0].authorId == req.user._id) {
                    res.render('edit-snippet', {title: '修改Snippet', action:'mod', snippet:docs[0], codeTypeList: config.getCodeTypeList(), user:req.user});
                } else {
                    res.render('warning', { title: '', html: '你只能修改你自己的条目啊', user:req.user});
                }
            } else {
                render404(req, res, '我说，你想修改的条目真的存在吗……');
            }
        });
    } else {
        render404(req, res);
    }
};
exports.modifyPost = function(req, res) {
    Snippet.findById(req.body.snippetid, function(err, doc) {
        if (!err) {
            req.body.lastUpdateDate = new Date();
            if (!req.body.hasEffectBtn) {
                req.body.hasEffectBtn = false;
                req.body.effectBtnId = '';
            }
            //console.log(req.body);
            fillSnippet(req.body, doc);
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

exports.upload = function(req, res) {
    var body = req.body,
        snippet = fillSnippet(body);

    if (!req.user) {
        res.redirect('/login?error=not_login&redirect='+req.url);
        return;
    }

    snippet.authorId = req.user._id;
    snippet.date = new Date();
    snippet.save(function(err) {
        res.header('Content-type', 'application/json');
        if (err) {
            res.end(JSON.stringify({status: 0, msg:'保存失败，请重试'}));
        } else {
            res.end(JSON.stringify({status: 1}));
        }
    });
};

exports.del = function(req, res) {
    if (!req.user) {
        res.end(JSON.stringify({status: 0, msg: '请先登录'}));
        return;
    }
    if (req.params.id) {
        Snippet.findById(req.params.id, function(err, doc) {
            if (err) {
                render404(req, res);
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
    } else {
        render404(req, res);
    }
};
