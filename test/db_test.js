var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// mongoose.connect(...).on == undefined ?
var db = mongoose.createConnection('mongodb://localhost/test');

db.on('error', console.error.bind(console, 'Connect Error!'));
db.on('open', function() {
    console.log('Connect');
});

var Code = new Schema({
    type: String
    , desc: String
    , code: String
});
var schema = new Schema({
    author: String
    , type: Number
    , date: Date
    , tags: [String]
    , codes: [Code]
    , hasEffectBtn: Boolean
});

var Snippet = mongoose.model('Snippet', schema);

var snippet = new Snippet({
    author: 'Memo',
    type: 123,
    date: new Date(),
    tags: ['Memo', 'Lois'],
    codes: [
        {
            type: 1,
            desc: 'aaa',
            code: 'html>head+body'
        },
        {
            type: 2,
            desc: 'bbb',
            code: 'hhhhhh'
        }
    ],
    hasEffectBtn: true
});

// snippet.save(function() { });
