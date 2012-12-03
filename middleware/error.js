'use strict';

exports.error = function(err, req, res, next) {
    console.log(err.stack);
    if (req.xhr) {
        res.send(500, { msg: 'O_O...WTF!Something bad happen...'});
    } else {
        res.status(500);
        res.render('warning', {
            html: 'O_O...WTF!Something bad happen...'
        });
    }
};
