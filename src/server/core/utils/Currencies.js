/*
 * @author ohmed
 * Currencies management
*/

var CurrenciesSchema = require( './../../db/mongo/schemas/Currencies.js' );
var CurrenciesModel = MongoDB.mongoose.model( 'Currencies', CurrenciesSchema );

var http = require('http');

//

var Currencies = {
    base:   'USD',
    list:   [ 'USD', 'GBP', 'CAD', 'EUR', 'UAH', 'MXN', 'TRY','CLP','SGD','CHF','RUB','BRL','AUD','INR', 'JPY', 'IDR', 'SEK', 'KRW', 'NZD' ],
    cache:  false
};

//

Currencies.get = function ( baseCurrency ) {

    baseCurrency = baseCurrency || 'USD';
    var result = {};
    var currencies = Currencies.cache;

    for ( var curName in currencies ) {

        result[ curName ] = currencies[ curName ] / currencies[ baseCurrency ];

    }

    return result;

};

Currencies.getFromDBToCache = function () {

    CurrenciesModel
    .find()
    .exec( function ( err, currencies ) {

        if ( err ) {

            // return callback({ code: 0, message: err });
            return;

        }

        //

        var result = {};

        for ( var i = 0, il = currencies.length; i < il; i ++ ) {

            result[ currencies[ i ].name ] = currencies[ i ].value;

        }

        Currencies.cache = result;

    });

};

Currencies.update = function ( callback ) {

    getData( function ( err, data ) {

        if ( err ) {

            return callback( err );

        }

        //

        clearData( function ( err ) {

            if ( err ) {

                return callback( err );

            }

            //

            saveData( data, function ( err ) {

                if ( err ) {

                    return callback( err );

                }

                //

                Currencies.getFromDBToCache();
                return callback( null, { success: true } );

            });

        });

    });

};

Currencies.update( function () {} );

// internal

function clearData ( callback ) {

    CurrenciesModel
    .find({})
    .remove( function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        return callback( null, { success: true } );

    });

};

function getData ( callback ) {

    var options = {
        host: 'www.apilayer.net',
        path: '/api/live?access_key=9e20292cad261890a5c63d286bea9460&format=1'
    };

    http.request( options, function ( response ) {

        var result = '';
        var data = [];

        response.on( 'data', function ( chunk ) {

            result += chunk;

        });

        response.on( 'end', function () {

            result = JSON.parse( result );

            for ( var i = 0, il = Currencies.list.length; i < il; i ++ ) {

                data.push({
                    name:   Currencies.list[ i ],
                    value:  result.quotes[ Currencies.base + Currencies.list[ i ] ]
                });

            }

            return callback( null, data );
        
        });

    }).end();

};

function saveData ( data, callback ) {

    CurrenciesModel.create( data, function ( err ) {

        if ( err ) {

            return callback( err );

        }

        //

        return callback( null, { success: true } );

    });

};

//

module.exports = Currencies;
