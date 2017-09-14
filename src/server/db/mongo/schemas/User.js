/*
 * @author ohmed
 * User entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var UserSchema = new Schema({

    uid:                            { type: String, index: true, unique: true, default: function () { return new Buffer( '' + Math.random() + Date.now() ).toString('base64').replace( /=/g, '' ); } },
    eid:                            String,
    eLink:                          { type: Number, ref: 'Employee' },

    username:                       String,
    email:                          String,
    userpic:                        String,

    hash:                           String,
    salt:                           String,
    sessions:                       [ String ],

    disabled:                       { type: Boolean, default: false },

    facebookid:                     String,
    googleid:                       String,
    linkedinid:                     String,

    searchIndex:                    String,

    rolePermissionsUpdateToken:     String,

    contacts:                       [ String ],
    recentContacts:                 [{}],
    contactsGroups:                 [{
        gid:                            { type: String, index: true, unique: true, default: function () { return new Buffer( '' + Math.random() + Date.now() ).toString('base64').replace( /=/g, '' ); } },
        name:                           String,
        users:                          [ String ],
        default:                        Boolean,
        list:                           Boolean
    }],
    followers:                      [ String ],
    following:                      [ String ],

    status:                         { type: String, default: 'Offline' },
    activeStats:                    String,

    postsCount:                     Number,
    likesCount:                     Number,

    posts:                          [],
    activities:                     [],

    groups:                         [ Number ],
    roles:                          [ Number ],

    // settings

    settings:                       {
        alerts: {
            unrecognizedLogins:             { type: Boolean, default: false },
            userActivationNeeded:           { type: Boolean, default: false },
            wrongFileFormatUploaded:        { type: Boolean, default: false },
            userAccountIsNotActive:         { type: Boolean, default: false },
            userAccountIsNotActiveDuration: { type: Number, default: 24 },
            systemErrors:                   { type: Boolean, default: false },
            criticalFiguresFromTargets:     { type: Boolean, default: false }
        },
        notifications: {
            forTargets:                     { type: Boolean, default: false },
            soundOnMessageReceive:          { type: Boolean, default: false },
            birthdayOfColeagues:            { type: Number, default: 0 }
        },
        emailNotifications: {
            accountSequriteAndPrivacy:      { type: Boolean, default: false },
            subscriptionPeriodEnding:       { type: Boolean, default: false },
            subscriptionPeriod:             { type: Number, default: 5 }
        },
        warnings: {

        },
        location:                           { type: Boolean, default: false },
        colorSchemes:                       { type: String, default: '' },
        currency:                           { type: String, default: 'USD' }
    },

    // extra fields for sorting

    _fullName:                       String,
    _company:                        String,
    _country:                        String,
    _department:                     String,
    _employmentDateStart:            Date,
    _terminationDate:                Date,
    _jobTitle:                       String,

    //

    __v:                            { type: Number, select: false }

});

//

autoIncrement.initialize( MongoDB.connection );
UserSchema.plugin( autoIncrement.plugin, {
    model: 'User',
    field: '_id'
});

//

module.exports = UserSchema;
