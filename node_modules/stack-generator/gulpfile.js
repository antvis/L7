var concat = require('gulp-concat');
var coveralls = require('gulp-coveralls');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var dependencies = ['./node_modules/stackframe/dist/stackframe.js'];
var source = 'stack-generator.js';

gulp.task('lint', function () {
    return gulp.src(source)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test-pr', ['copy', 'dist'], function (done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        browsers: ['Firefox', 'Chrome'],
        singleRun: true
    }, done).start();
});

gulp.task('test-ci', ['dist'], function (done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.ci.js'
    }, done).start();
});

gulp.task('copy', function () {
    return gulp.src(source)
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['copy'], function () {
    return gulp.src(dependencies.concat(source))
        .pipe(sourcemaps.init())
        .pipe(concat(source.replace('.js', '.min.js')))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['build', 'coverage', 'dist']));

gulp.task('pr', ['lint', 'test-pr']);

gulp.task('ci', ['lint', 'test-ci'], function () {
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['clean'], function (cb) {
    runSequence('lint', 'dist', 'test', cb);
});
