
var gulp      = require('gulp'),
  gulpImports = require('gulp-imports'),
  gutil       = require('gulp-util'),
  header      = require('gulp-header'),
  uglify      = require('gulp-uglify'),
  concat      = require('gulp-concat'),
  jshint      = require('gulp-jshint'),
  karma       = require('gulp-karma'),
  babel       = require('gulp-babel'),
  pkg         = require('./package.json'),
  banner      = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  '',
  ''].join('\n');

/**
 * distrib
 * Build the final scripts: `vivus.js` and `vivus.min.js`
 *
 */
gulp.task('scripts', function () {
  return gulp.src(['./public/js/src/*.js'])
    .pipe(uglify())
    .pipe(gulpImports())
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('./public/js/dist/'));
});

/**
 * lint
 * run JShint on the scripts
 *
 */
gulp.task('lint', function () {
  return gulp.src(['src/vivus.js', 'src/pathformer.js', 'test/**/*.spec.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * test
 * run Karma on the scripts
 *
 */
gulp.task('test', function () {
  // Be sure to return the stream
  return gulp.src([
      'test/unit.setup.js',
      'src/pathformer.js',
      'src/vivus.js',
      'test/unit/**.js'
    ])
    .pipe(karma({
      configFile: 'test/karma.conf.js',
      action: 'run'
    }));
});

/**
 * develop
 * Task to develop, it run a watch which pass JShint and build
 * the final scripts.
 *
 */
gulp.task('watch', function () {
  gulp.watch('./public/js/**/*.js', function () {
    gulp.run('scripts');
  });
});

