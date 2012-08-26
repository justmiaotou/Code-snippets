var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var models = require('../models'),
    url = require('url'),
    M = require('../public/js/common.js'),
    Snippet = models.Snippet;

// 以函数的方式获得，避免共用一份导致的互相影响
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

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.newSnippet = function(req, res) {
    res.render('new-snippets', { title: '编辑新代码段', type: 0, codeTypeList: getCodeTypeList() });
}

exports.snippets = function(req, res) {
    var params = M.parseQuery(url.parse(req.url).query),
        dbQuery = null,
        codeTypeList = getCodeTypeList();
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
        default:
            dbQuery = {type:1};
    }
    // 
    if (params.snippetid) {
        dbQuery['_id'] = params.snippetid;
        delete dbQuery.type;
    }
    Snippet.find(dbQuery, function(err, docs) {
        if (docs.length > 0) {
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
    var params = M.parseQuery(url.parse(req.url).query),
        dbQuery = {},
        codeTypeList = getCodeTypeList();

    if (params.snippetid) {
        dbQuery['_id'] = params.snippetid;
        Snippet.find(dbQuery, function(err, docs) {
            if (docs.length > 0) {
                console.log(docs[0]);
                res.render('mod-snippet', {title: '修改Snippet', codeTypeList: getCodeTypeList(), snippet:docs[0]});
            } else {
                render404(res, '我说，你想修改的条目真的存在吗……')
            }
        });
    } else {
        render404(res);
    }
};
exports.snippetModifyPost = function(req, res) {

};

exports.snippetUpload = function(req, res) {
    var body = req.body;
    var snippet = new Snippet();

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
            case 'showEffect':
                snippet.hasEffectBtn = body[field];
                break;
            case 'effectBtnId':
                snippet.effectBtnId = body[field];
                break;
            default:
                if (/.*code/.test(field)) {
                    codeType = field.split('-')[0];
                    codes.push({
                        type: codeType,
                        code: body[field]
                    });
                    if (body.type == 3) tags.push(codeType);
                }
        }
    }
    snippet.date = new Date();
    snippet.codes = codes;
    M.modArrItem(tags, function(arr, index) {
        arr[index] = arr[index].trim();
    });
    snippet.tags = tags;
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
