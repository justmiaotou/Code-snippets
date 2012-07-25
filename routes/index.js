var models = require('../models'),
    Snippet = models.Snippet;
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.newSnippet = function(req, res) {
    res.render('new-snippets', { title: 'test' });
}

exports.snippets = function(req, res) {
    Snippet.find({}, function(err, docs) {
        res.render('snippets', { title: 'Code Snippets', snippets:docs});
    });
}

exports.snippetUpload = function(req, res) {
    console.log('Upload!');
    console.log(req.body);
    var body = req.body;
    var snippet = new Snippet();
    snippet.author = body.author;
    snippet.desc = body.description;
    //snippet.codes = body.codes;
    snippet.save(function(err) {
        res.header('Content-type', 'application/json');
        if (err) {
            res.end(JSON.stringify({status: 0}));
        } else {
            res.end(JSON.stringify({status: 1}));
        }
    });
}
