/*
 * @author ohmed, iliya, volmat
 * Profile 'About' tab controller
*/

angular.module( 'Profile.module' )

.controller( 'about.controller', [ '$scope', '$rootScope', 'users.service', '$cookies', '$window', function ( $scope, $rootScope, usersService, $cookies, $window ) {

    var session = $cookies.get('session');
    var uid = $cookies.get('uid');

    $scope.user = false;
    $scope.workExpirience = [];
    $scope.courses = [];
    $scope.stickyNavWidth = 1034 + 20;

    $scope.active = true;
    $scope.activeWork = true;
    $scope.activeCourse = true;
    $scope.activeSalary = true;
    $scope.activeContact = true;

    $scope.socialNetworks = false;
    $scope.addnewCourse = false;

    // state for add new course
    $scope.addCourseshowDirective = false;
    $scope.addCourseshowAddOneButton = true;

    // state for new social network

    $scope.addingNewSocialLink = false;

    $scope.stickyNavTop = 60 + 'px';
    $scope.stickyNavPosition = 'relative';

    //

    $scope.myDate = new Date();

    $scope.showEditButtons = false;

    $scope.isBlockEditing = {
        summary:            false,
        courses:            false,
        workExperiance:     false,
        contactInfo:        false,
        socialLinks:        false
    };

    $scope.socialLinkParams = {
        facebook:       { icon: 'fa fa-facebook fa-lg', name: 'Facebook' },
        googlePlus:     { icon: 'fa fa-google-plus fa-lg', name: 'Google +' },
        linkedin:       { icon: 'fa fa-linkedin-square fa-lg', name: 'LinkedIn' },
        medium:         { icon: 'fa fa-medium fa-lg', name: 'Medium' },
        skype:          { icon: 'fa fa-skype fa-lg', name: 'Skype' },
        telegram:       { icon: 'fa fa-telegram fa-lg', name: 'Telegram' },
        twitter:        { icon: 'fa fa-twitter fa-lg', name: 'Twitter' }
    };

    $scope.readonly = false;
    $scope.activePhoneInput = true;
    $scope.activeCountryInput = true;
    $scope.activeHomePhone = true;

    //

    angular.element( document ).find('.md-datepicker-input-container').addClass('add-bottom');
    angular.element( document ).find('.md-datepicker-button').addClass('add-opacity')

    $scope.saveSummary = function () {

        $scope.isBlockEditing.summary = false;

        var summary = $scope.user.summary;
        var dateOfBirth = $scope.user.dateOfBirth;
        var maritalStatus = $scope.user.maritalStatus;

        var newGeneraiInfo = {
            summary:        summary,
            dateOfBirth:    dateOfBirth,
            maritalStatus:  maritalStatus
        };

        usersService
        .updateGeneralInfo( uid, session, newGeneraiInfo );

        angular.element( document ).find('.md-datepicker-input-container').addClass('add-bottom');
        angular.element( document ).find('.md-datepicker-button').addClass('add-opacity');

    };

    $scope.saveWorkExperiance = function ( job ) {

        $scope.isBlockEditing.workExpirience = false;
        var newSkill = $('md-chips-wrap input').val();

        if ( newSkill !== '' ) {

            job.skills.push( newSkill );

        }

        usersService
        .updateJobExperiance( uid, job.jobId, job.skills )
        .then( function () {

            job.editSkills = false;

        });

    };

    $scope.saveCourses = function () {

        var сourseArray = [];

        $scope.isBlockEditing.courses = false;

        for ( var key in $scope.user.courses ) {

            $scope.user.courses[ key ].sc = key;

            var courseName = $scope.user.courses[ key ].coursName;
            var courseProvider = $scope.user.courses[ key ].provider;
            var courseWebsite = $scope.user.courses[ key ].webSite;
            var courseData = $scope.user.courses[ key ].finished;

            сourseArray.push(courseName, courseProvider, courseWebsite, courseData );
        }

        usersService.saveCourse( uid, session, сourseArray );

    };

    $scope.removeCourse = function ( key ) {

        var courseId = $scope.user.courses[ key ]._id;

        usersService
        .removeCourse( uid, courseId );

    };

    $scope.saveContacts = function () {

        $scope.isBlockEditing.contactInfo = false;

        var address = $scope.user.contactInfo.address;
        var city = $scope.user.contactInfo.city;
        var country = $scope.user.contactInfo.country;
        var homePhone = $scope.user.contactInfo.homePhone;
        var mobilePhone = $scope.user.contactInfo.mobilePhone;
        var personalEmail = $scope.user.contactInfo.personalEmail;
        var workEmail = $scope.user.contactInfo.workEmail;
        var workPhone = $scope.user.contactInfo.workPhone;
        var zipCode = $scope.user.contactInfo.zipCode;

        var newContactsInfo = {
            address:        address,
            city:           city,
            country:        country,
            homePhone:      homePhone,
            mobilePhone:    mobilePhone,
            personalEmail:  personalEmail,
            workEmail:      workEmail,
            workPhone:      workPhone,
            zipCode:        zipCode
        };

        usersService
        .updateContactsInfo( uid, session, newContactsInfo );

    };

    $scope.saveSocialLinks = function () {

        $scope.isBlockEditing.socialLinks = false;
        $scope.addingNewSocialLink = false;

        var socialLinksArray = [];

        for ( var key in $scope.user.socialLinks ) {

            $scope.user.socialLinks[ key ].sn = key;
            var profileSocialLink = $scope.user.socialLinks[ key ];

            socialLinksArray.push( profileSocialLink );

        }

        usersService
        .saveAddSocialNetwork( uid, session, socialLinksArray );

    };

    $scope.exitSocialLink = function ( key ) {

        $scope.user.socialLinks[ key ].enable = false;
        var socialLinksArray = [];

        for ( var key in $scope.user.socialLinks ) {

            $scope.user.socialLinks[ key ].sn = key;
            var profileSocialLink = $scope.user.socialLinks[ key ];

            socialLinksArray.push(profileSocialLink);

        }

        usersService
        .saveAddSocialNetwork( uid, session, socialLinksArray );

    };

    $scope.calculateAge = function ( birthday ) {

        var ageDifMs = Date.now() - new Date( birthday );
        var ageDate = new Date( ageDifMs );

        return Math.abs( ageDate.getUTCFullYear() - 1970 );

    };

    $scope.getMartialStatus = function ( status ) {

        switch ( status ) {

            case 'D':
                return 'Divorced';
            case 'S':
                return 'Single';
            case 'W':
                return 'Widowed';
            case 'M':
                return 'Married';

        }

    };

    $scope.getSkills = function ( skills ) {

        skills = skills || [];
        var result = '';

        //

        for ( var i = 0; i < skills.length; i ++ ) {

            result += ( i < skills.length - 1 ) ? skills[ i ] + ', ' : skills[ i ];

        }

        return result;

    };

    $scope.getCourses = function () {

        if ( $scope.user.courses instanceof Array ) {

            $scope.courses = $scope.user.courses;

            for ( var i = 0; i < $scope.courses.length; i ++ ) {

                $scope.isBlockEditing[ 'cours' + i ] = false;

            }

        } else {

            // Seed for develop in other case []

            $scope.isBlockEditing[ 'cours' + 0 ] = false;
            $scope.courses = [ { name: 'Course Software Engineering', details: 'Coursera, HCI (website)', date: new Date() } ];

        }

    };

    $scope.calculateAge = function ( birthYear ) { 

        var currentYear = new Date().getFullYear();

        return currentYear - birthYear;

    }

    $scope.getYear = function () {

       var getYears = new Date($scope.user.dateOfBirth);

       var cutYear = getYears.getFullYear();

       return cutYear;
        
    };

    $scope.getWorkExpirience = function () {

        var result = [];
        var editIndex = 0;

        //

        if ( $scope.user.history.length ) {

            for ( var i = 0; i < $scope.user.history.length; i ++ ) {

                var job = $scope.user.history[ i ];
                var lastJob = result[ result.length - 1 ] || false;

                if ( ! lastJob || lastJob.jobId !== job.jobId ) {

                    result.push( $scope.user.history[ i ] );

                    $scope.isBlockEditing[ 'workExp' + editIndex ] = false;
                    editIndex ++;

                }

            }

        }

        return result;

    };

    $scope.getDuration = function ( start, end ) {

        start = ( start ) ? new Date( start ) : new Date();
        end = ( end ) ? new Date( end ) : new Date();

        return ( end.getFullYear() - start.getFullYear() ) + ' year ' + ( end.getMonth() - start.getMonth() ) + ' months';

    };

    $scope.editBlock = function ( blockId, category ) {

        angular.element( document )
            .find('.md-datepicker-input-container').removeClass('add-bottom');
        angular.element( document )
            .find('.md-datepicker-button').removeClass('add-opacity')

        if ( category ) {

            if ( $scope.isBlockEditing[ category ][ blockId ] ) {

                $scope.isBlockEditing[ category ][ blockId ] = false;

                if ( category === 'socialLinks' ) {

                    usersService.updateSocialLinks( uid, session, $scope.user.socialLinks );

                }

                if ( category === 'contactInfo' ) {

                    usersService.updateContactsInfo( uid, session, $scope.user.contactInfo );

                }

            } else {

                $scope.isBlockEditing[ category ][ blockId ] = true;

            }

        } else {

            if ( $scope.isBlockEditing[ blockId ] ) {

                $scope.isBlockEditing[ blockId ] = false;
                $scope.workExpirience = $scope.getWorkExpirience();

                if ( blockId === 'summary' ) {

                    angular.element( document )
                        .find('.md-datepicker-input-container').addClass('add-bottom');
                    angular.element( document )
                        .find('.md-datepicker-button').addClass('add-opacity')

                    changeBlockPos();

                    usersService
                    .updateGeneralInfo( uid, session, {
                        dateOfBirth:    $scope.user.dateOfBirth,
                        maritalStatus:  $scope.user.maritalStatus,
                        summary:        $scope.user.summary,
                    });

                }

            } else {

                $scope.isBlockEditing[ blockId ] = true;

            }

        }

    };

    $scope.goToElement = function ( block ) {

        var app = document.querySelector( '.app-content' );

        var selectedElement = angular.element('#'+block);

        $scope.stickyNavWidth = selectedElement[0].offsetWidth;

        $( app ).stop().animate( { scrollTop: selectedElement[0].offsetTop - 144 });

    };

    $scope.blockPositions = {

        summary: { top: angular.element('#summary')[0].offsetTop, bottom: angular.element('#summary')[0].offsetTop + angular.element('#summary')[0].clientHeight },
        workExp: { top: angular.element('#workExp')[0].offsetTop, bottom: angular.element('#workExp')[0].offsetTop + angular.element('#courses')[0].clientHeight + angular.element('#workExp')[0].clientHeight },
        sallary: { top: angular.element('#sallary')[0].offsetTop, bottom: angular.element('#sallary')[0].offsetTop + angular.element('#sallary')[0].clientHeight },
        contacts: { top: angular.element('#contacts')[0].offsetTop, bottom: angular.element('#contacts')[0].offsetTop + angular.element('#contacts')[0].clientHeight }

    };

    var changeBlockPos = function () {

        $scope.blockPositions = {

            summary: { top: angular.element('#summary')[0].offsetTop, bottom: angular.element('#summary')[0].offsetTop + angular.element('#summary')[0].clientHeight },
            workExp: { top: angular.element('#workExp')[0].offsetTop, bottom: angular.element('#workExp')[0].offsetTop + angular.element('#courses')[0].clientHeight + angular.element('#workExp')[0].clientHeight },
            sallary: { top: angular.element('#sallary')[0].offsetTop, bottom: angular.element('#sallary')[0].offsetTop + angular.element('#sallary')[0].clientHeight },
            contacts: { top: angular.element('#contacts')[0].offsetTop, bottom: angular.element('#contacts')[0].offsetTop + angular.element('#contacts')[0].clientHeight }

        };

    };

    var addScroll = function( event ) {

        var $window = $(window),
        $mainMenuBar = $('.mainMenuBar'),
        $mainMenuBarAnchor = $('#mainMenuBarAnchor');

        var windowTop = $window.scrollTop() + 60;
        var beforeStickyPanelScroll = $mainMenuBarAnchor.offset().top;

        if ( windowTop > beforeStickyPanelScroll ) {

            $mainMenuBar.addClass('stickyNavPanelScroll'), changeBlockPos();

        } else {

            $mainMenuBar.removeClass('stickyNavPanelScroll'), changeBlockPos();

        }

        var selectedElementWidth = angular.element('#summary')[0].offsetWidth;

        $scope.stickyNavWidth = selectedElementWidth;

        var selectedElement = angular.element('#sticky md-tab-item');
        var tabIndexex = [
            selectedElement[0].attributes['md-tab-id'].value,
            selectedElement[1].attributes['md-tab-id'].value,
            selectedElement[2].attributes['md-tab-id'].value,
            selectedElement[3].attributes['md-tab-id'].value
        ];

        var position = $( document.querySelector('.app-content') ).scrollTop();

        if ( position >= 0 && position <= ( $scope.blockPositions.summary.bottom - 144 ) ) {

            angular.element('[md-tab-id=' + tabIndexex[0] + ']').css({'color': '#17a9a8'});

        } else {

            angular.element('[md-tab-id=' + tabIndexex[0] + ']').css({'color': '#4a5a68'});

        }

        if ( position >= $scope.blockPositions.workExp.top - 145 && position <= ( $scope.blockPositions.workExp.bottom - 144 ) ) {

            angular.element('[md-tab-id=' + tabIndexex[1] + ']').css({'color': '#17a9a8'});

        } else {

            angular.element('[md-tab-id=' + tabIndexex[1] + ']').css({'color': '#4a5a68'});

        }

        if ( position >= $scope.blockPositions.sallary.top - 180 && position <= ( $scope.blockPositions.sallary.bottom - 144 ) ) {


            angular.element('[md-tab-id=' + tabIndexex[2] + ']').css({'color': '#17a9a8'});

        } else {

            angular.element('[md-tab-id=' + tabIndexex[2] + ']').css({'color': '#4a5a68'});

        }

        if ( position >= $scope.blockPositions.contacts.top - 145 ) {

            angular.element('[md-tab-id=' + tabIndexex[3] + ']').css({'color': '#17a9a8'});

        } else {

            angular.element('[md-tab-id=' + tabIndexex[3] + ']').css({'color': '#4a5a68'});

        }

    };

    angular.element( $window ).bind('resize', function () {

        changeBlockPos();
        $scope.stickyNavWidth = angular.element('#summary')[0].offsetWidth;

    });
    
    usersService.getUserInfo( false, false, function ( user ) {

        $scope.user = user.message;
        $scope.workExpirience = $scope.getWorkExpirience();
        $scope.getCourses();
        var year = $scope.getYear();
        $scope.user.age = $scope.calculateAge(year);
        $scope.user.contactInfo.fullWorkPhone = $scope.user.contactInfo.workPhonePrefix + $scope.user.contactInfo.workPhone;
        $scope.user.contactInfo.fullMobilePhone = $scope.user.contactInfo.mobilePhonePrefix + $scope.user.contactInfo.mobilePhone;
        $scope.user.contactInfo.fullHomePhone = $scope.user.contactInfo.homePhonePrefix + $scope.user.contactInfo.homePhone;

        //

        if ( $scope.user.username === $rootScope.userData.username ) {

            $scope.showEditButtons = true;

        }

    });

    

    $scope.$on('$destroy', function () {

        document.querySelector('.app-content').removeEventListener( 'scroll', addScroll );

    });

    $scope.addCourse = function () {

        $scope.addCourseshowDirective = true;
        $scope.addCourseshowAddOneButton = false;

        // document.getElementById('myDatePicker').childNodes[1].childNodes[0].setAttribute('readonly', 'readonly');

    };

    $scope.disableEditButton = function ( element ) {

        var phoneArrow = $( '#selectCountryForm').find( '.iti-arrow');
        var phoneFlagContainer = $( '#selectCountryForm').find( '.selected-flag');

        var countryArrow = $( '#selectCountryForm2').find( '.iti-arrow');
        var countryFlagContainer = $( '#selectCountryForm2').find( '.selected-flag');

        var HPcountryArrow = $( '#selectCountryForm3').find( '.iti-arrow');
        var HPcountryFlagContainer2 = $( '#selectCountryForm3').find( '.selected-flag');

        //

        switch ( element ) {

            case 'WorkPhone':

                $scope.activePhoneInput = !$scope.activePhoneInput;
                phoneArrow.toggle();
                if ( $scope.activePhoneInput ) {

                    $('#phone').css({"border-bottom": "1px solid #292c33"});
                    phoneFlagContainer.css("border-bottom", "1px solid #292c33");

                } else {

                    $('#phone').css({"border-bottom": "1px solid #16181c"});
                    phoneFlagContainer.css("border-bottom", " 1px solid #16181c");

                }

                break;

            case 'HomePhone':

                $scope.activeHomePhone = !$scope.activeHomePhone;
                HPcountryArrow.toggle();
                if ( $scope.activeHomePhone ) {

                    $('#HomePhone').css({"border-bottom": "1px solid #292c33"});
                    HPcountryFlagContainer2.css("border-bottom", "1px solid #292c33");

                } else {

                    $('#HomePhone').css({"border-bottom": "1px solid #16181c"});
                    HPcountryFlagContainer2.css("border-bottom", " 1px solid #16181c");

                }

                break;

            case 'country':

                $scope.activeCountryInput = ! $scope.activeCountryInput;
                countryArrow.toggle();

                if ( $scope.activeCountryInput ) {

                    countryFlagContainer.css("border-bottom", "1px solid #292c33");

                } else {

                    countryFlagContainer.css("border-bottom", " 1px solid #16181c");

                }

                break;

        }

    };

    document.querySelector('.app-content').addEventListener( 'scroll', addScroll );

}])
