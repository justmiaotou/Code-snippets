(function() {
    var urlParam = parseURL().params;
    var effectBlock = obj('.effect-block')[0],
        codeBlock = obj('.code-block')[0],
        mainNav = obj('.main-nav')[0],
        navList = obj('.list', mainNav)[0];
    if (urlParam.type) {
        switch(urlParam.type) {
            case 'function':
                break;
            case 'api':
                removeClass(obj('.selected', navList)[0], 'selected');
                addClass(navList.childNodes[1], 'selected');
                break;
        }
    }
    /*addEvent(navList, 'click', function(e) {
        if (e.target.tagName.toLowerCase() == 'li' && !hasClass(e.target, 'selected')) {
            removeClass(obj('.selected', navList)[0], 'selected');
            addClass(e.target, 'selected');
            switch(e.target.innerHTML) {
                case 'Effect':
                    show(effectBlock);
                    hide(codeBlock);
                    break;
                case 'Code':
                    hide(effectBlock);
                    show(codeBlock);
                    break;
                default:
                    break;
            }
        }
    });*/
})();

// 遮罩效果演示
(function() {
    var fragment = document.createDocumentFragment();
    var elt = document.createElement('div');
    elt.innerHTML = '<div class="mask hide">\
            <p class="av-center">点击隐藏遮罩</p>\
        </div>';
    fragment.appendChild(elt);
    document.body.appendChild(fragment);
    var mask = obj('.mask')[0],
        btn = obj('#mask-btn');
    // 针对不支持position:fixed的情况
    if (getCurrentStyle(mask).position == "absolute"){
        mask.style.height = getViewportHeight()+'px';
        addEvent(window, 'scroll', function() {
            mask.style.top = getScrollTop();
            mask.style.left = getScrollLeft();
        });
        addEvent(window, 'resize', function() {
            mask.style.height = getViewportHeight()+'px';
        });
    }
    addEvent(btn, 'click', function() {
        show(mask);
    });
    addEvent(mask, 'click', function() {
        hide(mask);
    });
})();

