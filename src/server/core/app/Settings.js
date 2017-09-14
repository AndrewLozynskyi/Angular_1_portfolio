/*
 * @author ohmed
 * App settings manager
*/

var SettingsSchema = require('./../../db/mongo/schemas/Settings.js');
var SettingsModel = MongoDB.mongoose.model( 'Settings', SettingsSchema );

//

var Settings = {};

Settings.createDefault = function ( callback ) {

    SettingsModel
    .create({}, function ( err ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        return callback( null, { success: true });

    });

};

Settings.getParams = function ( callback ) {

    SettingsModel
    .findOne()
    .exec( function ( err, settings ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! settings ) {

            return callback({ code: 1, message: 'Company settings not found.' });

        }

        //

        var result = {
            alertAndNotifications:  settings.alertAndNotifications,
            userManagement:         settings.userManagement,
            security:               settings.security,
            global:                 settings.global,
            paymentsLogs:           settings.paymentsLogs
        };

        return callback( null, { success: true, settings: result } );

    });

};

Settings.setParams = function ( params, callback ) {

    SettingsModel
    .findOne()
    .exec( function ( err, settings ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! settings ) {

            return callback({ code: 1, message: 'Company settings not found.' });

        }

        //

        params.global = params.global || {};
        params.global.smtpServer = params.global.smtpServer || {};

        settings.global.smtpServer.address = params.global.smtpServer.address;
        settings.global.smtpServer.port = params.global.smtpServer.port;
        settings.global.apiEnabled = params.global.apiEnabled;

        //

        params.security = params.security || {};
        params.security.getNotificationsForStarters = params.security.getNotificationsForStarters || {};
        params.security.requestPGP = params.security.requestPGP || {};

        settings.security.getNotificationsForStarters.enabled = params.security.getNotificationsForStarters.enabled;
        settings.security.getNotificationsForStarters.roles = params.security.getNotificationsForStarters.roles;
        settings.security.requestPGP.enabled = params.security.requestPGP.enabled;
        settings.security.requestPGP.roles = params.security.requestPGP.roles;

        //

        params.userManagement = params.userManagement || {};

        settings.userManagement.loginWithUsername = params.userManagement.loginWithUsername;
        settings.userManagement.loginWithWorkEmail = params.userManagement.loginWithWorkEmail;
        settings.userManagement.showAvatarOnLogIn = params.userManagement.showAvatarOnLogIn;
        settings.userManagement.activateSocialLogin = params.userManagement.activateSocialLogin;
        settings.userManagement.automatedUserManagement = params.userManagement.automatedUserManagement;
        settings.userManagement.forgotPassword = params.userManagement.forgotPassword;
        settings.userManagement.emploeesLeftAccess = params.userManagement.emploeesLeftAccess;
        settings.userManagement.statusFlagsForLeavers = params.userManagement.statusFlagsForLeavers;

        //

        params.alertAndNotifications = params.alertAndNotifications || {};

        settings.alertAndNotifications.sendNotif = params.alertAndNotifications.sendNotif;
        settings.alertAndNotifications.sendEmailNotif = params.alertAndNotifications.sendEmailNotif;
        settings.alertAndNotifications.sendAlerts = params.alertAndNotifications.sendAlerts;
        settings.alertAndNotifications.error500page = params.alertAndNotifications.error500page;
        settings.alertAndNotifications.errorReportingEmail = params.alertAndNotifications.errorReportingEmail;
        settings.alertAndNotifications.errReportingText = params.alertAndNotifications.errReportingText;

        //

        params.paymentsLogs = params.paymentsLogs || {};
        params.paymentsLogs.owner = params.paymentsLogs.owner || {};
        params.paymentsLogs.paymentProcessedBy = params.paymentsLogs.paymentProcessedBy || {};

        settings.paymentsLogs.owner.name = params.paymentsLogs.owner.name;
        settings.paymentsLogs.owner.email = params.paymentsLogs.owner.email;
        settings.paymentsLogs.owner.employeeNumber = params.paymentsLogs.owner.employeeNumber;
        settings.paymentsLogs.paymentProcessedBy.name = params.paymentsLogs.paymentProcessedBy.name;
        settings.paymentsLogs.paymentProcessedBy.email = params.paymentsLogs.paymentProcessedBy.email;
        settings.paymentsLogs.paymentProcessedBy.employeeNumber = params.paymentsLogs.paymentProcessedBy.employeeNumber;

        //

        settings.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { success: true } );

        });

    });

};

//

module.exports = Settings;
