/*
 * @author volmat
 * Default roles list
*/

var DefaultRoles = {

    SuperAdmin:     require('./SuperAdmin.js'),
    SuperUser:      require('./SuperUser.js'),
    HR:             require('./HR.js'),
    Finance:        require('./Finance.js'),
    Employee:       require('./Employee.js'),
    Manager:        require('./Manager.js'),
    DCHead:         require('./DCHead.js')

};

//

module.exports = DefaultRoles;
