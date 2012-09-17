var UserPool = require('../models/LRUPool').LRUPool;

var userPool = new UserPool()
    insCount = 10;

console.log(userPool);

for (var i = 0; i < insCount; ++i) {
    userPool.set({_id: i});
}

var id = null;
for (var j = 0; j < 10; ++j) {
    id = Math.floor(Math.random()*insCount);
    userPool.get(id);
    logLink();
}

userPool.set({_id: 100});
logLink();
console.log(userPool.getCount());

/*console.log('=========First=======');
console.log(userPool.getFirst());
console.log('=========Last=======');
console.log(userPool.getLast());*/
//console.log(userPool.pool);
function logLink() {
    console.log('=========Link=======');
    var first = userPool.getFirst(),
        str = first._id;
    first = first.next;
    while(first) {
        str += '->' + first._id;
        first = first.next;
    }
    console.log(str);
}
