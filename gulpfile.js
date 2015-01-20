/* jshint node:true */
'use strict';
// generated on 2015-01-10 using generator-gulp-webapp 0.2.0
var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	del = require('del'),
	runSequence = require('run-sequence'),
	merge = require('merge-stream'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.sass({
			outputStyle: 'nested',
			precision: 4,
			includePaths: ['.'],
			onError: console.error.bind(console, 'Sass error:')
		}))
		.pipe($.autoprefixer({
			browsers: ['last 1 version']
		}))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(reload({ stream: true, once: true }));
});

// Lint and Code Styling
gulp.task('lint', function () {
	return gulp.src(['scripts/**', '!scripts/**/*.min.js', '!scripts/vendor/*.js'])
		.pipe(reload({ stream: true, once: true }))
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.if(!browserSync.active, $.eslint.failOnError()));
});

gulp.task('html', ['styles'], function () {
	var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.cssmin()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe($.if('*.html', $.minifyHtml({
			conditionals: true,
			loose: true
		})))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
	return gulp.src('app/media/**/*.{jpg,png,gif}')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/media'));
});

gulp.task('fonts', function () {
	return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest('.tmp/fonts'))
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
	var files = gulp.src([
		'app/*.*',
		'!app/*.html',
		'node_modules/apache-server-configs/dist/.htaccess'
	], {
		dot: true
	}).pipe(gulp.dest('dist'));

	var svg = gulp.src(['app/media/**/*.svg'])
		.pipe(gulp.dest('dist/media'));

	return merge(files, svg);
});

gulp.task('assets', ['clean'], function (cb) {
	runSequence(['html', 'images', 'fonts', 'extras'], cb);
});

// inject bower components
gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;

	gulp.src('app/styles/*.scss')
		.pipe(wiredep({
			exclude: ['bootstrap-sass']
		}))
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep({
			exclude: ['bootstrap-sass']
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('clean', function (cb) {
	del(['.tmp', 'dist'], cb);
});

gulp.task('watch', ['styles'], function () {
	browserSync({
		notify: true,
		logPrefix: 'colormeup',
		port: 3000,
		server: {
			baseDir: ['.tmp', 'app'],
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	});

	// watch for changes
	gulp.watch([
		'app/*.html',
		'.tmp/styles/**/*.css',
		'app/scripts/**/*.js',
		'app/media/**/*'
	]).on('change', reload);

	gulp.watch('app/styles/**/*.scss', function (e) {
		if (e.type === 'changed') {
			return gulp.start('styles');
		}
	});
	gulp.watch('bower.json', ['wiredep', 'fonts', reload]);
});

gulp.task('serve', ['assets', 'watch']);

gulp.task('build', ['assets'], function () {
	return gulp.src('dist/**/*').pipe($.size({
		title: 'build',
		gzip: true
	}));
});

gulp.task('preview', function () {
	require('opn')('http://localhost/colormeup/dist/');
});

gulp.task('deploy', ['build'], function () {
	// git subtree push --prefix dist origin gh-pages
	return gulp.src('dist/**/*')
		.pipe($.filelog())
		.pipe($.ghPages());
});

gulp.task('default', ['clean'], function () {
	gulp.start('serve');
});
