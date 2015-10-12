var gulp                  = require('gulp'),
	$                     = require('gulp-load-plugins')(),
	browserify            = require('browserify'),
	browserSync           = require('browser-sync').create(),
	del                   = require('del'),
	historyApiFallback    = require('connect-history-api-fallback'),
	merge                 = require('merge-stream'),
	path                  = require('path'),
	runSequence           = require('run-sequence'),
	source                = require('vinyl-source-stream'),
	watchify              = require('watchify'),
	AUTOPREFIXER_BROWSERS = [
		'ie >= 9',
		'ie_mob >= 10',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 7',
		'android >= 4.4',
		'bb >= 10'
	];

var middleware = historyApiFallback({});

var isProduction = function () {
		return process.env.NODE_ENV === 'production';
	},
	config       = {
		dest: function () {
			return (isProduction() ? 'dist' : '.tmp');
		}
	};

// Functions

function watchifyTask (options) {
	var bundler, rebundle, tap, iteration = 0;
	bundler = browserify({
		entries: path.join(__dirname, '/app/scripts/main.js'),
		basedir: __dirname,
		insertGlobals: true,
		cache: {}, // required for watchify
		debug: options.watch,
		packageCache: {}, // required for watchify
		fullPaths: options.watch, // required to be true only for watchify
		transform: [['babelify', { ignore: /bower_components/ }]],
		extensions: ['.jsx']
	});

	if (options.watch) {
		bundler = watchify(bundler);
	}

	tap = function () {
		if (iteration === 0 && options.cb) {
			options.cb();
		}
		iteration++;
	};

	rebundle = function () {
		var stream = bundler.bundle();

		if (options.watch) {
			stream.on('error', $.util.log);
			$.util.log($.util.colors.cyan('watchifyTask'), $.util.colors.magenta(iteration));
		}

		stream
			.pipe(source('app.js'))
			.pipe($.if(!options.watch, $.streamify($.uglify())))
			.pipe(gulp.dest(config.dest() + '/scripts'))
			.pipe($.tap(tap));
	};

	bundler.on('update', rebundle);
	return rebundle();
}

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.changed('styles', {
			extension: '.scss'
		}))
		.pipe($.plumber())
		.pipe($.sass.sync({
			includePaths: ['bower_components/'],
			precision: 10
		}).on('error', $.sass.logError))
		.pipe($.plumber.stop())
		.pipe($.autoprefixer({
			browsers: AUTOPREFIXER_BROWSERS
		}))
		.pipe($.autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest(config.dest() + '/styles'))
		.pipe(browserSync.stream())
		.pipe($.size({
			title: 'Styles'
		}));
});

gulp.task('scripts', function (cb) {
	return watchifyTask({
		watch: !isProduction(),
		cb: cb
	});
});

gulp.task('lint', function () {
	return gulp.src('app/scripts/**/*')
		.pipe($.eslint({
			plugins: ['react']
		}))
		.pipe($.eslint.format())
		.pipe($.eslint.failOnError());
});

gulp.task('html', function () {

	var assets = $.useref.assets({
		searchPath: ['.tmp', 'app', '.']
	});

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.cssmin()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(gulp.dest(config.dest()))
		.pipe($.size({
			title: 'HTML'
		}));
});

gulp.task('media', function () {
	return gulp.src('app/media/**/*')
		.pipe($.cache($.imagemin({
			verbose: true,
			progressive: true,
			interlaced: true,
			svgoPlugins: [
				{ cleanupIDs: false },
				{ mergePaths: false }
			]
		})))
		.pipe(gulp.dest(config.dest() + '/media'))
		.pipe($.size({
			title: 'Media'
		}));
});

gulp.task('fonts', function () {
	return gulp.src('bower_components/fontawesome/fonts/*.{eot,svg,ttf,woff,woff2}')
		.pipe($.flatten())
		.pipe(gulp.dest(config.dest() + '/styles/fonts'))
		.pipe($.size({
			title: 'Fonts'
		}));
});

gulp.task('extras', function () {
	var vendor, files;

	vendor = gulp.src('bower_components/modernizr/modernizr.js')
		.pipe($.uglify())
		.pipe(gulp.dest(config.dest() + '/scripts/vendor'))
		.pipe($.size({
			title: 'Extras:vendor'
		}));

	files = gulp.src([
			'app/*.*',
			'!app/*.html',
			'node_modules/apache-server-configs/dist/.htaccess'
		], { dot: true })
		.pipe(gulp.dest(config.dest()))
		.pipe($.size({
			title: 'Extras:files'
		}));

	return merge(vendor, files);
});

gulp.task('clean', del.bind(null, [config.dest() + '/*']));

gulp.task('sizer', function () {
	return gulp.src(config.dest() + '/**/*')
		.pipe($.size({
			title: 'Build',
			gzip: true
		}));
});

gulp.task('assets', function (cb) {
	runSequence('styles', ['media', 'fonts'], cb);
});

gulp.task('mocha', function () {
	return gulp.src('app/scripts/**/__tests__/*.js', {
			read: false
		})
		.pipe($.mocha({
			reporter: 'nyan'
		}));
});

gulp.task('clean', del.bind(null, [config.dest()]));

gulp.task('gh-pages', function () {
	var filter = $.filter('**/app.js');

	return gulp.src(['dist/**/*', 'README.md'])
		.pipe(filter)
		.pipe($.replace(new RegExp('{path:"/",handler:d}', 'g'), '{path:"/react-starter/",handler:d}'))
		.pipe(filter.restore())
		.pipe($.ghPages({
			force: true
		}));
});

gulp.task('serve', ['assets', 'scripts'], function () {
	browserSync.init({
		notify: true,
		logPrefix: 'react-starter',
		server: {
			baseDir: [config.dest(), 'app'],
			routes: {
				'/bower_components': 'bower_components'
			},
			middleware: [middleware]
		}
	});
	gulp.watch('app/styles/**/*.scss', function (e) {
		if (e.type === 'changed') {
			gulp.start('styles');
		}
	});
	gulp.watch(['app/*.html', '.tmp/scripts/app.js', 'app/images/**/*']).on('change', browserSync.reload);
});

gulp.task('build', ['clean'], function (cb) {
	process.env.NODE_ENV = 'production';
	runSequence('lint', 'scripts', ['assets', 'extras', 'html'], 'sizer', cb);
});

gulp.task('deploy', function (cb) {
	runSequence('build', 'gh-pages', cb);
});

gulp.task('default', ['serve']);
