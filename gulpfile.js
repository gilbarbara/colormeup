/* jshint node:true */
'use strict';
// generated on 2015-01-10 using generator-gulp-webapp 0.2.0
var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	browserSync = require('browser-sync'),
	del = require('del'),
	eslint = require('eslint/lib/cli'),
	globby = require('globby'),
	merge = require('merge-stream'),
	reload = browserSync.reload,
	runSequence = require('run-sequence');

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.cssjoin({
			paths: ['app/styles', 'bower_components']
		}))
		.pipe($.sass({
			outputStyle: 'nested',
			precision: 4,
			includePaths: ['.'],
			onError: console.error.bind(console, 'Sass error:')
		}))
		.pipe($.autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(reload({ stream: true }));
});

// Lint and Code Styling
gulp.task('lint', function (cb) {
	var patterns = ['app/scripts/*.js'];

	return globby(patterns, function(err, paths) {
		if (err) {
			// unexpected failure, include stack
			cb(err);
			return;
		}
		console.log(paths);
		// additional CLI options can be added here
		var code = eslint.execute(paths.join(' '));
		if (code) {
			// eslint output already written, wrap up with a short message
			cb(new $.util.PluginError('lint', new Error('ESLint error')));
			return;
		}
		cb();
	});
});

gulp.task('html', ['styles'], function () {
	var assets = $.useref.assets({ searchPath: ['.tmp', 'app', '.'] });

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
		})), {
			verbose: true
		})
		.pipe(gulp.dest('dist/media'));
});

gulp.task('fonts', function () {
	return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest('.tmp/fonts'));
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

	var fonts = gulp.src(['.tmp/fonts/*'])
		.pipe(gulp.dest('dist/fonts'));

	var scripts = gulp.src(['bower_components/zeroclipboard/dist/ZeroClipboard.swf'])
		.pipe(gulp.dest('dist/scripts'));


	return merge(files, svg, fonts);
});

gulp.task('assets', ['clean'], function (cb) {
	runSequence('fonts', ['html', 'images', 'fonts', 'extras'], cb);
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
			exclude: ['bootstrap-sass', 'bower_components/spectrum/spectrum.css']
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('clean', function (cb) {
	del(['dist'], cb);
});

gulp.task('serve', ['fonts'], function () {
	browserSync({
		notify: false,
		logPrefix: 'colormeup',
		server: {
			baseDir: ['.tmp', 'app'],
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	});

	gulp.watch([
		'app/*.html',
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

gulp.task('build', ['assets'], function () {
	return gulp.src('dist/**/*')
		.pipe($.size({
			title: 'build',
			gzip: true
		}));
});

gulp.task('preview', function () {
	require('opn')('http://localhost/colormeup/dist/');
});

gulp.task('deploy', ['build'], function() {
	return gulp.src('dist/**', {
			dot: true
		})
		.pipe($.rsync({
			incremental: true,
			exclude: ['.DS_Store'],
			progress: true,
			root: 'dist',
			username: 'colormeup',
			hostname: 'colormeup.co',
			destination: '/home/colormeup/public_html'
		}));

	//rsync -rvpa --progress --delete --exclude=.DS_Store -e "ssh -q -t" dist/* colormeup@colormeup.co:/home/colormeup/public_html
});

gulp.task('default', function () {
	gulp.start('serve');
});
