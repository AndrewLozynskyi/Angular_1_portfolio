/*
 * @author volmat
 * SuperUser role default permission settings
*/

var SuperUser = {

    permissions: {

        accounts: {
            moduleEnabled:              true,
            user: {
                create:                 true,
                validate:               true,
                deactivate:             true,
                viewProfileOwnInfo:     true,
                viewInformation:        true,
                editProfileOwnInfo:     true,
                editProfileInfo:        true,
                deleteProfileOwnInfo:   true,
                deleteProfileInfo:      true,
                login:                  true,
                sendInvites:            true,
                activateNotif:          true
            },
            custumer: {
                create:                 false,
                stop:                   false,
                freeze:                 false,
                updateProfile:          false,
                viewPaymentLogs:        false,
                viewOwnPaymentLogs:     false,
                enterViewModifyData:    false,
                deleteProfileData:      false,
                login:                  false,
                getActivitesAlerts:     false,
                activeNotif:            false
            }
        },
        activities: {
            moduleEnabled:          true,
            view:                   true,
            activateNotif:          true,
            activateAlerts:         true
        },
        sharingData: {
            moduleEnabled:          true,
            enabled:                true,
            activateNotif:          true,
            activateAlerts:         true
        },
        planSelectorInvoicing: {
            moduleEnabled:          true,
            stopSubscriptions:      true,
            changeSubscription:     true,
            activateEmailSubsNotif: true,
            activateNotif:          true,
            activateAlerts:         true
        },
        dashboard: {
            moduleEnabled:          true,
            activateNotif:          true,
            activateAlerts:         true,
            home: {
                weatherWidget:      true,
                tasksWidget:        true,
                calendarWidget:     true,
                activitiesWidget:   true,
                headcountWidget:    true,
                workforceWidget:    true,
                attritionWidget:    true,
                financeWidget:      true,
                salaryWidget:       true,
                resourcingWidget:   true,
                absencesWidget:     true,
                eodWidget:          true,
                setTarget:          true,
                setFilter:          true
            },
            headcount: {
                donutWidget:        true,
                mapWidget:          true,
                headcountTable:     true,
                departmentsTable:   true,
                employeeTable:      true,
                generalChart:       true
            },
            workforce: {
                donutWidget:        true,
                mapWidget:          true,
                headcountTable:     true,
                pieChart:           true,
                departmentsTable:   true,
                generalChart:       true
            }
        },
        userProfile: {
            moduleEnabled:              true,
            view:                       true,
            editOwnInfo:                true,
            editUserInfo:               true,
            save:                       true,
            allowOtherViewOwnInfo:      true,
            allowOtherViewUserOwnInfo:  true,
            addContacts:                true,
            followUsers:                true,
            sendMessage:                true,
            sendInvites:                true,
            activateNotif:              true,
            activateAlerts:             true
        },
        contacts: {
            moduleEnabled:          true,
            createGroups:           true,
            addUserToGroup:         true,
            removeUserFromGroup:    true,
            sendContactsInvites:    true,
            sendGroupInvites:       true,
            activateNotif:          true,
            activateAlerts:         true
        },
        chat: {
            moduleEnabled:          true,
            createGroups:           true,
            addUserToGroup:         true,
            activateNotif:          true,
            activateAlerts:         true
        },
        admin: {
            moduleEnabled:                  true,
            createRoles:                    true,
            createRolesBasedOnOtherRoles:   true,
            home: {
                rolesWidget:                true,
                clientWidget:               true,
                userWidget:                 true,
                permissionsWidget:          true,
                liveSupportWidget:          true,
                alertNotifWidget:           true,
                paymentsLogsWidget:         true,
                todoWidget:                 true
            },
            permissions: {
                edit:                       true
            },
            settings: {
                edit:                       true
            },
            userManagement: {
                create:                     true,
                delete:                     true,
                update:                     true,
                assignUserToSuperUserRole:  true,
                assignUserToOtherRoles:     true,
                createGroups:               true
            },
            activitiesOnServer: {

            },
            alertNotifications: {

            },
            paymentLogs: {
                setOwner:               true,
                viewDetailes:           true,
                makePayment:            true,
                viewCustomerDetails:    true,
                activateNotif:          true,
                activateAlerts:         true
            }
        },
        api: {
            moduleEnabled:      true,
            activateNotif:      true,
            activateAlerts:     true
        },
        onOffBoarding: {
            moduleEnabled:      true,
            activateNotif:      true,
            activateAlerts:     true
        }

    }

};

//

module.exports = SuperUser;
