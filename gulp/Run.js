/*
 * @author ohmed
 * Gulp project start file
*/

var gulp = require('gulp');
var argv = require('yargs').argv;
var spawn = require('child_process').spawn;

var nodeProcess;

// RUN

gulp.task( 'run', gulp.series( 'resources', 'js', 'html', 'css', 'sass', 'server', function ( done ) {

    restartServer();
    done();

}));

gulp.task( 'runOnly', function ( done ) {

    restartServer();
    done();

});

//

function restartServer () {

    if ( nodeProcess ) nodeProcess.kill();

    nodeProcess = spawn( 'node', [ './dist/server/Index.js' ], { stdio: 'inherit' } );

    nodeProcess.on( 'close', function ( code ) {

        if ( code === 8 ) {

            gulp.log( 'Error detected, waiting for changes...' );

        }

    });

};

global.restartServer = restartServer;

process.on( 'exit', function () {

    if ( nodeProcess ) nodeProcess.kill();

});
