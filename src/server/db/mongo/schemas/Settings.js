/*
 * @author ohmed
 * Company settings schema
*/

var Schema = MongoDB.mongoose.Schema;

//

var SettingsSchema = new Schema({

    global:     {
        smtpServer:     {
            address:    { type: String, default: '' },
            port:       { type: Number, default: 443 }
        },
        apiEnabled:     { type: Boolean, default: false }
    },

    security:   {
        getNotificationsForStarters: {
            enabled:    { type: Boolean, default: false },
            roles:      [ Number ]
        },
        requestPGP: {
            enabled:    { type: Boolean, default: false },
            roles:      [ Number ]
        }
    },

    userManagement:     {
        loginWithUsername:          { type: Boolean, default: true },
        loginWithWorkEmail:         { type: Boolean, default: true },
        showAvatarOnLogIn:          { type: Boolean, default: true },
        activateSocialLogin:        { type: Boolean, default: true },
        automatedUserManagement:    Object,
        forgotPassword:             { type: Boolean, default: true },
        emploeesLeftAccess:         { type: Boolean, default: false },
        statusFlagsForLeavers:      {
            voluntaryLeave:         String,
            gardenLeave:            String,
            maternityLeave:         String
        }
    },

    alertAndNotifications:  {
        sendNotif:              { type: Boolean, default: true },
        sendEmailNotif:         { type: Boolean, default: false },
        sendAlerts:             { type: Boolean, default: false },
        error500page:           { type: Boolean, default: true },
        errorReportingEmail:    { type: String, default: '' },
        errReportingText:       { type: String, default: '' }
    },

    paymentsLogs:   {
        owner: {
            name:               { type: String, default: '' },
            email:              { type: String, default: '' },
            employeeNumber:     { type: String, default: '' }
        },
        paymentProcessedBy: {
            name:               { type: String, default: '' },
            email:              { type: String, default: '' },
            employeeNumber:     { type: String, default: '' }
        }
    },

    //

    __v: { type: Number, select: false }

});

//

module.exports = SettingsSchema;
