'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Code = new Schema({
    type: String
    , desc: String
    , code: String
});
var Snippet = new Schema({
    authorId: String
    , title: String
    , desc: String
    , type: Number
    , date: Date
    , lastUpdateDate: Date
    , tags: [String]
    , codes: [Code]
    , hasEffectBtn: Boolean
    , effectBtnId: String
});

mongoose.model('Snippet', Snippet);
//mongoose.model('DelSnippet', Snippet);
