define(function(require, exports, module) {
    var _ = require('common'),
        $ = _.$;
    var preSnippet = null;
    _.addEvent($('.con')[0], 'mouseover', function(e) {
        e = _.getEvent(e);
        var target = _.getTarget(e),
            snippet = _.parent(target, '.entry') || target,
            modBtn = null;
        if (snippet === preSnippet) {
            return;
        } else if (!!preSnippet) {
            modBtn = $('.mod-btn', preSnippet)[0];
            modBtn.style.opacity = 0;
            modBtn.style.visibility = 'hidden';
        }
        modBtn = $('.mod-btn', snippet)[0];
        if (!modBtn) {
            preSnippet = null;
            return;
        }
        modBtn.style.opacity = 1;
        modBtn.style.visibility = 'visible';
        preSnippet = snippet;
    });
});
