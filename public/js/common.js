function hide(node) {
    addClass(node, 'hide');
}

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
