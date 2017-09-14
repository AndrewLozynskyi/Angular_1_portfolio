/*
 * @author ohmed
 * Users service api
*/

var fs = require('fs');
var xlsx = require('xlsx');

var core = require('./../core/employees/Employees.js');

//

var Employees = {};

Employees.create = function ( req, res ) {

    var params = {
        eid:        req.body.eid,
        email:      req.body.email,
        username:   req.body.username,
        password:   'default'
    };

    //

    core.create( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, message: result });

    });

};

Employees.update = function ( req, res ) {

    var eid = + req.body.eid;
    var params = {};

    //

    core.update( eid, params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Employees.remove = function ( req, res ) {

    var eid = + req.query.eid;

    //

    core.remove( eid, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Employees.getList = function ( req, res ) {

    var offset = + req.query.offset;
    var size = + req.query.size;

    core.getList( offset, size, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, message: result.employees });

    });

};

//

module.exports = Employees;
