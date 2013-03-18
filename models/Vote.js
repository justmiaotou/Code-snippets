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
    , tags: [String]
    , opts: [VoteOption]
    , voters: [String]
    , minToSelect: Number
    , maxToSelect: Number
    // 投票类型，多选还是单选
    , type: Number
    , count: Number
    , fromDate: Date
    , toDate: Date
    , date: Date
    , lastUpdateDate: Date
});

mongoose.model('Vote', Vote);
