/*
 * @author ohmed
 * Home logic
*/

var Home = {};

Home.getWidgetData = function ( callback ) {

    var result = {
        headcountWidgetData:    false,
        workforceWidgetData:    false,
        attritionWidgetData:    false,
        salaryWidgetData:       false,
        financeWidgetData:      false
    };

    //

    getHeadcountData( function ( err, data ) {

        if ( err ) return callback( err );
        result.headcountWidgetData = data;

        getWorkforceData( function ( err, data ) {

            if ( err ) return callback( err );
            result.workforceWidgetData = data;

            getAttritionData( function ( err, data ) {

                if ( err ) return callback( err );
                result.attritionWidgetData = data;

                getSalaryData( function ( err, data ) {

                    if ( err ) return callback( err );
                    result.salaryWidgetData = data;

                    getFinanceData( function ( err, data ) {

                        if ( err ) return callback( err );
                        result.financeWidgetData = data;

                        return callback( null, result );

                    });

                });

            });

        });

    });

};

// Internal functions

function getHeadcountData ( callback ) {

    return callback( null, { trends: { year: 100, month: 10, total: 200 }, chart: [ 10, 15, 17, 19, 12, 7 ] } );

};

function getWorkforceData ( callback ) {

    return callback( null, { trends: { year: 150, month: 18, total: 180 }, chart: [ {name: 'internal', value: 10}, {name: 'external', value: 20}, {name: 'freelancer', value: 30}, {name: 'apprentice', value: 22} ] } );

};

function getAttritionData ( callback ) {

    return callback( null, [] );

};

function getSalaryData ( callback ) {

    return callback( null, [] );

};

function getFinanceData ( callback ) {

    return callback( null, [] );

};

//

module.exports = Home;
