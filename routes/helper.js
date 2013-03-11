'use strict';

var EventProxy = require('eventproxy'),
    config = require('../config');

/**
 *  获取某collection的第page页（每页count个）的内容与pagination信息
 *  option = {
 *      model: Snippet,
 *      params: params // url的query对象
 *      query: { type:3 },
 *      proxyAssign: [],
 *      onDocsReady: function(err, docs, proxy) {
 *          ...
 *      },
 *      done: function(docs, pagination) {
 *          res.render(...);
 *      }
 *  }
 */
exports.getPage = function(option) {
    var proxy = new EventProxy(),
        params = option.params,
        Model = option.model,
        page = isNaN(params.page) ? 0 : (params.page > 0 ? params.page - 1 : 0),
        opt = {
            skip: page * config.page_size,
            limit: config.page_size,
            sort: [['date', 'desc']]
        },
        pagination = {
            current: page + 1,
        };

    option.query || (option.query = {});

    var tmpArr = [];
    for (var i in params) {
        if (i != 'page') {
            tmpArr.push(i + '=' + params[i]);
        }
    }
    pagination.baseURL = '?' + tmpArr.join('&');

    // TODO 现在允许proxyAssign包含最多三个
    proxy.assign('docsReady', 'count', option.proxyAssign || [], function(docs, count, item1, item2, item3) {
        //console.log(arguments);
        pagination.total = Math.ceil(count / config.page_size);
        option.done(docs, pagination, item1, item2, item3);
    });

    Model.count(option.query, function(err, count) {
        proxy.emit('count', count);
    });

    Model.find(option.query, null, opt, function(err, docs) {
        option.onDocsReady && option.onDocsReady(err, docs, proxy);
        proxy.emit('docsReady', docs);
    });
}
