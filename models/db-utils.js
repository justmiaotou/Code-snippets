var index = require('./index'),
    M = require('../util.js'),
    config = require('../config');

index.getUser = function(loginField, password, suc, fail) {
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
}
