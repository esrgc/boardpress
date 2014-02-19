var pkg = require('../package.json');

exports.index = function(req, res){
  res.render('home', {
    title: 'Boardpress',
    version: pkg.version,
    name: pkg.name,
    env: process.env.NODE_ENV
  })
}

