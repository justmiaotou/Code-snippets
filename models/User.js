'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    username: String
    , password: String
    , email: String
    , lastLoginDate: Date
});

mongoose.model('User', UserSchema);
