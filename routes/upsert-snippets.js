var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    Snippet = models.Snippet,
    config = require('../config');

function fillSnippet(body, doc) {
    var snippet = doc || new Snippet();

    var codes = [],
        tags = [],
        codeType = '';
    for (var field in body) {
        switch(field) {
            case 'author':
                snippet.author = body[field];
                break;
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
    res.render('edit-snippet', { title: '编辑新代码段', action: 'new', codeTypeList: config.getCodeTypeList() });
}

exports.modifyGet = function(req, res) {
    var dbQuery = {};

    if (req.params.id) {
        dbQuery['_id'] = req.params.id;
        Snippet.find(dbQuery, function(err, docs) {
            if (docs && docs.length > 0) {
                //console.log(docs[0]);
                res.render('edit-snippet', {title: '修改Snippet', action:'mod', snippet:docs[0], codeTypeList: config.getCodeTypeList()});
            } else {
                render404(res, '我说，你想修改的条目真的存在吗……')
            }
        });
    } else {
        render404(res);
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
            console.log(req.body);
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

    snippet.date = new Date();
    snippet.save(function(err) {
        res.header('Content-type', 'application/json');
        if (err) {
            res.end(JSON.stringify({status: 0, msg:'保存失败，请重试'}));
        } else {
            res.end(JSON.stringify({status: 1}));
        }
    });
}
