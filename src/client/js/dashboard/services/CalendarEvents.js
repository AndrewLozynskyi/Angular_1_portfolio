/*
 * @author ohmed
 * Calendar Events service
*/

angular.module( 'Dashboard.module' )

.service( 'calendarEvents.service', [ function () {

    var service = {};

    var element;
    var events = [
        {
            title: 'Google',
            url: 'http://google.com/',
            start: '2014-06-28',
            className: 'bgm-bluegray'
        },
        {
            title: 'Google',
            url: 'http://google.com/',
            start: '2014-06-28',
            className: 'bgm-bluegray'
        },
        {
            title: 'Google',
            url: 'http://google.com/',
            start: '2014-06-28',
            className: 'bgm-bluegray'
        }
    ];

    //

    service.getEvents = function () {

        // todo: add http to get events from database

        return events;

    };

    service.addEvent = function ( newEvent ) {

        element.fullCalendar( 'renderEvent', newEvent );

        // todo: add http to add event into database

        events.push( newEvent );

    };

    service.renderElement = function ( elem ) {

        element = elem;

    };

    //

    return service;

}]);
