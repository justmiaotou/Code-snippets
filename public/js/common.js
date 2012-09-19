()();
function Cookie() {
}
Cookie.prototype.isEnabled = function() {
    return navigator.cookieEnabled;
}

/**
 * 修改版的document.getElementsByTagName，返回的为数组而非NodeList对象
 * 注：Array.prototype.slice.call(document.getElementsByTagName(tagName)) IE6/7不支持
 */
function getByTag(tagName) {
    var arr = [],
        tags = document.getElementsByTagName(tagName);
    for (var i = 0, l = tags.length; i < l; ++i) {
        arr.push(tags[i]);
    }
    return arr;
}
/**
 * 获得事件对象
 * @param {Event} event
 */
function getEvent(event) {
    return event ? event : window.event;
}

/**
 * 获得事件的target对象
 * @param {Event} event
 */
function getTarget(event) {
    return event.target || event.srcElement;
}

/**
 * 获得mouseover、mouseout事件中的关联元素
 * @param {Event} e
 */
function getRelatedTarget(e) {
    if (event.relatedTarget) {
        return event.relatedTarget;
    } else if (event.toElement) {
        return event.toElement;
    } else if (event.fromElement) {
        return event.fromElement;
    }
}

/**
 * 判断parentNode是否包含childNode
 * 注：parentNode == childNode时返回false
 * @param {Object} parentNode
 * @param {Object} childNode
 */
function contain(parentNode, childNode) {
    return parentNode.contains ?
        parentNode != childNode && parentNode.contains(childNode) :
        !!(parentNode.compareDocumentPosition(childNode) & 16);
}

/**
 * 获得父节点。若指定父节点的class或id，则会逐级向上查找
 * 直到找到并返回，或返回null
 * @param {Object} node 子节点
 * @param {String} idOrClass 父节点的class或id
 */
function parent(node, idOrClass) {
    if (!node.parentNode) return null;
    if (idOrClass.charAt(0) == '.') {
        if (hasClass(node.parentNode, idOrClass.substring(1))) {
            return node.parentNode;
        } else {
            return parent(node.parentNode, idOrClass);
        }
    } else if (idOrClass.charAt(0) == '#') {
        if (node.parentNode.id == idOrClass.substring(1)) {
            return node.parentNode;
        } else {
            return parent(node.parentNode, idOrClass);
        }
    }
    return node.parentNode;
}

/**
 * 将节点插入父节点末尾
 */
function append(parent, node) {
    parent.appendChild(node);
}

/**
 * @description 将节点插入父节点首部
 */
function prepend(parent, node) {
    parent.insertBefore(node, parent.childNodes[0]);
}

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
 * @description 由id或class来获取p节点下的子节点，若不指定p，则p默认为document
 */
function $(idOrClass, p) {
    p || (p = document);
    if (idOrClass.charAt(0) == '.') {
        return getByClass(idOrClass.substring(1), p);
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
function getByClass(className, p) {
    var all = p.getElementsByTagName('*'),
        arr = [],
        reg = new RegExp(' ' + className + ' |^' + className + '$| ' + className + '$|^' + className + ' ');
    for (var i = 0, l = all.length; i < l; ++i) {
        if (reg.test(all[i].className)) {
            arr.push(all[i]);
        }
    }
    return arr;
}

/**
 * @description 替换className中的某[几]个class
 */
function replaceClass(node, className, newClassName) {
    var fullClass = node.className,
        reg0 = new RegExp(' ' + className + ' '),
        reg1 = new RegExp('^' + className + '$'),
        reg2 = new RegExp(' ' + className + '$'),
        reg3 = new RegExp('^' + className + ' ');
    if (reg0.test(fullClass)) {
        fullClass = fullClass.replace(reg0, ' ' + newClassName + ' ');
    } else if (reg1.test(fullClass)) {
        fullClass = fullClass.replace(reg1, newClassName);
    } else if (reg2.test(fullClass)) {
        fullClass = fullClass.replace(reg2, ' ' + newClassName);
    } else if (reg3.test(fullClass)) {
        fullClass = fullClass.replace(reg3, newClassName + ' ');
    }
    node.className = fullClass;
}

/**
 * @description 取消默认行为
 */
function preventDefault(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

/**
 * @description 取消事件冒泡
 */
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
 * @description 移除某[几]个class
 */
function removeClass(node, className) {
    replaceClass(node, className, '');
}

/**
 * @description 添加class
 */
function addClass(node, className){
    if (!hasClass(node, className)) {
        node.className = node.className + ' ' + className;
    }
}

/**
 * @description 检测是否包含某class
 */
function hasClass(node, className) {
    var reg = new RegExp(' ' + className + ' |^' + className + '$| ' + className + '$|^' + className + ' ');
    return reg.test(node.className);
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

/**
 * @description 对url进行解析并返回解析后的对象
 */
function parseURL() {
    var url = location.href,
        query = url.substring(url.indexOf('?')+1),
        params = parseQuery(query);
    return {
        path: location.pathname,
        protocol: location.protocol,
        params: params
    }
}

/**
 * 对表单的简单验证
 */
function checkForm() {
    var inputs = getByTag('input'),
        textareas = getByTag('textarea');

    var pws = [];
    if (!modArrItem(inputs.concat(textareas), function() {
        if (this.hasAttribute('required') && this.value == '') {
            alert('请将必填项补充完整。');
            return false;
        }
        if (this.tagName.toLowerCase() == 'input' && this.type.toLowerCase() == 'password') {
            pws.push(this);
        }
    })) {
        return false;
    };
    if (pws.length == 2) {
        if (pws[0].value !== pws[1].value) {
            alert('两次密码输入不一致');
            return false;
        }
    }
    return true;
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
                for (var i = 0, l = version.length; i < l; ++i) {
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
            // 若元素名称属于黑名单中，则不包含该元素
            if (blackList && blackList.length > 0) {
                for (var j = 0, k = blackList.length; j < k; ++j) {
                    if (field.name == blackList[j]) {
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
                    // TODO 第二次调用才进入处理函数？？？？start函数中使用xhr.abort()将导致Dom Exception
                    config.on.start && config.on.start(xhr, data, config.arguments.start);
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

/**
 * @description 对数组的指定连续部分进行修改。
 * 若有回调函数的返回值为false，则不对余下的数组成员调用回调函数而直接返回false。
 * @param {Array} arr 操作的对象数组
 * @param {Function} callback 应用于对象数组每个成员的回调函数，this值为相应成员
 * @param {Number} from [option]应用回调的起始成员序号
 * @param {Number} to [option]应用回调的结束成员序号
 */
function modArrItem(arr, callback, from, to) {
    !from && (from=0);
    !to && (to=arr.length);
    for (;from < to; from++) {
        // 回调函数通过返回值控制流程
        if (callback.call(arr[from], arr[from], from, arr) === false) {
            return false;
        }
    }
    return true;
}

/**
 * 解析url中的查询字段
 * @param {String} query url中的查询字段，例如：'a=1&b=2&c=3'
 */
function parseQuery(query) {
    var arr = query ? query.split('&') : [],
        tmp = null,
        o = {};
    for (var i = 0, l = arr.length; i < l; ++i) {
        tmp = arr[i].split('=');
        tmp[0] != '' && (o[tmp[0]] = tmp[1]);
    }
    return o;
}
