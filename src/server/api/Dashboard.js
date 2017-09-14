/*
 * @author ohmed
 * Dashboard service api
*/

var fs = require('fs');

//

var Target = require('./../core/dashboard/Target.js');
var Filter = require('./../core/dashboard/Filter.js');

var home = require('./../core/dashboard/Home.js');
var headcount = require('./../core/dashboard/Headcount.js');
var workforce = require('./../core/dashboard/Workforce.js');
var attrition = require('./../core/dashboard/Attrition.js');
var finance = require('./../core/dashboard/Finance.js');
var absences = require('./../core/dashboard/Absences.js');
var resourcing = require('./../core/dashboard/Resourcing.js');
var salary = require('./../core/dashboard/Salary.js');
var eod = require('./../core/dashboard/Eod.js');

//

var Dashboard = {};

// targets

Dashboard.createTarget = function ( req, res ) {

    // todo

};

Dashboard.removeTarget = function ( req, res ) {

    // todo

};

Dashboard.updateTarget = function ( req, res ) {

    // todo

};

Dashboard.uploadTargets = function ( req, res ) {

    // todo

};

Dashboard.getTargetList = function ( req, res ) {

    // todo

};

// filters

Dashboard.createFilter = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var title = req.body.title;
    var params = {};

    //

    if ( ! title ) {

        return res.send({ code: 1, message: 'Filter title shoudn`t be empty.' });

    }

    //

    Filter.create( uid, title, params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, filterId: result.filterId });

    });

};

Dashboard.removeFilter = function ( req, res ) {

    var uid = req.cookies.uid || req.body.uid;
    var filterId = + req.query.filterId;

    //

    Filter.remove( uid, filterId, function ( err ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true });

    });

};

Dashboard.updateFilter = function ( req, res ) {

    // todo

};

Dashboard.getFiltersList = function ( req, res ) {

    var uid = req.cookies.uid || req.query.uid;

    //

    Filter.getList( uid, function ( err, filterList ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( filterList );

    });

};

// Home

Dashboard.getHomeWidgetData = function ( req, res ) {

    home.getWidgetData( function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

// Headcount

Dashboard.getGeneralHeadcountData = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.scopes = req.scopes;

    //

    headcount.getGeneralData( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Dashboard.getHeadcountEmployeesList = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.page = + ( req.query.page || 1 );
    params.itemsPerPage = + ( req.query.itemsPerPage || 10 );
    params.employeeType = req.query.employeeType || 'all';
    params.scopes = req.scopes;

    //

    headcount.getEmployeesList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

// Workforce

Dashboard.getGeneralWorkforceData = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.scopes = req.scopes;

    //

    workforce.getGeneralData( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Dashboard.getWorkforceEmployeesList = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.page = + ( req.query.page || 1 );
    params.itemsPerPage = + ( req.query.itemsPerPage || 10 );
    params.employeeType = req.query.employeeType || 'all';
    params.scopes = req.scopes;

    //

    workforce.getEmployeesList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

// Attrition

Dashboard.getGeneralAttritionData = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.scopes = req.scopes;

    //

    attrition.getGeneralData( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Dashboard.getAttritionEmployeesList = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.page = + ( req.query.page || 1 );
    params.itemsPerPage = + ( req.query.itemsPerPage || 10 );
    params.employeeType = req.query.employeeType || 'all';
    params.scopes = req.scopes;

    //

    attrition.getEmployeesList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

// Salary

Dashboard.getGeneralSalaryData = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.scopes = req.scopes;

    //

    salary.getGeneralData( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Dashboard.getSalaryEmployeesList = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.page = + ( req.query.page || 1 );
    params.itemsPerPage = + ( req.query.itemsPerPage || 10 );
    params.scopes = req.scopes;

    //

    salary.getEmployeesList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

// Finance

Dashboard.getGeneralFinanceData = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.scopes = req.scopes;

    //

    finance.getGeneralData( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Dashboard.getFinanceEmployeesList = function ( req, res ) {

    var params = {};
    params.date = { year: ( req.query.year !== undefined ) ? + req.query.year : 2015, month: ( req.query.month !== undefined ) ? + req.query.month : 1, day: ( req.query.day !== undefined && req.query.day !== 'false' ) ? + req.query.day : false };
    params.countries = ( req.query.countries ) ? req.query.countries.split('|') : [];
    params.departments = ( req.query.departments ) ? req.query.departments.split('|') : [];
    params.page = + ( req.query.page || 1 );
    params.itemsPerPage = + ( req.query.itemsPerPage || 10 );
    params.queryParam = params.queryParam;
    params.scopes = req.scopes;

    //

    finance.getEmployeesList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

//

module.exports = Dashboard;
