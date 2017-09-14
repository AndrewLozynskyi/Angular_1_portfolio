/*
 * @author ohmed
 * Gulp project build file
*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var order = require('gulp-order');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var spawn = require('child_process').spawn;
var templateCache = require('gulp-angular-templatecache');
var clean = require('gulp-clean');

// Resources build

function buildResources () {

    return gulp.src('./src/client/img/**/*')
        .pipe( gulp.dest('./dist/client/img/') );

};

function buildJS () {

    return gulp.src('./src/client/js/**/*')
        .pipe( gulp.dest('./dist/client/js/') );

};

function buildCSS () {

    return gulp.src('./src/client/css/**/*.css')
        .pipe( gulp.dest('./dist/client/css/') );

};

function buildBowerComponents () {

    return gulp.src('./src/client/bower_components/**/*')
        .pipe( gulp.dest('./dist/client/bower_components/') );

};

function buildSASS () {

    return gulp.src('./src/client/css/sass/**/*.scss')
        .pipe( sass({
            errLogToConsole: true,
            style: 'expanded',
            includePath: ['./src/client/css/sass/dashboard',
                './src/client/css/sass/main',
                './src/client/css/sass/tools']
        }) )
        .pipe( concat( 'app_scss.css' ) )
        .pipe( gulpif( argv.prod, useref() ) )
        .pipe( gulpif( argv.prod, cleanCSS() ) )
        // .pipe( autoprefixer( "last 3 version","safari 5", "ie 8", "ie 9" ) )
        .pipe( gulp.dest('./dist/client/css/') );

};

function buildFonts () {

    return gulp.src('./src/client/fonts/**/*')
        .pipe( gulp.dest('./dist/client/fonts/') );

};

function buildHTML () {

    return gulp.src('./src/client/**/*.html')
        .pipe( gulp.dest('./dist/client/') );

};

function buildDirectives () {

    return gulp.src('./src/client/views/**/*.html')
        .pipe( templateCache() )
        .pipe( gulp.dest('./dist/client/views') );

};

function buildAndRetartServer () {

    setTimeout( restartServer, 500 );

    return gulp.src('./src/server/**/*')
        .pipe( gulp.dest('./dist/server/') );

};

function buildServer () {

    return gulp.src('./src/server/**/*')
        .pipe( gulp.dest('./dist/server/') );

};

function buildProd () {

    if ( argv.prod ) {

        return gulp.src( [ './dist/client/views/pages/Index.html', './dist/client/views/pages/Login.html' ] )
            .pipe( gulp.dest('./dist/client/') );

    } else {

        return gulp.src('./dist/client/');

    }

};

function finishProdBuild () {

    if ( argv.prod ) {

        return gulp.src( './dist/client/*.html' )
            .pipe( useref() )
            .pipe( gulpif( argv.minify, gulpif( '*.js', uglify() ) ) )
            .pipe( gulp.dest('./dist/client/') );

    } else {

        return gulp.src('./dist/client/');

    }

};

function cleanUp () {

    if ( argv.prod ) {

        gulp.src( './dist/client/*.html' ).pipe( gulp.dest('./dist/client/views/pages') )

        return gulp.src( [ './dist/client/*.html', './dist/client/Login.html', './dist/client/js/**/*.js', '!./dist/client/js/core.js', '!./dist/client/js/libs.js', '!./dist/client/js/authApp.js', '!./dist/client/js/authLibs.js', '!./dist/client/js/libs/utils.js' ] )
            .pipe( clean({ force: true }) );

    } else {

        return gulp.src('./dist/client/');

    }

};

//

gulp.task( 'cleanUp', function () {

    return cleanUp();

});

gulp.task( 'finishProdBuild', function () {

    return finishProdBuild();

});

gulp.task( 'buildProd', function () {

    return buildProd();

});

gulp.task( 'resources', function () {

    return buildResources();

});

// JS build

gulp.task( 'js', function () {

    // buildHTML();
    return buildJS();

});

// CSS

gulp.task( 'css', function () {

    return buildCSS();

});

gulp.task( 'sass', function () {

    return buildSASS();

});

// Fonts

gulp.task( 'fonts', function () {

    return buildFonts();

});

// HTML

gulp.task( 'html', function () {

    return buildHTML();

});

gulp.task( 'buildDirectives', function () {

    return buildDirectives();

});

// Bower components

gulp.task( 'bowerComponents', function () {

    return buildBowerComponents();

});

// Server

gulp.task( 'server', function () {

    return buildAndRetartServer();

});

gulp.task( 'serverBuildOnly', function () {

    return buildServer();

});

//

gulp.task( 'build', gulp.series( 'js', 'fonts', 'resources', 'buildDirectives', 'css', 'sass', 'html', 'buildProd', 'finishProdBuild', 'cleanUp', 'serverBuildOnly', function ( done ) {

    done();

}));

gulp.task( 'fullBuild', gulp.series( 'bowerComponents', 'js', 'fonts', 'resources', 'css', 'sass', 'buildDirectives', 'html', 'serverBuildOnly', function ( done ) {

    done();

}));

// Watch

gulp.task( 'watch', function () {

    gulp.watch( './src/client/css/**/*' ).on( 'change', function () { return buildCSS(); });
    gulp.watch( './src/client/css/sass/**/*.scss' ).on( 'change', function () { setTimeout( function () { return buildSASS(); }, 2000 ); });
    gulp.watch( './src/client/**/*.html' ).on( 'change', function () { buildDirectives(); return buildHTML(); });
    gulp.watch( './src/client/js/**/*' ).on( 'change', function () { return buildJS(); });
    gulp.watch( './src/server/**/*' ).on( 'change', function () { return buildAndRetartServer(); });

});
