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
            var finishedCount = 0;
            for (var i = 0, l = docs.length; i < l; ++i) {
                (function(index) {
                    models.getUserById(docs[index].authorId, function(user) {
                        finishedCount++;
                        docs[index].author = user;
                        // 全部数据获取完毕，则可发送给用户
                        if (finishedCount == docs.length) {
                            res.render('snippets', { title: 'Code Snippets', snippets:docs, type:dbQuery.type, codeTypeList: codeTypeList, user: req.user});
                        }
                    });
                })(i);
            }
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
