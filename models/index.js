var mongoose = require('mongoose'),
    config = require('../config');
mongoose.connect(config.db);

require('./Snippet');
require('./User');
require('./WeekReport');

exports.Snippet = mongoose.model('Snippet');
exports.User = mongoose.model('User');
exports.WeekReport = mongoose.model('WeekReport');
//exports.DelSnippet = mongoose.modlel('DelSnippet');

require('./db-utils');
