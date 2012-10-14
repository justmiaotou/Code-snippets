var models = require('../models'),
    url = require('url'),
    M = require('../util.js'),
    Snippet = models.Snippet,
    config = require('../config');

/**
 * 显示单条记录
 */
exports.snippet = function(req, res) {
    Snippet.findById(req.params.id, function(err, doc) {
        if (doc) {
            if (!doc.authorId) {
                console.error(req.params.id + ' snippet was error in db.');
            }
            // 从缓冲池中获取用户对象
            models.getUserById(doc.authorId, function(user) {
                doc.author = user;
                res.render('snippets', { title: 'Code Snippets', snippets:[doc], user: req.user});
            });
        } else {
            res.render('chicken-page', {
                title: 'Code Snippets',
                html: 'You could <a href="/new-snippet" class="btn_2">submit</a> the first piece of code snippet!',
                user: req.user
            });
        }

    })
};

/**
 * 显示多条记录
 */
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

    Snippet.find(dbQuery, function(err, docs) {
        if (docs && docs.length > 0) {
            var finishedCount = 0;
            for (var i = 0, l = docs.length; i < l; ++i) {
                (function(index) {
                    if (!docs[index].authorId) {
                        console.error('No. ' + index + ' snippet was error in db.');
                    }
                    // 从缓冲池中获取用户对象
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
