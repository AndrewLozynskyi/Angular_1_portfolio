/*
 * @author ohmed
 * Employees entity schema
*/

var autoIncrement = require('mongoose-auto-increment');
var Schema = MongoDB.mongoose.Schema;

//

var EmployeeSchema = new Schema({

    uid:                    { type: String, ref: 'User' },

    eid:                    String,

    rightIndex:             Number,
    leftIndex:              Number,

    username:               String,

    firstName:              String,
    lastName:               String,

    gender:                 String,
    dateOfBirth:            Date,
    maritalStatus:          String,
    nationality:            String,
    ethnicOrigin:           String,

    contactInfo:            {

        workEmail:              String,
        personalEmail:          String,
        workPhonePrefix:        String,
        workPhone:              String,
        homePhonePrefix:        String,
        homePhone:              String,
        mobilePhonePrefix:      String,
        mobilePhone:            String,

        country:                String,
        address:                [ String ],
        zipCode:                String,
        city:                   String

    },

    socialLinks:            {

        linkedin:               { enable: { type: Boolean, default: true }, link: { type: String, default: '' } },
        facebook:               { enable: { type: Boolean, default: true }, link: { type: String, default: '' } },
        twitter:                { enable: { type: Boolean, default: true }, link: { type: String, default: '' } },
        googlePlus:             { enable: { type: Boolean, default: true }, link: { type: String, default: '' } },
        skype:                  { enable: { type: Boolean, default: false }, link: { type: String, default: '' } },
        facebook:               { enable: { type: Boolean, default: false }, link: { type: String, default: '' } },
        medium:                 { enable: { type: Boolean, default: false }, link: { type: String, default: '' } },
        telegram:               { enable: { type: Boolean, default: false }, link: { type: String, default: '' } }

    },

    summary:                String,
    courses:                [

        {

            coursName:      String,
            provider:       String,
            webSite:        String,
            finished:       Date,
            cerificatUrl:   String
        }

    ],

    history:                [

        {

            jobId:                  String,
            updateId:               { type: String, default: function () { return new Buffer( '' + Math.random() + Date.now() ).toString('base64').replace( /=/g, '' ); } },

            eid:                    String,

            company:                String,
            country:                String,
            department:             String,
            title:                  String,

            address:                [ String ],
            zipCode:                String,
            city:                   String,

            employmentDateStart:    Date,
            terminationDate:        Date,
            transferDate:           Date,
            transferType:           String,
            transferredFrom:        String,
            transferredTo:          String,

            jobTitle:               String,
            jobStartDate:           Date,
            jobEndDate:             Date,
            jobReason:              String,

            grade:                  String,
            salary:                 Number,
            salaryReason:           String,
            currency:               String,
            salaryFromDate:         Date,
            salaryToDate:           Date,

            bonus:                  [ {} ],
            bonusPercentage:        Number,

            personType:             String,
            perType:                String,
            perm:                   String,

            supervisorNumber:       String,
            supervisorName:         String,

            managerStartDate:       Date,
            managerEndDate:         Date,
            managerFeedback:        String,

            agileJobTitle:          String,
            skills:                 [ String ],

            officeName:             String,
            officeAddress:          [ String ],
            officeLocationCode:     String,

            absenceReason:          String,
            absenceFrom:            Date,
            absenceTo:              Date

        }

    ],

    //

    __v: { type: Number, select: false }

});

autoIncrement.initialize( MongoDB.connection );
EmployeeSchema.plugin( autoIncrement.plugin, {
    model: 'Employee',
    field: '_id'
});

//

module.exports = EmployeeSchema;
