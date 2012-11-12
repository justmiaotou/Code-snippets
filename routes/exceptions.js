'use strict';

exports['404'] = function (req, res, html) {
    res.render('chicken-page', {
        title: 'Code Snippets',
        html: html || '凡人，404密境不是你该来的地方。',
        user: req.user
    });
};
