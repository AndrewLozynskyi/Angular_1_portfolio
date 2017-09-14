/*
 * @author ohmed
 * Company service api
*/

var xlsx = require('xlsx');

var core = require('./../core/company/Company.js');
var countries = require('./../core/company/Countries.js');
var departments = require('./../core/company/Departments.js');

//

var Company = {};

Company.uploadDashboardCover = function ( req, res ) {

    var cover = req.body.cover.replace( /^data:image\/png;base64,/, '' );

    if ( ! cover ) {

        return res.send({ code: 0, message: 'Userpic image file not specified.' });

    }

    //

    core.uploadDashboardCover( cover, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

Company.uploadLogo = function ( req, res ) {

    var logo = req.body.logo.replace( /^data:image\/png;base64,/, '' );

    if ( ! logo ) {

        return res.send({ code: 0, message: 'Userpic image file not specified.' });

    }

    //

    core.uploadLogo( logo, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result );

    });

};

Company.importMainDataset = function ( req, res ) {

    if ( ! req.files.length || ! req.files[0].path ) {

        return res.send({ code: 0, message: 'Main dataset file not specified.' });

    }

    var path = req.files[0].path;
    var sheet = xlsx.readFile( path );
    var json = xlsx.utils.sheet_to_json( sheet.Sheets.Sheet1 );

    core.importMainDataset( json, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

Company.getCountriesList = function ( req, res ) {

    countries.getList( function ( err, countryList ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, countries: countryList });

    });

};

Company.getDepartmentsList = function ( req, res ) {

    var countryList = ( req.query.countryList ) ? req.query.countryList.split('|') : [];

    //

    departments.getList( countryList, function ( err, departmentsList ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ success: true, departments: departmentsList });

    });

};

//

module.exports = Company;
