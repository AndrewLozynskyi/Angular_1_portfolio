/*
 * @author ohmed
 * Gulp main file
*/

var gulp = require('gulp');
var reqDir = require('require-dir');

// require all gulp script files

reqDir( './gulp' );

// Default tasks to run

gulp.task( 'default', gulp.series( 'build', 'server', 'watch' ) );
