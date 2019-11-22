var coveralls = require('gulp-coveralls');
var del = require('del');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var karma = require('karma');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var sources = 'stackframe.js';
var minified = sources.replace('.js', '.min.js');

gulp.task('lint', function() {
    return gulp.src(sources)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test-pr', ['copy', 'dist'], function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        browsers: ['Firefox', 'Chrome_Travis'],
        singleRun: true
    }, done).start();
});

gulp.task('test-ci', ['copy', 'dist'], function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.ci.js',
        singleRun: true
    }, done).start();
});

gulp.task('copy', function() {
    gulp.src(sources)
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['copy'], function() {
    return gulp.src(sources)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename(minified))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['build', 'coverage', 'dist']));

gulp.task('pr', ['lint', 'test-pr']);

gulp.task('ci', ['lint', 'test-ci'], function() {
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['clean'], function(cb) {
    runSequence('lint', ['copy', 'dist'], 'test', cb);
});
