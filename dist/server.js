const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Cookie = require('cookie-parser');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded
app.use(Cookie())

app.use('/public', express.static('public'));
app.use('/pages', express.static('pages'));
app.use('/lib', express.static('lib'));

function AuthMiddleware(req, res, next) {
  if (req.url.startsWith('/login')) {
    next()
    return
  }
  console.log("req.cookies",req.cookies)
  if (!req.cookies.userToken) {
    res.redirect('/login')
    return
  }
  // if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  //     next();
  //     return
  // }else{
  //   res.redirect("/login")
  //   return
  // }
  next();
}
app.use(AuthMiddleware)

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);

// Reload code here
reload(app)
  .then(function (reloadReturned) {
    // reloadReturned is documented in the returns API in the README

    // Reload started, start web server
    server.listen(app.get('port'), function () {
      console.log(
        'Web server listening on port http://localhost:' + app.get('port')
      );
    });
  })
  .catch(function (err) {
    console.error(
      'Reload could not start, could not start server/sample app',
      err
    );
  });
