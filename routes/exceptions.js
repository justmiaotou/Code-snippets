

exports['404'] = function (res, html) {
    res.render('chicken-page', {
        title: 'Code Snippets',
        html: html || '凡人，404密境不是你该来的地方。',
    });
}
