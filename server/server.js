'use strict';
const __DEV__ = process.env.NODE_ENV !== 'production';
require('dotenv').load();
if (__DEV__) {
  require('rx').config.longStackSupport = true;
} else {
  require('newrelic');
}
var express = require('express'),
    path = require('path'),
    connectMongo = require('./boot/connectMongo'),
    connectKeystone = require('./boot/connectKeystone'),
    initMiddleware = require('./boot/initMiddleware'),
    generateSitemap = require('./boot/generateSitemap'),

    // ## Util
    accepts = require('accepts'),
    debug = require('debug')('r3dm:server'),
    utils = require('./utils/utils'),

    // ## React
    React = require('react'),
    Router = require('../components/Router'),
    state = require('express-state'),
    R3d = require('../components/context'),

    // ## services
    Fetcher = require('fetchr'),
    connectService = require('./services/connect'),
    blogService = require('./services/blog');

var app = express();
var mongoose = connectMongo();
// ## State becomes a variable available to all rendered views
state.extend(app);
app.set('state namespace', '__R3DM__');
app.set('port', process.env.PORT || 9000);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade');

// ## Fetcher middleware
Fetcher.registerFetcher(connectService);
Fetcher.registerFetcher(blogService);

initMiddleware(app, mongoose);
app.use('/api', Fetcher.middleware());
connectKeystone(app, mongoose);
generateSitemap(app);

const r3d = new R3d();

app.get('/500', function(req, res) {
  res.render('500');
});

app.get('/emails/:name', function(req, res) {
  var locals = {},
      name = req.params.name,
      nameArr;

  nameArr = name
    .split(' ')
    .map(function(_name) {
      _name = _name.replace(/[^A-Za-z_'-]/gi, '');
      _name = utils.capitalize(_name);
      return _name;
    });

  locals.name = nameArr[0];
  res.render('email/greet', locals);
});

app.get('/*', function(req, res, next) {
  const decodedURI = decodeURI(req.path);
  debug('path req', decodedURI);
  Router(decodedURI)
    .filter(({ state }) => {
      const notFound = state.routes.some(route => route.isNotFound);
      if (notFound) {
        debug('tried to find %s but got 404', state.path);
        next();
      }
      return !notFound;
    })
    .flatMap(({ Handler, state }) => {
      debug('rendering %s to string', state.path);
      return r3d.renderToString(React.createElement(Handler));
    })
    .first()
    .subscribe(
      ({ markup, data }) => {
        debug('markup generated');

        // expose data on window.__R3DM__.data
        res.expose(data, 'data');
        debug('rendering jade');
        res.render('layout', { html: markup }, function(err, markup) {
          if (err) { return next(err); }
          debug('jade template rendered');

          debug('sending %s to user', decodedURI);
          return res.send(markup);
        });
      },
      next,
      () => debug('rendering concluded')
    );
});

app.use(function(req, res) {
  res.status(404);
  res.render(404);
});


if (__DEV__) {
  app.use(function(err, req, res, next) { // eslint-disable-line
    debug('Err: ', err.stack);
    res
      .status(err.status || res.statusCode || 500)
      .send('Something went wrong');
  });
} else {
  // error handling in production
  app.use(function(err, req, res, next) { // eslint-disable-line

    // respect err.status
    res.statusCode = err.status || res.statusCode || 500;

    // default status code to 500
    if (res.statusCode < 400) {
      res.statusCode = 500;
    }

    // parse res type
    const accept = accepts(req);
    const type = accept.type('html', 'json', 'text');

    const message = 'opps! Something went wrong. Please try again later';
    if (type === 'html') {
      // req.flash('errors', { msg: message });
      return res.redirect('/');
      // json
    } else if (type === 'json') {
      res.setHeader('Content-Type', 'application/json');
      return res.send({ message: message });
      // plain text
    } else {
      res.setHeader('Content-Type', 'text/plain');
      return res.send(message);
    }
  });
}

app.listen(app.get('port'), function() {
  debug('The R3DM is go at: ' + app.get('port'));
  debug(new Date());
});
