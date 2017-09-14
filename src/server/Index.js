/*
 * @author ohmed
 * Core server start
*/

var environment;

// Detect environment

environment = require('./config/StageEnvironment.js');

if ( __dirname.indexOf('/hr-tools-local/') !== -1 ) {

    environment = require('./config/LocalEnvironment.js');

}

if ( __dirname.indexOf('/hr-tools-prod/') !== -1 ) {

    environment = require('./config/ProductionEnvironment.js');

}

if ( __dirname.indexOf('/hr-tools-stage/') !== -1 ) {

    environment = require('./config/StageEnvironment.js');

}

global.environment = environment;

//

console.log( '\n\nHR-tools: ' + environment.name + ' service starting.' );

// Setup redis/mongod connections

global.MongoDB = require('./db/mongo/Connection.js');
global.redisDB = require('./db/redis/Connection.js');

// Setup app router

var ServerRouter = require('./Router.js');
ServerRouter.setup();

// Setup Notifications / Alerts managers

var NotificationManager = require('./core/alerts-notifications/Notifications.js');
var AlertsManager = require('./core/alerts-notifications/Alerts.js');

// the end
