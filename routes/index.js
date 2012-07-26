var models = require('../models'),
    url = require('url'),
    Snippet = models.Snippet;

/**
 * @description 对数组的指定连续部分进行修改
 */
function modArrItem(arr, callback, from, to) {
    !from && (from=0);
    !to && (to=arr.length);
    for (;from < to; from++) callback(arr, from);
}
function queryParse(query) {
    var arr = query ? query.split('&') : [],
        tmp = null,
        o = {};
    for (var i = 0, l = arr.length; i < l; ++i) {
        tmp = arr[i].split('=');
        o[tmp[0]] = tmp[1];
    }
    return o;
}
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.newSnippet = function(req, res) {
    res.render('new-snippets', { title: '编辑新代码段' });
}

exports.snippets = function(req, res) {
    var params = queryParse(url.parse(req.url).query),
        dbQuery = null;
    switch(params.type) {
        case 'function':
            dbQuery = {type:2};
            break;
        case 'api':
            dbQuery = {type:3};
            break;
        default:
            dbQuery = {type:1};
    }
    Snippet.find(dbQuery, function(err, docs) {
        console.log(docs);
        res.render('snippets', { title: 'Code Snippets', snippets:docs});
    });
}

exports.snippetUpload = function(req, res) {
    console.log(req.body);
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
    modArrItem(tags, function(arr, index) {
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
