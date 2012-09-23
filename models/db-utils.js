var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var model = require('./index'),
    M = require('../util'),
    config = require('../config'),
    UserPool = require('./LRUPool').LRUPool;

model.getUser = function(loginField, password, suc, fail) {
    this.User.find({$or : [{ username: loginField}, { email: loginField }]}, function(err, docs) {
        if (docs.length == 1) {
            if (password == docs[0]['password']) {
                suc(docs[0]);
            } else {
                fail && fail('pw_error');
            }
        } else {
            fail && fail('un_error');
        }
    });
};

var userPool = new UserPool(config.userPool); // LRU策略对象缓冲池

model.getUserById = function(id, suc, fail) {
    var user = userPool.get(id);
    if (user) {
        // userPool.logLink('username');
        suc && suc(user);
        return;
    };

    this.User.findById(id, function(err, doc) {
        if (doc) {
            userPool.set(doc);
            suc && suc(doc);
        } else {
            fail && fail();
        }
    });
};
