(function() {
    var define = M.define,
        require = M.require;
define('snippet-common', function(require, exports, module) {
    var $ = M.dom;

    module.exports = {
        checkForm: checkForm
    };

    /**
     * 对表单的简单验证
     */
    function checkForm() {
        var elements = $('input[required], textarea[required]'),
            error = [];

        M._.each(elements, function(ele) {
            if (/^\s*$/.test(ele.value)) {
                error.push('请将必填项补充完整。');
            }
        });

        var pws = $('input[type=password]');
        if (pws.length == 2) {
            if (pws[0].value !== pws[1].value) {
                error.push('两次密码输入不一致');
            }
        }

        if (error.length) {
            alert(error[0]);
            return false;
        }

        return true;
    }
});
})();
(function() {
    var define = M.define,
        require = M.require;
var _ = require('snippet-common'),
    $ = M.dom,
    E = M.event;
var preSnippet = null;
$('.con').on('mouseover', function(e) {
    var target = $(E.getTarget(e)),
        snippet,
        modBtn = null;
    if (target.hasClass('.entry')) {
        snippet = target;
    } else {
        snippet = target.parent('.entry');
    }
    if (snippet[0] === preSnippet) {
        return;
    } else if (!!preSnippet) {
        modBtn = $('.mod-btn', preSnippet);
        modBtn.css('opacity', 0);
        modBtn.css('visibility', 'hidden');
    }
    modBtn = $('.mod-btn', snippet);
    if (!modBtn.length) {
        preSnippet = null;
        return;
    }
    modBtn.css('opacity', 1);
    modBtn.css('visibility', 'visible');
    preSnippet = snippet[0];
});
})();
