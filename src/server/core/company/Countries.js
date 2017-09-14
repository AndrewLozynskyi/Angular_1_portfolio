/*
 * @author ohmed
 * Company countries management sys
*/

var CountrySchema = require('./../../db/mongo/schemas/Country.js');
var CountryModel = MongoDB.mongoose.model( 'Country', CountrySchema );

var department = require('./Departments.js');

//

var Country = {};

Country.create = function ( name, callback ) {

    CountryModel
    .findOne({
        name:   name
    })
    .exec( function ( err, country ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( country ) {

            return callback({ code: 1, message: 'Country with name \'' + name + '\' already exists.' });

        }

        //

        CountryModel
        .create({
            name:       name
        }, function ( err, country ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { countryId: country._id, name: name } );

        });

    });

};

Country.remove = function ( countryIds ) {

    var errors = [];
    var removedCountries = 0;

    if ( ! countryIds.length ) {

        return callback( null, { success: true, errors: [] } );

    }

    //

    CountryModel
    .find({
        $in: {
            countryId:   countryIds
        }
    })
    .exec( function ( err, countries ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! countries.length ) {

            return callback({ code: 1, message: 'No countries found.' });

        }

        //

        for ( var i = 0, il = countries.length; i < il; i ++ ) {

            department.remove( countries[ i ].departments );

            countries[ i ].remove( function ( err ) {

                removedCountries ++;

                if ( err ) {

                    errors.push({ code: 0, message: err });

                }

                if ( countries.length === removedCountries ) {

                    return callback( null, { success: true, errors: errors } );

                }

            });

        }

    });

};

Country.update = function () {

    // todo
    callback( null, { success: true } );

};

Country.addDepartment = function ( countryId, department, callback ) {

    CountryModel
    .findOne({
        _id:   countryId
    })
    .exec( function ( err, country ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! country ) {

            return callback({ code: 1, message: 'Country with id \'' + countryId + '\' already exists.' });

        }

        //

        country.departments.push( department );

        country.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { success: true } );

        });

    });

};

Country.getList = function ( callback ) {

    CountryModel
    .find()
    .exec( function ( err, countries ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        //

        var countriesList = [];

        for ( var i = 0, il = countries.length; i < il; i ++ ) {

            countriesList.push({
                id:     countries[ i ]._id,
                name:   countries[ i ].name
            });

        }

        return callback( null, countriesList );

    });

};

Country.clear = function ( callback ) {

    department.clear( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        CountryModel
        .find({})
        .remove( function ( err ) {

            if ( err ) {

                return callback( err );

            }

            return callback( null, { success: true } );

        });

    });

};

//

module.exports = Country;
