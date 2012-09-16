(function() {
    var preSnippet = null;
    addEvent($('.con')[0], 'mouseover', function(e) {
        e = getEvent(e);
        var target = getTarget(e),
            snippet = parent(target, '.entry') || target
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
})();
