/*
 * @author ohmed
 * Roles entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var RoleSchema = new Schema({

    name:               { type: String, unique: true, required: true },
    description:        { type: String, default: '' },
    permanent:          { type: Boolean, default: false },

    permissions: {

        accounts: {
            moduleEnabled:              { type: Boolean, default: false },
            user: {
                create:                 { type: Boolean, default: false },
                validate:               { type: Boolean, default: false },
                deactivate:             { type: Boolean, default: false },
                viewProfileOwnInfo:     { type: Boolean, default: false },
                viewInformation:        { type: Boolean, default: false },
                editProfileOwnInfo:     { type: Boolean, default: false },
                editProfileInfo:        { type: Boolean, default: false },
                deleteProfileOwnInfo:   { type: Boolean, default: false },
                deleteProfileInfo:      { type: Boolean, default: false },
                login:                  { type: Boolean, default: false },
                sendInvites:            { type: Boolean, default: false },
                activateNotif:          { type: Boolean, default: false }
            },
            custumer: {
                create:                 { type: Boolean, default: false },
                stop:                   { type: Boolean, default: false },
                freeze:                 { type: Boolean, default: false },
                updateProfile:          { type: Boolean, default: false },
                viewPaymentLogs:        { type: Boolean, default: false },
                viewOwnPaymentLogs:     { type: Boolean, default: false },
                enterViewModifyData:    { type: Boolean, default: false },
                deleteProfileData:      { type: Boolean, default: false },
                login:                  { type: Boolean, default: false },
                getActivitesAlerts:     { type: Boolean, default: false },
                activeNotif:            { type: Boolean, default: false }
            }
        },
        activities: {
            moduleEnabled:          { type: Boolean, default: false },
            view:                   { type: Boolean, default: false },
            activateNotif:          { type: Boolean, default: false },
            activateAlerts:         { type: Boolean, default: false }
        },
        sharingData: {
            moduleEnabled:          { type: Boolean, default: false },
            enabled:                { type: Boolean, default: false },
            activateNotif:          { type: Boolean, default: false },
            activateAlerts:         { type: Boolean, default: false }
        },
        planSelectorInvoicing: {
            moduleEnabled:          { type: Boolean, default: false },
            stopSubscriptions:      { type: Boolean, default: false },
            changeSubscription:     { type: Boolean, default: false },
            activateEmailSubsNotif: { type: Boolean, default: false },
            activateNotif:          { type: Boolean, default: false },
            activateAlerts:         { type: Boolean, default: false }
        },
        dashboard: {
            moduleEnabled:          { type: Boolean, default: false },
            activateNotif:          { type: Boolean, default: false },
            activateAlerts:         { type: Boolean, default: false },
            home: {
                weatherWidget:      { type: Boolean, default: false },
                tasksWidget:        { type: Boolean, default: false },
                calendarWidget:     { type: Boolean, default: false },
                activitiesWidget:   { type: Boolean, default: false },
                headcountWidget:    { type: Boolean, default: false },
                workforceWidget:    { type: Boolean, default: false },
                attritionWidget:    { type: Boolean, default: false },
                financeWidget:      { type: Boolean, default: false },
                salaryWidget:       { type: Boolean, default: false },
                resourcingWidget:   { type: Boolean, default: false },
                absencesWidget:     { type: Boolean, default: false },
                eodWidget:          { type: Boolean, default: false },
                setTarget:          { type: Boolean, default: false },
                setFilter:          { type: Boolean, default: false }
            },
            headcount: {
                donutWidget:        { type: Boolean, default: false },
                mapWidget:          { type: Boolean, default: false },
                headcountTable:     { type: Boolean, default: false },
                departmentsTable:   { type: Boolean, default: false },
                employeeTable:      { type: Boolean, default: false },
                generalChart:       { type: Boolean, default: false }
            },
            workforce: {
                donutWidget:        { type: Boolean, default: false },
                mapWidget:          { type: Boolean, default: false },
                headcountTable:     { type: Boolean, default: false },
                pieChart:           { type: Boolean, default: false },
                departmentsTable:   { type: Boolean, default: false },
                generalChart:       { type: Boolean, default: false }
            }
        },
        userProfile: {
            moduleEnabled:              { type: Boolean, default: false },
            view:                       { type: Boolean, default: false },
            editOwnInfo:                { type: Boolean, default: false },
            editUserInfo:               { type: Boolean, default: false },
            save:                       { type: Boolean, default: false },
            allowOtherViewOwnInfo:      { type: Boolean, default: false },
            allowOtherViewUserOwnInfo:  { type: Boolean, default: false },
            addContacts:                { type: Boolean, default: false },
            followUsers:                { type: Boolean, default: false },
            sendMessage:                { type: Boolean, default: false },
            sendInvites:                { type: Boolean, default: false },
            viewOwnTeams:               { type: Boolean, default: false },
            viewOtherTeams:             { type: Boolean, default: false },
            activateNotif:              { type: Boolean, default: false },
            activateAlerts:             { type: Boolean, default: false }
        },
        contacts: {
            moduleEnabled:          { type: Boolean, default: false },
            createGroups:           { type: Boolean, default: false },
            addUserToGroup:         { type: Boolean, default: false },
            removeUserFromGroup:    { type: Boolean, default: false },
            sendContactsInvites:    { type: Boolean, default: false },
            sendGroupInvites:       { type: Boolean, default: false },
            activateNotif:          { type: Boolean, default: false },
            activateAlerts:         { type: Boolean, default: false }
        },
        chat: {
            moduleEnabled:          { type: Boolean, default: false },
            createGroups:           { type: Boolean, default: false },
            addUserToGroup:         { type: Boolean, default: false },
            activateNotif:          { type: Boolean, default: false },
            activateAlerts:         { type: Boolean, default: false }
        },
        admin: {
            moduleEnabled:                  { type: Boolean, default: false },
            createRoles:                    { type: Boolean, default: false },
            createRolesBasedOnOtherRoles:   { type: Boolean, default: false },
            home: {
                rolesWidget:                { type: Boolean, default: false },
                clientWidget:               { type: Boolean, default: false },
                userWidget:                 { type: Boolean, default: false },
                permissionsWidget:          { type: Boolean, default: false },
                liveSupportWidget:          { type: Boolean, default: false },
                alertNotifWidget:           { type: Boolean, default: false },
                paymentsLogsWidget:         { type: Boolean, default: false },
                todoWidget:                 { type: Boolean, default: false }
            },
            permissions: {
                edit: { type: Boolean, default: false },
            },
            settings: {
                edit: { type: Boolean, default: false }
            },
            userManagement: {
                create:                     { type: Boolean, default: false },
                delete:                     { type: Boolean, default: false },
                update:                     { type: Boolean, default: false },
                assignUserToSuperUserRole:  { type: Boolean, default: false },
                assignUserToOtherRoles:     { type: Boolean, default: false },
                createGroups:               { type: Boolean, default: false }
            },
            activitiesOnServer: {},
            alertNotif:         {},
            paymentLogs: {
                setOwner:               { type: Boolean, default: false },
                viewDetailes:           { type: Boolean, default: false },
                makePayment:            { type: Boolean, default: false },
                viewCustomerDetails:    { type: Boolean, default: false },
                activateNotif:          { type: Boolean, default: false },
                activateAlerts:         { type: Boolean, default: false }
            }
        },
        api: {
            moduleEnabled:      { type: Boolean, default: false },
            activateNotif:      { type: Boolean, default: false },
            activateAlerts:     { type: Boolean, default: false }
        },
        onOffBoarding: {
            moduleEnabled:      { type: Boolean, default: false },
            activateNotif:      { type: Boolean, default: false },
            activateAlerts:     { type: Boolean, default: false }
        }

    },

    scope: {
        basedOn:        { type: String, default: 'hierarchy' },
        countries:      {}
    },
    users:              [],
    groups:             [],

    //

    __v: { type: Number, select: false }

});

//

autoIncrement.initialize( MongoDB.connection );
RoleSchema.plugin( autoIncrement.plugin, {
    model: 'Role',
    field: 'roleId'
});

//

module.exports = RoleSchema;
