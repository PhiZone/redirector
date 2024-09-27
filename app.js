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

const ALLOWED_BASES = [
  'https://www.phizone.cn',
  'https://www.phi.zone',
  'https://insider.phizone.cn',
];

app.use((req, res, next) => {
  let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  let target = url.searchParams.get('uri');

  if (target && ALLOWED_BASES.some((e) => target.startsWith(e))) {
    url.searchParams.delete('uri');
    let targetUrl = new URL(target);

    for (let [key, value] of url.searchParams.entries()) {
      targetUrl.searchParams.append(key, value);
    }

    return res.redirect(targetUrl.href);
  } else {
    return res.redirect(ALLOWED_BASES[0]);
  }
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
