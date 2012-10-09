var mongoose = require('mongoose'),
    config = require('../config');
mongoose.connect(config.db);

require('./Snippet');
require('./User');

exports.Snippet = mongoose.model('Snippet');
exports.User = mongoose.model('User');
//exports.DelSnippet = mongoose.modlel('DelSnippet');

require('./db-utils');
