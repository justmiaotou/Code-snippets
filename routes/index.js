
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
    res.render('snippets', { title: 'Code Snippets' });
}

exports.snippetUpload = function(req, res) {

}
