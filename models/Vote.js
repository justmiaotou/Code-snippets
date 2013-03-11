var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var VoteOption = new Schema({
    description: String
    , voters: [String]
    , count: Number
});

var Vote = new Schema({
    authorId: ObjectId
    , title: String
    , description: String
    , tag: [String]
    , opts: [VoteOption]
    , count: Number
    , fromDate: Date
    , toDate: Date
    , date: Date
    , lastUpdateDate: Date
});

mongoose.model('Vote', Vote);
