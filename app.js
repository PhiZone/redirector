var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  let target = url.searchParams.get('uri');

  if (target) {
    url.searchParams.delete('uri');
    let targetUrl = new URL(target);

    for (let [key, value] of url.searchParams.entries()) {
      targetUrl.searchParams.append(key, value);
    }

    return res.redirect(targetUrl.href);
  } else {
    return res.redirect('https://www.phizone.cn');
  }
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
