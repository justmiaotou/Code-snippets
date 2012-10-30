var models = require('../models'),
    Snippet = models.Snippet;

/*var start = Date.now();
for (var i = 0; i < 10000; i++) {
    (function(index) {
        Snippet.find({ }, null, {
            limit: 10
        }, function (err, docs) {
            if (index == 9999) {
                console.log(Date.now() - start);
                start = Date.now();
                for (var i = 0; i < 10000; i++) {
                    (function(i) {
                        Snippet.find({ }, null, {
                            skip: 2,
                            limit: 10
                        }, function (err, docs) {
                            i == 9999 && console.log(Date.now() - start);
                        });
                    })(i);
                }
            }
        });
    })(i);
}*/

Snippet.count({}, function() {
    console.log(arguments);
});
