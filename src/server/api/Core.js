/*
 * @author ohmed
 * API core
*/

var Api = {

    app:            require('./App.js'),
    admin:          require('./Admin.js'),
    company:        require('./Company.js'),
    auth:           require('./Auth.js'),
    employees:      require('./Employees.js'),
    users:          require('./Users.js'),
    contacts:       require('./Contacts.js'),
    dashboard:      require('./Dashboard.js'),
    groups:         require('./Groups.js'),
    teams:          require('./Teams.js'),

    permissions:    require('./ApiPermissions.js')

};

//

module.exports = Api;
