/*
 * @author ohmed
 * Stage environment config file
*/

var config = {

    name:           'Stage testing environment',

    mongodb: {
        host:       'mongodb://remote:aloha123@188.166.164.236:27017',
        db:         'hr-tools-stage'
    },

    redis: {
        host:       '188.166.164.236',
        port:       6379,
        password:   'b155646ce2adeadf8581ab71a71a2719f435763354bb343bd058f5ad141b4da4'
    },

    web: {
        host:       'http://localhost',
        port:       3002
    },

    social: {}

};

config.social = {

    facebook: {
        clientID:       '727747790729853',
        clientSecret:   '9c2f9684c009efb9e826417003ac1d48',
        callbackURL:    config.web.host + ':' + config.web.port + '/api/auth/loginfbcb'
    },
    linkedin: {
        consumerKey:    '869pwy83h702o6',
        consumerSecret: 'cGVLy55JJteoqAgy',
        profileFields:  [ 'id', 'first-name', 'last-name', 'email-address', 'headline' ],
        callbackURL:    config.web.host + ':' + config.web.port + '/api/auth/loginlicb'
    },
    google: {
        clientID:       '634285648188-tetsjrfnkl28et88fubq16rqm5drtb27.apps.googleusercontent.com',
        clientSecret:   'oUikg4vjPOVIk4v-At2EQkw9',
        callbackURL:    config.web.host + ':' + config.web.port + '/api/auth/loginggcb'
    }

};

//

module.exports = config;
