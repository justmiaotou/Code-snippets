var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Code = new Schema({
    type: String
    , desc: String
    , code: String
});
var Snippet = new Schema({
    author: String
    , desc: String
    , codes: [Code]
    , hasEffect: Boolean
});

mongoose.model('Snippet', Snippet);
