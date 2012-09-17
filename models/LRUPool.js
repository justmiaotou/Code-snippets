/**
 * 采用LRU最近最久未使用策略的对象缓冲池
 * @param {Object} option 对缓冲池的配置对象
 */
function LRUPool(option) {
    option = option || {};

    var count = 0, 
        indexName = option.indexName || '_id',
        maxCount = option.maxCount || 100000,
        reduceTo = option.reduceTo || (maxCount / 5),
        first = null,
        last = null;

    this.pool = {};

    this.getCount = function() { return count; };
    this.getFirst = function() { return first; };
    this.getLast = function() { return last; };

    // 调整或插入节点
    this.upsertIns = function(ins) {
        if (this.count == 0) {
            last = ins;
        }
        // 若不存在于池中，直接添加为first节点
        if (!this.pool[ins[indexName]]) {
            this.pool[ins[indexName]] = ins;
            count++;
            ins.next = first;
            ins.pre = null;
            first && (first.pre = ins);
            first = ins;
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
        }
    };
    // 将池中对象减少至to个
    this.reduce = function(to) {
        to = to || reduceTo;
        if (count <= to) return;
        for (var i = 0, l = count - to; i < l; ++i) {
            delete this.pool[last[indexName]];
            last = last.pre;
            last.next = null;
        }
    };
}

LRUPool.prototype.set = function(ins) {
    this.upsertIns(ins);
};
LRUPool.prototype.get = function(id) {
    if (this.pool[id]) {
        return this.upsertIns(this.pool[id]);
    } else {
        return false;
    }
};

exports.LRUPool = LRUPool;
