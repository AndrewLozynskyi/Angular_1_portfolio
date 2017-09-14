/*
 * @author ohmed
 * Teams service api
*/

var core = require('./../core/teams/Teams.js');

//

var Teams = {};

Teams.getList = function ( req, res ) {

    var params = {};
    params.uid = req.query.uid;
    params.userId = req.query.userId;

    if ( ! params.uid ) {

        return res.send({ code: 1, message: 'Param "uid" not defined.' });

    }

    if ( ! params.userId ) {

        return res.send({ code: 1, message: 'Param "userId" not defined.' });

    }

    //

    core.getList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result )

    });

};

Teams.getDetails = function ( req, res ) {

    var params = {};
    params.uid = req.query.uid;
    params.teamId = req.query.teamId;
    params.type = req.query.type || 'all';

    //

    if ( ! params.uid ) {

        return res.send({ code: 1, message: 'Param "uid" not defined.' });

    }

    if ( ! params.teamId ) {

        return res.send({ code: 1, message: 'Param "teamId" not defined.' });

    }

    //

    core.getDetails( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result )

    });

};

Teams.getEmployees = function ( req, res ) {

    var params = {};
    params.uid = req.query.uid;
    params.teamId = req.query.teamId;

    if ( ! params.uid ) {

        return res.send({ code: 1, message: 'Param "uid" not defined.' });

    }

    if ( ! params.teamId ) {

        return res.send({ code: 1, message: 'Param "teamId" not defined.' });

    }

    //

    core.getEmployeesList( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        //

        return res.send( result )

    });

};

//

module.exports = Teams;
