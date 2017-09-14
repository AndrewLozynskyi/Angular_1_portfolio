/*
 * @author ohmed
 * Company departments management sys
*/

var DepartmentSchema = require('./../../db/mongo/schemas/Department.js');
var DepartmentModel = MongoDB.mongoose.model( 'Department', DepartmentSchema );

//

var Department = {};

Department.create = function ( name, countryId, countryName, callback ) {

    var country = require('./Countries.js');

    //

    DepartmentModel
    .findOne({
        name:       name,
        countryId:  countryId
    })
    .exec( function ( err, department ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( department ) {

            return callback({ code: 1, message: 'Department with name \'' + name + '\' already exists.' });

        }

        //

        DepartmentModel
        .create({
            name:           name,
            countryName:    countryName,
            countryId:      countryId
        }, function ( err, department ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            country.addDepartment( countryId, { name: name, id: department._id }, function ( err ) {

                if ( err ) {

                    return callback({ code: 0, message: err });

                }

                return callback( null, { countryId: department._id } );

            });

        });

    });

};

Department.remove = function ( departmentIds ) {

    var errors = [];
    var removedDepartments = 0;

    if ( ! departmentIds.length ) {

        return callback( null, { success: true, errors: [] } );

    }

    //

    DepartmentModel
    .find({
        $in: {
            departmentId:   departmentIds
        }
    })
    .exec( function ( err, departments ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! departments.length ) {

            return callback({ code: 1, message: 'No departments found.' });

        }

        //

        for ( var i = 0, il = departments.length; i < il; i ++ ) {

            departments[ i ].remove( function ( err ) {

                removedCountries ++;

                if ( err ) {

                    errors.push({ code: 0, message: err });

                }

                if ( departments.length === removedDepartments ) {

                    return callback( null, { success: true, errors: errors } );

                }

            });

        }

    });

};

Department.update = function () {

    // todo
    callback( null, { success: true } );

};

Department.getList = function ( countriesList, callback ) {

    var query = {};

    if ( countriesList.length ) {

        query.countryName = {
            '$in':  countriesList
        };

    }

    //

    DepartmentModel
    .find( query )
    .exec( function ( err, departments ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var departmentsList = [];
        var departmentsInList = {};

        for ( var i = 0, il = departments.length; i < il; i ++ ) {

            if ( departmentsInList[ departments[ i ].name ] ) continue;
            departmentsInList[ departments[ i ].name ] = 1;

            departmentsList.push({
                // id:     departments[ i ]._id,
                name:   departments[ i ].name
            });

        }

        return callback( null, departmentsList );

    });

};

Department.clear = function ( callback ) {

    DepartmentModel
    .find({})
    .remove( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        return callback( null, { success: true } );

    });

};

//

module.exports = Department;
