var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var models = require('../models'),
    url = require('url'),
    M = require('../public/js/common.js'),
    Snippet = models.Snippet;

// 以函数的方式获得，避免修改造成的互相影响
function getCodeTypeList() {
    return {
        html: 0,
        javascript: 0,
        css: 0,
        java: 0,
        'c++': 0,
        python: 0,
        ruby: 0
    };
}

function render404(res, html) {
    res.render('chicken-page', {
        title: 'Code Snippets',
        html: html || '凡人，404密境不是你该来的地方。',
    });
}

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

exports.loginGet = function(req, res) {
    res.render('login', {title:'登录Code Snippet'});
}
exports.loginPost = function(req, res) {
}

exports.registerGet = function(req, res) {
    res.render('register', {title:'注册Code Snippet'});
}
exports.registerPost = function(req, res) {
}

exports.newSnippet = function(req, res) {
    res.render('edit-snippet', { title: '编辑新代码段', action: 'new', codeTypeList: getCodeTypeList() });
}

exports.snippets = function(req, res) {
    // 若直接使用req.query，则‘c++’会被默认转换了……
    var params = M.parseQuery(url.parse(req.url).query),
        dbQuery = null,
        codeTypeList = getCodeTypeList();
        console.log(params);
    switch(params.type) {
        case 'function':
            dbQuery = {type:2};
            break;
        case 'api':
            dbQuery = {type:3};
            if (params.codetype in codeTypeList) {
                codeTypeList[params.codetype] = true;
                dbQuery.tags = params.codetype;
            }
            break;
        case 'effect':
            dbQuery = {type:1};
            break;
        default:
            dbQuery = {};
    }
    // 只查看特定条目
    if (req.params.id) {
        dbQuery['_id'] = req.params.id;
        delete dbQuery.type;
    }
    Snippet.find(dbQuery, function(err, docs) {
        if (docs && docs.length > 0) {
            res.render('snippets', { title: 'Code Snippets', snippets:docs, type:dbQuery.type, codeTypeList: codeTypeList});
        } else {
            res.render('chicken-page', {
                title: 'Code Snippets',
                type: dbQuery.type,
                codeTypeList: codeTypeList,
                html: 'You could <a href="/new-snippet" class="btn_2">submit</a> the first piece of code snippet!',
            });
        }
    });
}

exports.snippetModifyGet = function(req, res) {
    var dbQuery = {},
        codeTypeList = getCodeTypeList();

    if (req.params.id) {
        dbQuery['_id'] = req.params.id;
        Snippet.find(dbQuery, function(err, docs) {
            if (docs && docs.length > 0) {
                //console.log(docs[0]);
                res.render('edit-snippet', {title: '修改Snippet', action:'mod', snippet:docs[0], codeTypeList: getCodeTypeList()});
            } else {
                render404(res, '我说，你想修改的条目真的存在吗……')
            }
        });
    } else {
        render404(res);
    }
};
exports.snippetModifyPost = function(req, res) {
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

exports.snippetUpload = function(req, res) {
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

exports['404'] = function (req, res) {
   render404(res); 
};
