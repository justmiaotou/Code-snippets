var models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    Snippet = models.Snippet,
    config = require('../config');

exports.snippets = function(req, res) {
    // 若直接使用req.query，则‘c++’会被默认转换了……
    var params = M.parseQuery(url.parse(req.url).query),
        dbQuery = null,
        codeTypeList = config.getCodeTypeList();
    //console.log(params);
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
            res.render('snippets', { title: 'Code Snippets', snippets:docs, type:dbQuery.type, codeTypeList: codeTypeList, user: req.user});
        } else {
            res.render('chicken-page', {
                title: 'Code Snippets',
                type: dbQuery.type,
                codeTypeList: codeTypeList,
                html: 'You could <a href="/new-snippet" class="btn_2">submit</a> the first piece of code snippet!',
                user: req.user
            });
        }
    });
}
