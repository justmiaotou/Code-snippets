
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.snippets = function(req, res) {
    res.render('snippets', { title: 'Code Snippets' });
}
