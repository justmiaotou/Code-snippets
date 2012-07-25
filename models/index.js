var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/code_snippet');

require('./Snippet');

exports.Snippet = mongoose.model('Snippet');
