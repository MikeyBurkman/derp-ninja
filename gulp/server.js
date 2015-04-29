'use strict';

 // TODO: Also watch and restart backend on changes to backend/**/*.js

var gulp = require('gulp');

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');
var nodemon = require('gulp-nodemon');

/* This configuration allow you to configure browser sync to proxy your backend */
var proxyTarget = 'http://localhost:3001'; // The location of your backend
var proxyApiPrefix = 'api'; // The element in the URL which differentiate between API request and static file request

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

function proxyMiddleware(req, res, next) {
  if (req.url.indexOf(proxyApiPrefix) !== -1) {
    console.log('Browser-Sync Proxying: ', req.url);
    proxy.web(req, res);
  } else {
    next();
  }
}

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  browserSync.instance = browserSync.init(files, {
    startPath: '/index.html',
    server: {
      baseDir: baseDir,
      middleware: proxyMiddleware
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    'app',
    '.tmp'
  ], [
    'app/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:e2e', function () {
  browserSyncInit(['app', '.tmp'], null, []);
});

gulp.task('serve:e2e-dist', ['watch'], function () {
  browserSyncInit('dist', null, []);
});

gulp.task('serve:backend', function () {
  nodemon({
    script: 'backend/app.js',
    watch: ['backend/'],
    ext: 'js'
  });
});

gulp.task('serve:all', ['serve', 'serve:backend']);
