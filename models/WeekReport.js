var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var WeekReport = new Schema({
    authorId: ObjectId
    , lastWeek: String
    , thisWeek: String
    , date: Date
    , lastUpdateDate: Date
});

mongoose.model('WeekReport', WeekReport);
