var gulp = require('gulp');
var jade = require('gulp-jade');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var open = require('gulp-open');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var gutil = require('gulp-util');
var del = require('del');
var modifyCssUrls = require('gulp-modify-css-urls');


// Relative to the html file
var stagePath = '';
var cdnPath = '';

/*
*  Markup
*/

// Dev
gulp.task('markup:dev', function() {
    var locals = {
        dev: true,
        stagePath: stagePath,
        cdnPath: cdnPath
    };

    gulp.src('src/markup/pages/*.jade')
        .pipe(jade(
        {
            pretty: true,
            locals: locals
        }))
        .pipe(gulp.dest('./dist/'))
});

// Prod 
gulp.task('markup:prod', function() {
    var locals = {
        dev: false,
        stagePath: stagePath,
        cdnPath: cdnPath
    };

    gulp.src('src/markup/pages/*.jade')
        .pipe(jade(
        {
            pretty: true,
            locals: locals
        }))
        .pipe(gulp.dest('./dist/'))
});

/*
*  Styles
*/

gulp.task('styles:dev', function() {

    gulp.src('src/styles/main.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compressed: false
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version', '> 1%', 'ff 17', 'ie 8']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('styles:prod', function() {

    gulp.src('src/styles/main.styl')
        .pipe(stylus({
            compress: true 
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version', '> 1%', 'ff 17', 'ie 8']
        }))
        // .pipe(
        //     modifyCssUrls({
        //         modify: function(url, filePath) {

        //             if (!/^(f|ht)tps?:\/\//i.test(url)) {

        //                 if(/\.\./.test(url)) {
        //                     url = url.split('../')[1];
        //                 }

        //                 url = cdnPath + url;
        //             }

        //             return url;

        //         }
        //     })
        // )
        .pipe(gulp.dest('dist/css'));
});


/*
*  Scripts
*/ 

gulp.task('scripts:dev', function() {

    gulp.src(['src/scripts/**/*.js', '!src/scripts/iev.js', '!src/scripts/ScrollMagic.min.js'])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));

    gulp.src(['src/scripts/iev.js','src/scripts/ScrollMagic.min.js' ])
        .pipe(gulp.dest('dist/js'));

});

gulp.task('scripts:prod', function() {

    gulp.src(['src/scripts/**/*.js', '!src/scripts/iev.js', '!src/scripts/ScrollMagic.min.js'])
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    gulp.src(['src/scripts/iev.js','src/scripts/ScrollMagic.min.js' ])
        .pipe(gulp.dest('dist/js'));
});


/*
*  Assets
*/

// General Assets
gulp.task('assets', function() {

    gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'));

});

// Images
gulp.task('images', function() {

    gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/img'));

});

// Fonts
gulp.task('fonts', function() {

    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

});


/*
*  General
*/

// Clean
gulp.task('del', function(cb) {
    del([
        'dist/**/*'
    ], cb);
});

// Watch 
gulp.task('watch', function() {

    livereload.listen();

    gulp.watch(['dist/**']).on('change', livereload.changed)

    gulp.watch('src/scripts/**/*.js', ['scripts:dev']);
    gulp.watch('src/styles/**/*.styl', ['styles:dev']);
    gulp.watch('src/markup/**/*.jade', ['markup:dev']);
    gulp.watch('src/assets/**/*', ['assets']);
    gulp.watch('src/fonts/**/*', ['fonts']);
    gulp.watch('src/images/**/*', ['images']);

});

// Connect 
gulp.task('connect', function() {
    connect.server({
        host: '*',
        root: 'dist/',
        port: '3000'
    })
});

// Open 
gulp.task('open', ['connect', 'dev'], function() {

    // I added this timeout because the page was being opened too soon - Devin
    setTimeout(function() {
        gulp.src('dist/')
            .pipe(open({
                uri: 'http://localhost:3000',
                app: 'Google Chrome'
            }));
    }, 100)
});

/*
*  Main
*/

gulp.task('default', ['watch', 'open'], function() {
    // open triggers dev and connect
});

gulp.task('dev', ['del'], function() {
    gulp.start('dev:build');
});

gulp.task('dev:build', ['markup:dev', 'styles:dev', 'scripts:dev', 'images', 'fonts', 'assets'], function() {

});

gulp.task('prod', ['del'], function() {
    gulp.start('prod:build'); 
});

gulp.task('prod:build', ['markup:prod', 'styles:prod', 'scripts:prod', 'images', 'fonts', 'assets'], function() {

});

// Commenting this out because we came up with a better solution and I don't want someone to use this shitty one

// gulp.task('integrate', ['prod:build'], function() {

//     gutil.log('Copying files to: ', gutil.colors.magenta(process.env.HOME + integrateDest));

//     // Ensuring the prod build is done before copying - I was having issues with it copying too soon
//     setTimeout(function() {
//         gulp.src('dist/**/*')
//            .pipe(gulp.dest(process.env.HOME + integrateDest));
//     }, 1500);

// });

