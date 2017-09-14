/*
 * @author ohmed
 * Users settings management sys
*/

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

//

var Settings = {};

Settings.get = function ( uid, callback ) {

    UserModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id: \'' + uid + '\' not found.' });

        }

        //

        var settings = {
            alerts:             user.settings.alerts,
            notifications:      user.settings.notifications,
            emailNotifications: user.settings.emailNotifications,
            warnings:           user.settings.warnings,
            location:           user.settings.location,
            colorSchemes:       user.settings.colorSchemes,
            currency:           user.settings.currency,
            currencyList:       [
                { name: 'USD', symbol: '$' },
                { name: 'GBP', symbol: '' },
                { name: 'CAD', symbol: '' },
                { name: 'EUR', symbol: '' },
                { name: 'UAH', symbol: '' },
                { name: 'MXN', symbol: '' },
                { name: 'TRY', symbol: '' },
                { name: 'CLP', symbol: '' },
                { name: 'SGD', symbol: '' },
                { name: 'CHF', symbol: '' },
                { name: 'RUB', symbol: '' },
                { name: 'BRL', symbol: '' },
                { name: 'AUD', symbol: '' },
                { name: 'INR', symbol: '' },
                { name: 'JPY', symbol: '' },
                { name: 'IDR', symbol: '' },
                { name: 'SEK', symbol: '' },
                { name: 'KRW', symbol: '' },
                { name: 'NZD', symbol: '' },
            ]
        };

        //

        return callback( null, { success: true, settings: settings } );

    });

};

Settings.set = function ( uid, params, callback ) {

    UserModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, user ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! user ) {

            return callback({ code: 1, message: 'User with id: \'' + uid + '\' not found.' });

        }

        // Alerts settings

        var newAlerts = params.alerts || {};
        var userAlerts = user.settings.alerts || {};

        userAlerts.unrecognizedLogins = ( newAlerts.unrecognizedLogins !== undefined ) ? newAlerts.unrecognizedLogins : userAlerts.unrecognizedLogins;
        userAlerts.userActivationNeeded = ( newAlerts.userActivationNeeded !== undefined ) ? newAlerts.userActivationNeeded : userAlerts.userActivationNeeded;
        userAlerts.wrongFileFormatUploaded = ( newAlerts.wrongFileFormatUploaded !== undefined ) ? newAlerts.wrongFileFormatUploaded : userAlerts.wrongFileFormatUploaded;
        userAlerts.userAccountIsNotActive = ( newAlerts.userAccountIsNotActive !== undefined ) ? newAlerts.userAccountIsNotActive : userAlerts.userAccountIsNotActive;
        userAlerts.userAccountIsNotActiveDuration = ( newAlerts.userAccountIsNotActiveDuration !== undefined ) ? newAlerts.userAccountIsNotActiveDuration : userAlerts.userAccountIsNotActiveDuration;
        userAlerts.systemErrors = ( newAlerts.systemErrors !== undefined ) ? newAlerts.systemErrors : userAlerts.systemErrors;
        userAlerts.criticalFiguresFromTargets = ( newAlerts.criticalFiguresFromTargets !== undefined ) ? newAlerts.criticalFiguresFromTargets : userAlerts.criticalFiguresFromTargets;

        // Notification settings

        var newNotifications = params.notifications || {};
        var userNotifications = user.settings.notifications || {};

        userNotifications.forTargets =  ( newNotifications.forTargets !== undefined ) ? newNotifications.forTargets : userNotifications.forTargets;
        userNotifications.soundOnMessageReceive =  ( newNotifications.soundOnMessageReceive !== undefined ) ? newNotifications.soundOnMessageReceive : userNotifications.soundOnMessageReceive;
        userNotifications.birthdayOfColeagues = ( newNotifications.birthdayOfColeagues !== undefined ) ? newNotifications.birthdayOfColeagues : userNotifications.birthdayOfColeagues;

        // Email notification settings

        var newEmailNotifications = params.emailNotifications || {};
        var userEmailNotifications = user.settings.emailNotifications || {};

        userEmailNotifications.accountSequriteAndPrivacy = ( userEmailNotifications.accountSequriteAndPrivacy !== undefined ) ? newEmailNotifications.accountSequriteAndPrivacy : userEmailNotifications.accountSequriteAndPrivacy;
        userEmailNotifications.subscriptionPeriodEnding = ( userEmailNotifications.subscriptionPeriodEnding !== undefined ) ? newEmailNotifications.subscriptionPeriodEnding : userEmailNotifications.subscriptionPeriodEnding;
        userEmailNotifications.subscriptionPeriod = ( userEmailNotifications.subscriptionPeriod !== undefined ) ? newEmailNotifications.subscriptionPeriod : userEmailNotifications.subscriptionPeriod;

        // Warning settings

        // todo: warnings

        // General settings

        user.settings.location = ( params.location !== undefined ) ? params.location : user.settings.location;
        user.settings.colorSchemes = ( params.colorSchemes !== undefined ) ? params.colorSchemes : user.settings.colorSchemes;

        // Currency

        user.settings.currency = ( params.currency !== undefined ) ? params.currency : user.settings.currency;

        //

        user.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { success: true } );

        });

    });

};

//

module.exports = Settings;
