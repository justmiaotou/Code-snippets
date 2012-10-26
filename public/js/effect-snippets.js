// 遮罩效果演示
define(function(require, exports, module) {
    var _ = require('common'),
        addEvent = _.addEvent;
    var fragment = document.createDocumentFragment();
    var elt = document.createElement('div');
    elt.innerHTML = '<div class="mask hide">\
            <p class="av-center">点击隐藏遮罩</p>\
        </div>';
    fragment.appendChild(elt);
    document.body.appendChild(fragment);
    var mask = $('.mask')[0],
        btn = $('#mask-btn');
    // 针对不支持position:fixed的情况
    if (_.getCurrentStyle(mask).position == "absolute"){
        mask.style.height = _.getViewportHeight()+'px';
        addEvent(window, 'scroll', function() {
            mask.style.top = _.getScrollTop();
            mask.style.left = _.getScrollLeft();
        });
        addEvent(window, 'resize', function() {
            mask.style.height = _.getViewportHeight()+'px';
        });
    }
    addEvent(btn, 'click', function() {
        show(mask);
    });
    addEvent(mask, 'click', function() {
        hide(mask);
    });
})();
