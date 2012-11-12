'use strict';

/**
 * 采用LRU最近最久未使用策略的对象缓冲池
 * @param {Object} option 对缓冲池的配置对象
 */
function LRUPool(option) {
    option = option || {};

    var pool = {},
        count = 0, 
        indexName = option.indexName || '_id',
        maxCount = option.maxCount || 100000,
        reduceTo = option.reduceTo || (maxCount / 5),
        first = null,
        last = null;

    this.getPool = function() { return pool; };
    this.getCount = function() { return count; };
    this.getFirst = function() { return first; };
    this.getLast = function() { return last; };

    // 调整或插入节点
    this.upsertIns = function(ins) {
        if (count == 0) {
            last = ins;
        }
        // 若不存在于池中，直接添加为first节点
        if (!pool[ins[indexName]]) {
            pool[ins[indexName]] = ins;
            count++;
            ins.next = first;
            ins.pre = null;
            first && (first.pre = ins);
            first = ins;
            if (count > maxCount) {
                // 池中实例超过上限，进行清除
                this.reduce(reduceTo);
            }
            return ins;
        } else {
            if (ins.pre) {
                ins.pre.next = ins.next;
            } else {
                // 如果没有前节点，说明该节点为first节点
                // 此时不需调节位置
                return ins;
            }
            if (ins.next) {
                ins.next.pre = ins.pre;
            } else {
                // 没有下一个节点，则前一个节点将变为last节点
                last = ins.pre;
            }
            first.pre = ins;
            ins.next = first;
            first = ins;
            ins.pre = null;
            return ins;
        }
    };
    // 将池中对象减少至to个
    this.reduce = function(to) {
        to = to || reduceTo;
        if (count <= to) return;
        for (var i = 0, l = count - to; i < l; ++i) {
            delete pool[last[indexName]];
            count--;
            last = last.pre;
            last.next = null;
        }
    };
}

LRUPool.prototype.set = function(ins) {
    this.upsertIns(ins);
};

LRUPool.prototype.get = function(id) {
    if (this.getPool()[id]) {
        return this.upsertIns(this.getPool()[id]);
    } else {
        return false;
    }
};

// 调试用
LRUPool.prototype.logLink = function(param) {
    console.log('=========Link=======');
    var first = this.getFirst(),
        str = first[param];
    first = first.next;
    while(first) {
        str += '->' + first[param];
        first = first.next;
    }
    console.log(str);
    console.log('=========End========');
}

exports.LRUPool = LRUPool;
