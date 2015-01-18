/* jshint node:true */
'use strict';
// generated on 2015-01-10 using generator-gulp-webapp 0.2.0
var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	del = require('del'),
	runSequence = require('run-sequence');

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe($.sass({
			precision: 4,
			includePaths: ['bower_components'],
			outputStyle: 'nested'
		}))
		.pipe($.autoprefixer({
			browsers: ['last 1 version']
		}))
		.pipe(gulp.dest('.tmp/styles'));
});

// Lint and Code Styling
gulp.task('lint', function () {
	return gulp.src(['scripts/**', '!scripts/**/*.min.js', '!scripts/vendor/*.js'])
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failOnError());
});

gulp.task('html', [ 'styles'], function () {

	var lazypipe = require('lazypipe');
	var cssChannel = lazypipe()
		.pipe($.cssmin)
		.pipe($.replace, '../bower_components/bootstrap-sass-official/assets/fonts/bootstrap', 'fonts');
	var assets = $.useref.assets({
		searchPath: '{.tmp,app}'
	});

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', cssChannel()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe($.if('*.html', $.minifyHtml({
			conditionals: true,
			loose: true
		})))
		.pipe(gulp.dest('dist'));
});

gulp.task('media', function () {
	return gulp.src('app/media/**/*')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/media'));
});

gulp.task('fonts', function () {
	return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
		.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
	return gulp.src([
		'app/*.*',
		'!app/*.html',
		'node_modules/apache-server-configs/dist/.htaccess'
	], {
		dot: true
	}).pipe(gulp.dest('dist'));
});

gulp.task('assets', ['clean'], function (cb) {
	runSequence(['html', 'media', 'fonts', 'extras'], cb);
});

// inject bower components
gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;

	gulp.src('app/styles/*.scss')
		.pipe(wiredep({
			exclude: ['bootstrap-sass-official']
		}))
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep({
			exclude: ['bootstrap-sass-official']
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('clean', function (cb) {
	del(['.tmp', 'dist'], cb);
});

gulp.task('connect', ['styles'], function () {
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var app = require('connect')()
		.use(require('connect-livereload')({
			port: 35729
		}))
		.use(serveStatic('.tmp'))
		.use(serveStatic('app'))
		// paths to bower_components should be relative to the current file
		// e.g. in app/index.html you should use ../bower_components
		.use('/bower_components', serveStatic('bower_components'))
		.use(serveIndex('app'));

	require('http').createServer(app)
		.listen(9000)
		.on('listening', function () {
			console.log('Started connect web server on http://localhost:9000');
		});
});

gulp.task('watch', ['connect'], function () {
	$.livereload.listen();

	// watch for changes
	gulp.watch([
		'app/*.html',
		'.tmp/styles/**/*.css',
		'app/scripts/**/*.js',
		'app/media/**/*'
	]).on('change', $.livereload.changed);

	gulp.watch('app/styles/**/*.scss', function (e) {
		if (e.type === 'changed') {
			gulp.start('styles');
		}
	});
	gulp.watch('bower.json', ['wiredep']);
});

gulp.task('serve', ['connect', 'watch'], function () {
	require('opn')('http://localhost:9000');
});

gulp.task('build', ['assets'], function () {
	return gulp.src('dist/**/*').pipe($.size({
		title: 'build',
		gzip: true
	}));
});

gulp.task('deploy', ['build'], function () {
	return gulp.src('dist/**/*')
		.pipe($.filelog())
		.pipe($.ghPages());
});

gulp.task('default', ['clean'], function () {
	gulp.start('serve');
});
