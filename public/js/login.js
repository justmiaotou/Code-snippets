(function() {
    var define = M.define,
        require = M.require;
define('mask', function(require, exports, module) {
    'use strict';

    var _ = M._,
        E = M.event,
        $ = M.dom,
        U = M.util;

    module.exports = function(config) {
        var defaultConfig = {
            id: 'brick-mask',
            zIndex: 100,
            root: document.body
        };
        config = _.extend(defaultConfig, config);

        var mask = document.getElementById(config.id);

        if (!mask) {
            mask = $.create('<div id="' + config.id + '" class="tst-02-all"></div>');
        }

        /**
         * 设置mask的z-index值
         */
        this.setZIndex = function(num) {
            if (_.isNaN(num)) return;

            config.zIndex = num;

            mask.style.zIndex = num;
        };
        /**
         * 显示mask
         */
        this.show = function() {
            if ($('#' + config.id).length) {
                return;
            }

            $.append(document.body, mask);

            this.setZIndex(config.zIndex);

            // IE6、7针对不支持position:fixed的情况
            if ($.css(mask, 'position') == 'absolute') {
                mask.style.height = U.getViewportHeight() + 'px';
                onScroll();
                E.on(window, 'scroll', onScroll);
                E.on(window, 'resize', onResize);
            }
        };
        /**
         * 隐藏mask
         */
        this.hide = function() {
            if (!$('#' + config.id).length) {
                return;
            }

            if ($.css(mask, 'position') == 'absolute') {
                E.off(window, 'scroll', onScroll);
                E.off(window, 'resize', onResize);
            }

            $(mask).remove();
        };

        function onScroll() {
            mask.style.top = U.getScrollTop();
            mask.style.left = U.getScrollLeft();
        }
        function onResize() {
            // 防止resize时底部留空白
            mask.style.height = U.getViewportHeight() + 'px';
        }
    }
});
})();
(function() {
    var define = M.define,
        require = M.require;
/**
 * TIP
 * 1、所有包含`pop-cls`这个className的元素，点击后都会导致浮层隐藏
 * 2、pop.set('hideMask', boolean)：默认为true。设置为false时，隐藏浮层后不会自动隐藏背景遮罩
 *
 * TODO List
 * 1、 创建一个对象池保存display:block的浮层，可用于还有浮层没有hide的时候不隐藏mask
 *      同时去除hide函数中第三个用来控制mask是否隐藏的参数，注意要修改sign-pops模块
 */
define('pop', function(require, exports, module) {
    'use strict';

    var _ = M._,
        $ = M.dom,
        Mask = require('mask'),
        hasOwn = Object.prototype.hasOwnProperty,
        E = M.event,
        popId = 0,
        
        // 页面上可见pop的对象池
        visiblePopPool = {};

    var mask = new Mask();

    module.exports = Pop;

    function Pop(option, tpls) {
        var _this = this,
            // custom configuration
            config = {option: option, tpls: tpls},
            // default configuration
            defaultConfig = {
                option: {
                    title: '',              // pop's title
                    id: 'pop-' + (popId++), // wrapper's id
                    wrapperClass: '',       // wrapper's classname
                    root: document.body,    // the node that pop append to
                    hasHeader: true,        // trigger to render the header
                    hasFooter: true,        // trigger to render the footer
                    draggable: false,       // if the pop draggable TODO
                    body: '',               // body content
                    extra: '',              // extra content in footer
                    buttons: [              // if given, the default will be override
                        {
                            text: '确定',
                            click: function(e) {
                                E.preventDefault(e);
                                _this.hide();
                            }
                        }
                    ],
                    before: null,           // call before init
                    after: null             // call after init
                },
                tpls: {
                    header: '<div class="pop-header"><h4><%= title %></h4><a class="pop-cls" href="javascript:void(0)"></a></div>',
                    body: '<div class="pop-body"><%= body %></div>',
                    footer: '<div class="pop-footer"><div class="ext-content"><%= extra %></div><div class="btns"><%= buttons %></div></div>',
                    button: '<a class="ib footer-btn <%= className %>" href="javascript:void(0)"><%= text %></a>',
                    wrapper: '<div class="pop <%= wrapperClass %>" id="<%= wrapperId %>"><%= content %></div>'
                }
            };

        // extend from default configuration
        // do not override, then you can reuse it
        config = initConfig(defaultConfig, config);

        var stepConfigs = [],   // store every step's config
            stepTpls = [],      // store every step's content template
            stepCount = 0,      // flag the current step
            popTpl = '',
            MOUSE_EVENT = ['click', 'mouseup', 'mousedown', 'mouseover', 'mousemove', 'mouseout'],
            data = {};          // data object,sharing datas beyong steps

        this.pop = null;
        this.init = function() {
            var option = config.option,
                step;
            if (option.before && !option.before()) {
                return;
            }
            if (option.enableSteps) {
                // switch option to the first step's option
                option = stepConfigs[0].option;
                for (var i = 0, l = stepConfigs.length; i < l; ++i) {
                    stepTpls.push(render(stepConfigs[i]));
                }
                // Show the first step
                stepCount = 0;
                step = stepTpls[stepCount];
            } else {
                step = render(config);
            }

            var pagePop = $('#' + option.id);
            if (pagePop.length) {
                pagePop.remove();
            }

            popTpl = _.template(config.tpls.wrapper)({
                wrapperClass: option.wrapperClass || '',
                wrapperId: option.id,
                content: step
            });

            // append the pop to `config.root`
            this.pop = $.create(popTpl);
            $.append(config.option.root, this.pop);

            option.hasFooter && addBtnEvent(option.buttons);

            // delegate to the element that has `.pop-cls` to close the pop
            $(this.pop).delegate('.pop-cls, .footer-btn', 'click', function(e) {
                // prevent trigger the `onbeforeunload` event
                E.preventDefault(e);
                if ($.hasClass(this, 'pop-cls')) {
                    _this.hide();
                }
            });

            // if draggable, add the drag effact
            if (option.draggable) {
                drag($('.pop-header', this.pop), this.pop);
            }

            addStepClass();
            option.after && option.after();
        };

        function initConfig(srcConf, desConf) {
            if (desConf) {
                desConf.option = (desConf.option ? _.extend(_.clone(srcConf.option), desConf.option) : srcConf.option);
                desConf.tpls = (desConf.tpls ? _.extend(_.clone(srcConf.tpls), desConf.tpls) : srcConf.tpls);
            } else {
                desConf = { option: _.clone(srcConf.option), tpls: _.clone(srcConf.tpls) };
            }
            return desConf;
        }

        function render(config) {
            var tpls = config.tpls,
                option = config.option;

            return ((option.hasHeader ? compileHeader() : '') +
                    compileBody() +
                    (option.hasFooter ? compileFooter() : ''));

            function compileHeader() {
                return _.template(tpls.header)({
                    title: option.title
                });
            }

            function compileBody() {
                return _.template(tpls.body)({
                    body: option.body
                });
            }

            function compileFooter() {
                return _.template(tpls.footer)({
                    extra: option.extra,
                    buttons: compileBtn()
                });
            }

            function compileBtn() {
                var compile = _.template(tpls.button),
                    output = '',
                    buttons = option.buttons;
                for (var i = 0, l = buttons.length; i < l; ++i) {
                    output += compile({
                        text: buttons[i]['text'],
                        // each btn has its own btn[id] class
                        className: (buttons[i]['className'] || '') + ' btn' + i
                    });
                }
                return output;
            }
        }

        function addBtnEvent(btnConfigs) {
            var btn, config;
            for (var i = 0, l = btnConfigs.length; i < l; ++i) {
                btn = $('.btn' + i, _this.pop);
                config = btnConfigs[i];
                _.each(MOUSE_EVENT, function(evt) {
                    if (evt in config) {
                        if (hasOwn.call(config, evt)) {
                            btn.on(evt, config[evt]);
                        }
                    }
                });
            }
        }

        /**
         * Override the default templates
         * It should be called before calling the `init` function
         * @param {Object} temps the templates prefer to used
         */
        this.setTpls = function(temps) {
            _.extend(config.tpls, temps);
        };
        
        this.setOpts = function(opts) {
            _.extend(config.option, opts);
        };

        if (config.option.enableSteps) {
            this.addStep = function(option, tpls) {
                var stepConfig = {option: option, tpls: tpls};
                // use the main config(not the default config) as the base config
                stepConfigs.push(initConfig(config, stepConfig));
            };
            this.nextStep = function(callback) {
                _this.toStep(stepCount + 1, callback);
            };
            this.previousStep = function(callback) {
                _this.toStep(stepCount - 1, callback);
            };
            /**
             * 将分步浮层跳到某一步。0为第一步
             * @param {Number} index 要跳到的步数
             * @param {Function} callback 允许在跳到该步骤后进行回调
             */
            this.toStep = function(index, callback) {
                if (index >= stepConfigs.length || index < 0) return;
                var option = stepConfigs[index].option;
                if (option.before && !option.before()) {
                    return;
                }
                stepCount = index;
                _this.pop.innerHTML = stepTpls[stepCount];
                option.hasFooter && addBtnEvent(option.buttons);
                addStepClass();

                option.after && option.after();
                callback && callback();
            };
        }
        function addStepClass() {
            var body;
            if (_this.pop) {
                body = $('.pop-body', _this.pop);
                if (body) {
                    if (~body[0].className.indexOf('step')) {
                        body[0].className = body[0].className.replace(/pop-step-\d/, 'pop-step-' + stepCount);
                    } else {
                        body[0].className = body[0].className + ' pop-step-' + stepCount;
                    }
                }
            }
        }

        /**
         * simple data model
         * sharing data between steps
         */
        this.set = function(key, value) {
            data[key] = value;
        };
        this.get = function(key) {
            return data[key];
        };

    };

    /**
     * show the pop widget
     * @param {Function} callback if given,invoke it before showing the pop
     *                          if return `false`,the pop will not show
     */
    Pop.prototype.show = function(before, after, showMask) {
        // if not initialized
        if (!this.pop) {
            this.init();
        }
        if (!before || (before() !== false)) {
            this.pop.style.display = 'block';
            showMask !== false && mask.show();
        }
        after && after();
    };

    /**
     * hide the pop widget
     * @param {Function} callback if given,invoke it before hidding the pop
     *                          if return `false`,the pop will not hide
     */
    Pop.prototype.hide = function(before, after, hideMask) {
        var setterHideMask = this.get('hideMask');
        if (!before || (before() !== false)) {
            this.pop.style.display = 'none';

            // hideMask的优先级要高于setterHideMask
            // get('hideMask')将在整个生命周期存在（除非再set为undefined）
            // hideMask只在调用hide函数时临时存在
            // hideMask只有全等于false时才不隐藏mask
            if (hideMask !== false) {
                if (typeof setterHideMask != 'undefined') {
                    setterHideMask && mask.hide();
                } else {
                    mask.hide();
                }
            }
        }
        after && after();
    };

    /**
     * set or get the value of zIndex
     * @param {Number} value the `zIndex` attribute should be
     */
    Pop.prototype.zIndex = function(value) {
        if (this.pop && value && _.isNumber(+value) && !_.isNaN(+value)) {
            $(this.pop).css('zIndex', value);
            return this;
        } else {
            return $(this.pop).css('zIndex');;
        }
    };

    // drag the trigger then the target will move
    function drag(trigger, target) {
        var doc = $(document),
            target = $(target),
            trigger = $(trigger),
            startX, startY,
            targetOffset;
        trigger.css('cursor', 'move');
        trigger.on('mousedown', function(e) {
            startX = e.clientX;
            startY = e.clientY;
            targetOffset = target.position();
            document.onselectstart = function() {return false;};
            document.ondragstart = function() {return false;};
            doc.on('mousemove', moveHandler);
            doc.on('mouseup', upHandler);
        });
        function moveHandler(e) {
            E.stopPropagation(e);
            target.css({
                left: targetOffset.left + (e.clientX - startX) + 'px',
                top: targetOffset.top + (e.clientY - startY) + 'px'
            });
        }
        function upHandler(e) {
            E.stopPropagation(e);
            document.onselectstart = function() {return true;};
            document.ondragstart = function() {return true;};
            doc.off('mousemove', moveHandler);
            doc.off('mouseup', upHandler);
        }
    }

});
})();
(function() {
    var define = M.define,
        require = M.require;
define('snippet-common', function(require, exports, module) {
    var $ = M.dom;

var pops = require('common-pops'),
    popAlert = pops.popAlert;

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
            popAlert.show(error[0]);
            return false;
        }

        return true;
    }
});
})();
(function() {
    var define = M.define,
        require = M.require;
define('common-pops', function(require, exports, module) {
    var $ = M.dom,
        Pop = require('pop');

    exports.popAlert = new AlertPop();
    exports.popConfirm = new ConfirmPop();

    // 模拟alert弹出框
    // popAlert.show('msg');
    // 若不想该弹出框hide的时候把mask也一起hide掉
    // 则这样调用：popAlert.show('msg', false);
    function AlertPop() {
        var _this = this,
            hideMask = true,
            okCallback = null,
            popAlert = new Pop({
                id: 'pop-alert',
                draggable: true,
                body: '<p class="warning-tip"><i class="warning-icon"></i><span class="msg"></span></p>',
                buttons: [
                    {
                        text: '确定',
                        click: function() {
                            _this.hide();
                        }
                    }
                ]
            }),
            pop;

        popAlert.init();
        popAlert.zIndex('20000');

        pop = $(popAlert.pop);
        pop.children('.pop-body').css('padding', '0');

        this.pop = pop[0];

        this.setTitle = function(title) {
            pop.children('.pop-header h4').html(title);
        };

        this.show = function(msg, bHideMask, okCB) {
            hideMask = true;
            if (typeof bHideMask == 'function') {
                okCallback = bHideMask;
            } else {
                okCallback = okCB;
                typeof bHideMask != 'undefined' && (hideMask = bHideMask);
            }
            pop.children('.msg').html(msg);
            popAlert.show();

            pop.css({
                marginTop: -(pop[0].clientHeight / 2) + 'px',
                marginLeft: -(pop[0].clientWidth / 2) + 'px'
            });
        };

        this.setHideMask = function(b) {
            hideMask = b;
        };

        this.hide = function() {
            if (typeof okCallback == 'function') {
                okCallback();
            }
            popAlert.hide(null, null, hideMask);
        };

        this.setWidth = function(width) {
            width = ~('' + width).indexOf('px') ? +width.substring(0, width.indexOf('px')) : +width;
            pop.css({
                width: width + 'px'
            });

            // 邮箱内位置非居中，所以只有在邮箱外时才调整margin-left
            if (pop.css('marginLeft') != '0px') {
                pop.css({
                    marginLeft: (-width / 2) + 'px'
                });
            }
        }
    }

    function ConfirmPop() {
        var _this = this,
            confirmCallback,
            cancelCallback,
            popConfirm = new Pop({
                id: 'pop-confirm',
                draggable: true,
                body: '<p class="warning-tip"><i class="warning-icon"></i><span class="msg"></span></p>',
                buttons: [
                    {
                        text: '确定',
                        click: function() {
                            if (typeof confirmCallback == 'function') {
                                confirmCallback();
                            }
                        }
                    },
                    {
                        text: '取消',
                        click: function() {
                            if (typeof cancelCallback == 'function') {
                                cancelCallback();
                            }
                            if (popConfirm.pop.style.display != 'none') {
                                popConfirm.hide();
                            }
                        }
                    }
                ]
            }),
            pop;

        popConfirm.init();
        popConfirm.zIndex('20000');

        pop = $(popConfirm.pop);
        pop.children('.pop-body').css('padding', '0');

        this.setTitle = function(title) {
            pop.children('.pop-header h4').html(title);
        };

        this.show = function(msg, confirm, cancel) {
            pop.children('.msg').html(msg);
            confirmCallback = confirm;
            cancelCallback = cancel;
            popConfirm.show();

            pop.css({
                marginTop: -(pop[0].clientHeight / 2) + 'px',
                marginLeft: -(pop[0].clientWidth / 2) + 'px'
            });
        }
        this.hide = function(hideMask) {
            popConfirm.hide(null, null, hideMask);
        };
        this.setOkText = function(txt) {
            pop.children('.footer-btn:first').html(txt);
        };
    }
});
})();
(function() {
    var define = M.define,
        require = M.require;
var _ = require('snippet-common'),
    $ = M.dom;

var pops = require('common-pops'),
    popAlert = pops.popAlert;

var form = $('#main-form'),
    passwd = $('#passwd'),
    params = M.util.getQuery();

form.on('submit', function(e) {
    if (!_.checkForm()) {
        E.preventDefault(e);
        return false;
    }
});

if (params.redirect) {
    $('#redirect').value = params.redirect;
}

handleError();

function handleError() {
    if (!params.error) return;
    switch(params.error) {
        case 'pw':
            showError('密码错误，请重试');
            passwd[0].focus();
            break;
        case 'un':
            showError('用户名不存在，请重试');
            break;
        case 'not_login':
            showError('请先登录！');
            break;
    }
}
function showError(msg) {
    popAlert.show(msg);
}
})();
