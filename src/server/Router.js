/*
 * @author ohmed
 * Server router list
*/

var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var passport = require('passport');
var expressSession = require('express-session');
var path = require('path');
var nunjucks = require('nunjucks');

var MongoStore = require('connect-mongo')( expressSession );
var mongooseConnection = require('./db/mongo/Connection.js').connection;

//

var api = require('./api/Core.js');
var SocketNetwork = require('./core/alerts-notifications/SocketNetwork.js');
var auth = require('./core/auth/Auth.js');

// Setup express server

var expressAPP = express()
    .use( cookieParser() )
    .use( multer({ dest: __dirname + '/uploads' }).any() )
    .use( bodyParser.urlencoded({ extended: true }))
    .use( bodyParser.json({ limit: '10mb' }) )
    .use( passport.initialize() )
    .use( passport.session() )
    .use( expressSession({
        secret: 'secret',
        store: new MongoStore({ mongooseConnection: mongooseConnection }),
        resave: false,
        saveUninitialized: true
    }));

// Passport auth

passport.serializeUser( function ( user, done ) {

    done( null, user );

});

passport.deserializeUser( function ( user, done ) {

    done( null, user );

});

//

var Router = {};

Router.setup = function () {

    Router.setupSocketNetwork();
    Router.setupApi();
    Router.setupStatic();

};

Router.setupStatic = function () {

    // Using nunjacks for templates serverside permissions applying

    nunjucks.configure( path.resolve( __dirname + '/../client/views' ), {
        express:    expressAPP,
        autoescape: true,
        tags: {
            blockStart: '<%',
            blockEnd: '%>',
            variableStart: '<$',
            variableEnd: '$>',
            commentStart: '<#',
            commentEnd: '#>'
        },
        watch:  true
    });

    //

    expressAPP.get('/views/*', function ( req, res ) {

        var uid = req.body.uid || req.query.uid || req.cookies.uid;
        var session = req.body.session || req.query.session || req.cookies.session;

        auth.checkSesson( uid, session, function ( err, data ) {

            if ( err ) {

                return res.redirect('/login');

            }

            res.render( req.url.replace('/views/', ''), { user: data.user, permissions: data.permissions } );

        });

    });

    //

    var getIndex = function ( req, res ) {

        var uid = req.body.uid || req.query.uid || req.cookies.uid;
        var session = req.body.session || req.query.session || req.cookies.session;

        auth.checkSesson( uid, session, function ( err, data ) {

            if ( err ) {

                return res.redirect('/login');

            }

            //

            res.render( 'pages/Index.html', { user: data.user, permissions: data.permissions } );

        });

    };

    expressAPP.get( '/', getIndex );

    expressAPP.use( '/login', express.static( __dirname + '/../client/views/pages/Login.html' ) );
    expressAPP.use( express.static( __dirname + '/../client/' ) );

    expressAPP.get( '/usersData/*', function ( req, res ) {

        if ( fs.existsSync( __dirname + req.originalUrl ) ) {

            return res.sendFile( __dirname + req.originalUrl );

        } else {

            res.status( 404 );
            return res.send();

        }

    });

    //

    expressAPP.use( '/dashboard', Router.setupPermissionChecks );
    expressAPP.use( '/dashboard/*', Router.setupPermissionChecks );

    expressAPP.use( '/profile', Router.setupPermissionChecks );
    expressAPP.use( '/profile/*', Router.setupPermissionChecks );

    expressAPP.use( '/admin', Router.setupPermissionChecks );
    expressAPP.use( '/admin/*', Router.setupPermissionChecks );

    expressAPP.use( '/chat', Router.setupPermissionChecks );
    expressAPP.use( '/chat/*', Router.setupPermissionChecks );

    expressAPP.use( '/boarding', Router.setupPermissionChecks );
    expressAPP.use( '/boarding/*', Router.setupPermissionChecks );

    expressAPP.use( '/api', Router.setupPermissionChecks );
    expressAPP.use( '/api/*', Router.setupPermissionChecks );

    expressAPP.use( '/dashboard', getIndex );
    expressAPP.use( '/dashboard/*', getIndex );

    expressAPP.use( '/profile', getIndex );
    expressAPP.use( '/profile/*', getIndex );

    expressAPP.use( '/contacts', getIndex );

    expressAPP.use( '/admin', getIndex );
    expressAPP.use( '/admin/*', getIndex );

    expressAPP.use( '/chat', getIndex );
    expressAPP.use( '/chat/*', getIndex );

    expressAPP.use( '/boarding', getIndex );
    expressAPP.use( '/boarding/*', getIndex );

    expressAPP.use( '/api', getIndex );
    expressAPP.use( '/api/*', getIndex );

    expressAPP.use( '/*', getIndex );

};

Router.setupApi = function () {

    // auth

    expressAPP.post( '/api/auth/login', api.auth.login );
    expressAPP.post( '/api/auth/register', api.auth.register );

    expressAPP.get( '/api/auth/logout', api.auth.logout );

    expressAPP.get( '/api/auth/loginfb', api.auth.loginfb() );
    expressAPP.get( '/api/auth/loginfbcb', api.auth.loginfbcb );

    expressAPP.get( '/api/auth/loginli', api.auth.loginli() );
    expressAPP.get( '/api/auth/loginlicb', api.auth.loginlicb );

    expressAPP.get( '/api/auth/logingg', api.auth.logingg() );
    expressAPP.get( '/api/auth/loginggcb', api.auth.loginggcb );

    expressAPP.get( '/api/auth/ifUserExists', api.auth.ifUsernameExists );

    // dashboard

    expressAPP.use( '/api/dashboard', Router.setupPermissionChecks );
    expressAPP.use( '/api/dashboard/*', Router.setupPermissionChecks, api.users.getScope );

    // dashboard: home

    expressAPP.get( '/api/dashboard/home/getWidgetData', api.dashboard.getHomeWidgetData );

    // dashboard: headcount

    expressAPP.get( '/api/dashboard/headcount/getGeneralData', api.dashboard.getGeneralHeadcountData );
    expressAPP.get( '/api/dashboard/headcount/getEmployeesList', api.dashboard.getHeadcountEmployeesList );

    // dashboard: workforce

    expressAPP.get( '/api/dashboard/workforce/getGeneralData', api.dashboard.getGeneralWorkforceData );
    expressAPP.get( '/api/dashboard/workforce/getEmployeesList', api.dashboard.getWorkforceEmployeesList );

    // dashboard: attrition

    expressAPP.get( '/api/dashboard/attrition/getGeneralData', api.dashboard.getGeneralAttritionData );
    expressAPP.get( '/api/dashboard/attrition/getEmployeesList', api.dashboard.getAttritionEmployeesList );

    // dashboard: salary

    expressAPP.get( '/api/dashboard/salary/getGeneralData', api.dashboard.getGeneralSalaryData );
    expressAPP.get( '/api/dashboard/salary/getEmployeesList', api.dashboard.getSalaryEmployeesList );

    // dashboard: finance

    expressAPP.get( '/api/dashboard/finance/getGeneralData', api.dashboard.getGeneralFinanceData );
    expressAPP.get( '/api/dashboard/finance/getEmployeesList', api.dashboard.getFinanceEmployeesList );

    // dashboard: filters

    expressAPP.post( '/api/dashboard/filters/create', api.dashboard.createFilter );
    expressAPP.get( '/api/dashboard/filters/remove', api.dashboard.removeFilter );
    expressAPP.post( '/api/dashboard/filters/update', api.dashboard.updateFilter );
    expressAPP.get( '/api/dashboard/filters/getList', api.dashboard.getFiltersList );

    // dashboard: targets

    expressAPP.post( '/api/dashboard/targets/create', api.dashboard.createTarget );
    expressAPP.get( '/api/dashboard/targets/remove', api.dashboard.removeTarget );
    expressAPP.post( '/api/dashboard/targets/update', api.dashboard.updateTarget );
    expressAPP.get( '/api/dashboard/targets/getList', api.dashboard.getTargetList );

    // teams

    expressAPP.use( '/api/teams/*', Router.setupPermissionChecks );

    expressAPP.get( '/api/teams/getList', api.teams.getList );
    expressAPP.get( '/api/teams/getDetails', api.teams.getDetails );
    expressAPP.get( '/api/teams/getEmployees', api.teams.getEmployees );

    // roles

    expressAPP.use( '/api/roles/*', Router.setupPermissionChecks );

    expressAPP.get( '/api/roles/createDefault', api.app.roles.createDefault );
    expressAPP.post( '/api/roles/create', api.app.roles.create );
    expressAPP.get( '/api/roles/remove', api.app.roles.remove );
    expressAPP.post( '/api/roles/updateGeneral', api.app.roles.updateGeneral );
    expressAPP.post( '/api/roles/updatePermissions', api.app.roles.updatePermissions );
    expressAPP.post( '/api/roles/updateScope', api.app.roles.updateScope );
    expressAPP.get( '/api/roles/getList', api.app.roles.getList );
    expressAPP.get( '/api/roles/getDetailes', api.app.roles.getDetailes );
    expressAPP.get( '/api/roles/getUsers', api.app.roles.getUsers );
    expressAPP.get( '/api/roles/getGroups', api.app.roles.getGroups );

    // employees

    expressAPP.use( '/api/employees/*', Router.setupPermissionChecks );

    expressAPP.post( '/api/employees/create', api.employees.create );
    expressAPP.get( '/api/employees/remove', api.employees.remove );
    expressAPP.post( '/api/employees/update', api.employees.update );

    // users

    expressAPP.use( '/api/users/*', Router.setupPermissionChecks );

    expressAPP.post( '/api/users/create', api.users.create );
    expressAPP.get( '/api/users/remove', api.users.remove );
    expressAPP.post( '/api/users/update', api.users.update );
    expressAPP.get( '/api/users/getList', api.users.getList );
    expressAPP.post( '/api/users/addRole', api.users.addRole );
    expressAPP.post( '/api/users/removeRole', api.users.removeRole );
    expressAPP.get( '/api/users/getGeneralStatsInfo', api.users.getGeneralStatsInfo );
    expressAPP.get( '/api/users/getRolePermissionsUpdateToken', api.users.getRolePermissionsUpdateToken );
    expressAPP.get( '/api/users/isRolePermissionsUpdateTokenValid', api.users.isRolePermissionsUpdateTokenValid );
    expressAPP.get( '/api/users/updateSupervisorsRoles', api.users.updateSupervisorsRoles );
    expressAPP.post( '/api/users/updateProfileInfo', api.users.updateProfileInfo );
    expressAPP.post( '/api/users/setActivationStatus', api.users.setActivationStatus );
    expressAPP.post( '/api/users/setStatus', api.users.setStatus );
    expressAPP.post( '/api/users/setUserpic', api.users.setUserpic );
    expressAPP.post( '/api/users/removeUserpic', api.users.removeUserpic );

    // users:profile

    expressAPP.get( '/api/users/profile/getInfo', api.users.profile.getInfo );
    expressAPP.post( '/api/users/profile/updateGeneralInfo', api.users.profile.updateGeneralInfo );
    expressAPP.post( '/api/users/profile/updateContactsInfo', api.users.profile.updateContactsInfo );
    expressAPP.post( '/api/users/profile/updateSocialLinksInfo', api.users.profile.updateSocialLinksInfo );
    expressAPP.post( '/api/users/profile/updateJobSkills', api.users.profile.updateJobSkills );
    expressAPP.post( '/api/users/profile/addSocialNetwork', api.users.profile.addSocialNetwork );
    expressAPP.post( '/api/users/profile/addCourse', api.users.profile.addCourse );
    expressAPP.post( '/api/users/profile/removeCourse', api.users.profile.removeCourse );

    // user: settings

    expressAPP.get( '/api/users/settings/get', api.users.settings.get );
    expressAPP.post( '/api/users/settings/set', api.users.settings.set );

    // company

    expressAPP.use( '/api/company/*', Router.setupPermissionChecks );

    expressAPP.post( '/api/company/uploadDashboardCover', api.company.uploadDashboardCover );
    expressAPP.post( '/api/company/uploadLogo', api.company.uploadLogo );
    expressAPP.get( '/api/company/getCountriesList', api.company.getCountriesList );
    expressAPP.get( '/api/company/getDepartmentsList', api.company.getDepartmentsList );
    expressAPP.post( '/api/company/importMainDataset', api.company.importMainDataset );

    // contacts

    expressAPP.use( '/api/contacts/*', Router.setupPermissionChecks );

    expressAPP.get( '/api/contacts/getList', api.contacts.getContactsList );
    expressAPP.post( '/api/contacts/add', api.contacts.addContact );
    expressAPP.post( '/api/contacts/remove', api.contacts.removeContact );
    expressAPP.post( '/api/contacts/follow', api.contacts.follow );
    expressAPP.post( '/api/contacts/unfollow', api.contacts.unfollow );
    expressAPP.get( '/api/contacts/getGeneralStatsInfo', api.contacts.getGeneralStatsInfo );

    // contacts: groups

    expressAPP.get( '/api/contacts/groups/getList', api.contacts.groups.getList );
    expressAPP.post( '/api/contacts/groups/create', api.contacts.groups.create );
    expressAPP.post( '/api/contacts/groups/remove', api.contacts.groups.remove );
    expressAPP.post( '/api/contacts/groups/addContacts', api.contacts.groups.addContacts );
    expressAPP.post( '/api/contacts/groups/removeContacts', api.contacts.groups.removeContacts );

    // groups

    expressAPP.use( '/api/groups/*', Router.setupPermissionChecks );

    expressAPP.post( '/api/groups/create', api.groups.create );
    expressAPP.post( '/api/groups/update', api.groups.update );
    expressAPP.get( '/api/groups/remove', api.groups.remove );
    expressAPP.post( '/api/groups/addUsers', api.groups.addUsers );
    expressAPP.post( '/api/groups/removeUsers', api.groups.removeUsers );
    expressAPP.get( '/api/groups/getList', api.groups.getList );
    expressAPP.post( '/api/groups/addRole', api.groups.addRole );
    expressAPP.post( '/api/groups/removeRole', api.groups.removeRole );
    expressAPP.get( '/api/groups/createDefault', api.groups.createDefault );

    // admin

    expressAPP.use( '/api/admin/*', Router.setupPermissionChecks );

    expressAPP.get( '/api/admin/getGeneralData', api.admin.getGeneralData );

    // app: settings

    expressAPP.use( '/api/settings/*', Router.setupPermissionChecks );

    expressAPP.get( '/api/settings/createDefault', api.app.settings.createDefault );
    expressAPP.get( '/api/settings/get', api.app.settings.getParams );
    expressAPP.post( '/api/settings/set', api.app.settings.setParams );

    // app

    expressAPP.get( '/api/app/restart', api.app.shutdown );

};

Router.setupSocketNetwork = function () {

    this.socketNetwork = new SocketNetwork( expressAPP );

};

Router.setupPermissionChecks = function ( req, res, next ) {

    var uid = req.body.uid || req.query.uid || req.cookies.uid;
    var session = req.body.session || req.query.session || req.cookies.session;

    auth.checkSesson( uid, session, function ( err, data ) {

        if ( err ) {

            return res.redirect('/login');

        }

        next();

    });

};

//

expressAPP.listen( environment.web.port );

console.log( 'HR-tools: Web app service started.' );

//

module.exports = Router;
