/**
 * @description 通过操作className使节点隐藏
 */
function hide(node) {
    addClass(node, 'hide');
}

/**
 * @description 通过操作className使节点显示
 */
function show(node) {
    removeClass(node, 'hide');
}

/**
 * @description 对url进行解析并返回解析后的对象
 */
function parseURL() {
    var url = location.href;
    var query = url.substring(url.indexOf('?')+1).split('&'),
        params = {},
        tmp = null;
    for (var i = 0, l = query.length; i < l; ++i) {
        tmp = query[i].split('=');
        params[tmp[0]] = tmp[1];
    }
    return {
        path: location.pathname,
        protocol: location.protocol,
        params: params
    }
}

/**
 * @description 由id或class来获取p节点下的子节点，若不指定p，则p默认为document
 */
function obj(idOrClass, p) {
    p || (p = document);
    if (idOrClass.charAt(0) == '.') {
        return nodes(idOrClass.substring(1), p);
    } else if (idOrClass.charAt(0) == '#') {
        return document.getElementById(idOrClass.substring(1));
    } else {
        return document.getElementById(idOrClass);
    }
}

/**
 * @description 返回节点p的一级子节点中特定className的节点
 * @param {String} className 返回节点需具备的className
 * @param {Node} p 返回的子节点属于该节点
 */
function nodes(className, p) {
    /*var children = p.childNodes,
        arr = [];
    for (var i = 0, l = children.length; i < l; ++i) {
        if (children[i].className == className) {
            arr.push(children[i]);
        }
    }
    return arr;*/
    var all = p.getElementsByTagName('*'),
        arr = [],
        reg = new RegExp(className);
    for (var i = 0, l = all.length; i < l; ++i) {
        if (reg.test(all[i].className)) {
            arr.push(all[i]);
        }
    }
    return arr;
}

function preventDefault(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

/**
 * @description 绑定事件
 */
function addEvent(o, t, f) {
    if (o.addEventListener) {
        o.addEventListener(t, f, false);
    } else if (o.attachEvent) {
        o.attachEvent('on'+ t, f);
    } else {
        o['on'+ t] = f;
    }
}

/**
 * @description 替换className中的某[几]个class
 */
function replaceClass(node, className, newClassName) {
    var fullClass = node.className,
        reg = new RegExp(className);
    if (reg.test(fullClass)) {
        fullClass = fullClass.replace(className, newClassName);
        node.className = fullClass;
    }
}

/**
 * @description 移除某[几]个class
 */
function removeClass(node, className) {
    replaceClass(node, className, '');
}

/**
 * @description 添加class
 */
function addClass(node, className){
    var reg = new RegExp(className);
    if (!reg.test(node.className)) {
        node.className = node.className + ' ' + className;
    }
}

/**
 * @description 检测是否包含某class
 */
function hasClass(node, className) {
    var reg = new RegExp(className);
    if (reg.test(node.className)) {
        return true;
    } else {
        return false;
    }
}

/**
 * @description 获得可视高度
 */
function getViewportHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
}

/**
 * @description 获得上卷的高度
 */
function getScrollTop() {
    return document.documentElement.scrollTop ||document.body.scrollTop;
}

/**
 * @description 获得左卷的宽度
 */
function getScrollLeft() {
    return document.documentElement.scrollLeft ||document.body.scrollLeft;
}

/**
 * @description 获得可视高度加上卷的高度
 */
function getTotalTop() {
    var de = document.documentElement,
        db = document.body;
    return (de.scrollTop || db.scrollTop) + (de.clientHeight || db.clientHeight); 
}

/**
 * @description 获得计算后的样式集合
 */
function getCurrentStyle(node) {
    var style = null;
    if (window.getComputedStyle) {
        style = window.getComputedStyle(node, null);
    } else {
        style = node.currentStyle;
    }
    return style;
}

/*========================
 * Ajax 相关
 *========================*/
/**
 * @description 封装ajax的相关操作
 * ajax({
 *        method: 'get' // default: 'post'
 *      , url: '/example'
 *      , isAsync: false // default: true
 *      , form: form
 *      , useDisabled: true // default: false
 *      , blackList: ['select-one']
 *      , data: {   // data: 'a=1&b=2'
 *            a: 1
 *          , b: 2
 *      }
 *      , on: {
 *            start: function() {}
 *          , complete: function() {}
 *      }
 *      arguments: {
 *          start: 'hey'
 *          , complete: [1, 2]
 *      }
 * });
 */
var ajax = (function(){
    /**
     * @description 获得XMLHttpRequest对象。
     * 摘自《Javascript高级程序设计》 P444
     */
    function createXHR() {
        if (typeof window.XMLHttpRequest != 'undefined') {
            return new window.XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            if (typeof arguments.callee.activeXString != 'string') {
                var version = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];
                for (var i = 0, l = versins.length; i < l; ++i) {
                    try {
                        var xhr = new ActiveXObject(version[i]);
                        arguments.callee.activeXString = version[i];
                        return xhr;
                    } catch(ex) { }
                }
            }

            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error("No XHR object available.");
        }
    }
    /**
     * @description 对表单进行序列化
     * 修改自《Javascript高级程序设计》 P356
     */
    function serialize(form, useDisabled, blackList) {
        var parts = [],
            field = null,
            inBlackList;
        for (var i = 0, l = form.elements.length; i < l; ++i) {
            inBlackList = false;
            field = form.elements[i];
            // 默认不包含disabled的元素
            // 若想包含disabled元素，则设置useDisabled = true
            if (field.disabled && !useDisabled) {
                continue;
            }
            // 若元素类型属于黑名单中，则不包含该元素
            if (blackList && blackList.length > 0) {
                for (var j = 0, k = blackList.length; j < k; ++j) {
                    if (field.type == blackList[j]) {
                        inBlackList = true;
                        break;
                    }
                }
                if (inBlackList) continue;
            }
            switch(field.type) {
                case 'select-one':
                case 'select-multiple':
                    var option = null;
                    for (var j = 0, optLen = field.options.length; j < optLen; ++j) {
                        option = field.options[j];
                        if (option.selected) {
                            var optValue = '';
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute('value') ?
                                           option.value : option.text);
                            } else {
                                optValue = (option.attributes['value'].specified ?
                                           option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + '=' +
                                       encodeURIComponent(optValue));
                        }
                    }
                    break;
                case undefined:
                case 'file':
                case 'submit':
                case 'reset':
                case 'button':
                    break;
                case 'radio':
                case 'checkbox':
                    if (!field.checked) {
                        break;
                    }
                default:
                    parts.push(encodeURIComponent(field.name) + '=' +
                               encodeURIComponent(field.value));
            }
        }
        return parts.join('&');
    }

    var xhr = createXHR();

    return function (config) {
        config.method || (config.method = 'post');
        config.isAsync || (config.isAsync = true);
        config.on || (config.on = {});
        config.arguments || (config.arguments = {});

        var form = config.form,
            data = form ? serialize(form, config.useDisabled, config.blackList) : '';
        if (config.data) {
            if (Object.prototype.toString.call(config.data) == '[object String]') {
                data == '' ? (data = config.data) : (data += '&' + config.data);
            } else {
                var tmp = [];
                for (var i in config.data) {
                    tmp.push(i + '=' + config[i]);
                }
                tmp = tmp.join('&');
                data == '' ? (data = tmp) : (data += '&' + tmp);
            }
        }

        // XHR对象重用小技巧：open放在onreadystatechange事件之前
        // http://keelypavan.blogspot.com/2006/03/reusing-xmlhttprequest-object-in-ie.html
        xhr.open(config.method, config.url, config.isAsync);
        if (form) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.onreadystatechange = function() {
            switch (xhr.readyState) {
                case 1:
                    config.on.start && config.on.start(xhr, config.arguments.start);
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    config.on.complete && config.on.complete(xhr, config.arguments.complete);
                    break;
            }
        }
        xhr.send(data);
    }
}());
