var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var gulp = require('gulp')
var concat = require('gulp-concat')
var watch = require('gulp-watch')
var watch = require('gulp-copy')

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['app/**/*.js'],
  html: ['app/**/*.html']
};


gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.html, ['html']);
});

gulp.task('default', ['sass', 'js', 'html', 'watch']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});



gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('js', function () {
  gulp.src(['app/**/app.js', 'app/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./www/js'))
})

gulp.task('html', function () {
    gulp.src('./app/**/*.html')
      .pipe(gulp.dest('./www/templates'));
})


gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
