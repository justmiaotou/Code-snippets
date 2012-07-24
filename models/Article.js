var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Code = new Schema({
    type: String
    , desc: String
    , code: String
});
var Article = new Schema({
    author: String
    , desc: String
    , Codes: [Code]
    , hasEffect: Boolean
});

mongoose.model('Article', Article);
