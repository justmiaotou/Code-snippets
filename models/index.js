var mongoose = require('mongoose'),
    config = require('../config');
mongoose.connect(config.db);

require('./Snippet');

exports.Snippet = mongoose.model('Snippet');
