/*
 * @author ohmed
 * Users profile management sys
*/

var UserSchema = require('./../../db/mongo/schemas/User.js');
var UserModel = MongoDB.mongoose.model( 'User', UserSchema );

var EmployeesSchema = require( './../../db/mongo/schemas/Employee.js' );
var EmployeeModel = MongoDB.mongoose.model( 'Employee', EmployeesSchema );

//

var Profile = {};

Profile.getInfo = function ( uid, userId, username, callback ) {

    var query = {};

    if ( username ) {

        query['username'] = username;

    } else {

        query['uid'] = userId;

    }

    UserModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, userMe ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! userMe ) {

            return callback({ code: 1, message: 'User not found.' });

        }

        //

        UserModel
        .findOne( query )
        .populate('eLink')
        .exec( function ( err, user ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            if ( ! user ) {

                return callback({ code: 1, message: 'User not found.' });

            }

            //

            var employee = user.eLink || {};

            var result = {
                uid:            user.uid,
                username:       user.username,
                userpic:        user.userpic,
                firstName:      employee.firstName,
                lastName:       employee.lastName,
                gender:         employee.gender,
                dateOfBirth:    employee.dateOfBirth,
                maritalStatus:  employee.maritalStatus,
                nationality:    employee.nationality,
                ethnicOrigin:   employee.ethnicOrigin,
                contactInfo:    employee.contactInfo,
                history:        employee.history || [],
                summary:        employee.summary,
                socialLinks:    employee.socialLinks,
                courses:        employee.courses,
                stats:          {
                    contacts:   ( user.contacts || [] ).length,
                    follow:     ( user.followers || [] ).length,
                    posts:      ( user.posts || [] ).length,
                    likes:      ( user.likes || [] ).length
                },
                isInContacts:   ( userMe.contacts.indexOf( user.uid ) !== -1 ),
                isInFollowing:  ( userMe.following.indexOf( user.uid ) !== -1 )
            };

            return callback( null, result );

        });

    });

};

Profile.updateGeneralInfo = function ( uid, info, callback ) {

    EmployeeModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with id: \'' + uid + '\' not found.' });

        }

        //

        employee.summary = ( info.summary !== undefined ) ? info.summary : employee.summary;
        employee.dateOfBirth = ( info.dateOfBirth !== undefined ) ? info.dateOfBirth : employee.dateOfBirth;
        employee.maritalStatus = ( info.maritalStatus !== undefined ) ? info.maritalStatus : employee.maritalStatus;

        //

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { success: true } );

        });

    });

};

Profile.updateContactsInfo = function ( uid, info, callback ) {

    EmployeeModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with id: \'' + uid + '\' not found.' });

        }

        //
        employee.contactInfo = employee.contactInfo || {};

        employee.contactInfo.workEmail = ( info.workEmail !== undefined ) ? info.workEmail : employee.contactInfo.workEmail;
        employee.contactInfo.personalEmail = ( info.personalEmail !== undefined ) ? info.personalEmail : employee.contactInfo.personalEmail;
        employee.contactInfo.workPhonePrefix = ( info.workPhonePrefix !== undefined ) ? info.workPhonePrefix : employee.contactInfo.workPhonePrefix;
        employee.contactInfo.workPhone = ( info.workPhone !== undefined ) ? info.workPhone : employee.contactInfo.workPhone;
        employee.contactInfo.homePhonePrefix = ( info.homePhonePrefix !== undefined ) ? info.homePhonePrefix : employee.contactInfo.homePhonePrefix;
        employee.contactInfo.homePhone = ( info.homePhone !== undefined ) ? info.homePhone : employee.contactInfo.homePhone;
        employee.contactInfo.mobilePhonePrefix = ( info.mobilePhone !== undefined ) ? info.mobilePhonePrefix : employee.contactInfo.mobilePhonePrefix;
        employee.contactInfo.mobilePhone = ( info.mobilePhone !== undefined ) ? info.mobilePhone : employee.contactInfo.mobilePhone;
        employee.contactInfo.country = ( info.country !== undefined ) ? info.country : employee.contactInfo.country;
        employee.contactInfo.address = ( info.address !== undefined ) ? info.address : employee.contactInfo.address;
        employee.contactInfo.zipCode = ( info.zipCode !== undefined ) ? info.zipCode : employee.contactInfo.zipCode;
        employee.contactInfo.city = ( info.city !== undefined ) ? info.city : employee.contactInfo.city;

        //

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { success: true } );

        });

    });

};

Profile.updateSocialLinksInfo = function ( uid, info, callback ) {

    EmployeeModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with id: \'' + uid + '\' not found.' });

        }

        employee.socialLinks = employee.socialLinks || {};

        for ( network in info ) {

            if ( employee.socialLinks[ network ] !== undefined )
            employee.socialLinks[ network ].link = ( info[ network ].link !== undefined ) ? info[ network ].link : employee.socialLinks[ network ].link;

        }

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { success: true } );

        });

    });

};

Profile.updateJobSkills = function ( uid, jobId, skillsList, callback ) {

    // detele duplicate

    skillsList = skillsList.filter( function ( item, index, inputArray ) {

        return inputArray.indexOf( item ) == index;

    });

    // detele non string element

    skillsList = skillsList.filter( String );

    //

    EmployeeModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with id: \'' + user._id + '\' not found.' });

        }

        //

        for ( var i = 0, il = employee.history.length; i < il; i ++ ) {

            if ( employee.history[ i ].jobId !== jobId ) continue;

            employee.history[ i ].skills = skillsList;

        }

        //

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            return callback( null, { success: true } );

        });

    });

};

Profile.addSocialNetwork = function ( uid, info, callback ) {

    EmployeeModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with id: \'' + uid + '\' not found.' });

        }

        for ( var i = 0, il = info.length; i < il; i ++ ) {

            if ( employee.socialLinks[ info[ i ].sn ] !== undefined ) {

                employee.socialLinks[ info[ i ].sn ].enable = info[ i ].enable;
                employee.socialLinks[ info[ i ].sn ].link = info[ i ].link;

            }

        }

        //

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            return callback( null, { success: true } );

        });

    });

};

Profile.addCourse = function ( uid, course, callback ) {

    EmployeeModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with id: \'' + uid + '\' not found.' });

        }

        //

        employee.courses.push({
            coursName:      course.courseName,
            provider:       course.courseProvides,
            webSite:        course.courseWebsite,
            finished:       course.ctrlMyDate,
            cerificatUrl:   ''
        });

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            return callback( null, { success: true } );

        });

    });

};

Profile.removeCourse = function ( uid, courseId, callback ) {

    EmployeeModel
    .findOne({
        uid:    uid
    })
    .exec( function ( err, employee ) {

        if ( err ) {

            return callback({ code: 0, message: err });

        }

        if ( ! employee ) {

            return callback({ code: 1, message: 'Employee with id: \'' + uid + '\' not found.' });

        }

        //

        var newCoursesList = [];

        for ( var i = 0, il = employee.courses.length; i < il; i ++ ) {

            if ( '' + employee.courses[ i ]._id !== courseId ) {

                newCoursesList.push( employee.courses[ i ] );

            }

        }

        employee.courses = newCoursesList;

        //

        employee.save( function ( err ) {

            if ( err ) {

                return callback({ code: 0, message: err });

            }

            //

            return callback( null, { success: true } );

        });

    });

};

Profile.uploadCourseCertificate = function ( uid, courseId, certificate, callback ) {

    // todo
    return callback( null, { success: true } );

};

//

module.exports = Profile;
