/*
 * @author volmat
 * Employee role default permission settings
*/

var Employee = {

    permissions: {

        accounts: {
            moduleEnabled:              true,
            user: {
                create:                 false,
                validate:               false,
                deactivate:             false,
                viewProfileOwnInfo:     true,
                viewInformation:        true,
                editProfileOwnInfo:     true,
                editProfileInfo:        false,
                deleteProfileOwnInfo:   true,
                deleteProfileInfo:      false,
                login:                  true,
                sendInvites:            true,
                activateNotif:          false
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
            activateNotif:          false,
            activateAlerts:         false
        },
        sharingData: {
            moduleEnabled:          false,
            enabled:                false,
            activateNotif:          false,
            activateAlerts:         false
        },
        planSelectorInvoicing: {
            moduleEnabled:          false,
            stopSubscriptions:      false,
            changeSubscription:     false,
            activateEmailSubsNotif: false,
            activateNotif:          false,
            activateAlerts:         false
        },
        dashboard: {
            moduleEnabled:          true,
            activateNotif:          false,
            activateAlerts:         false,
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
                setTarget:          false,
                setFilter:          false
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
            view:                       false,
            editOwnInfo:                true,
            editUserInfo:               false,
            save:                       true,
            allowOtherViewOwnInfo:      true,
            allowOtherViewUserOwnInfo:  false,
            addContacts:                true,
            followUsers:                true,
            sendMessage:                true,
            sendInvites:                true,
            activateNotif:              false,
            activateAlerts:             false
        },
        contacts: {
            moduleEnabled:          true,
            createGroups:           true,
            addUserToGroup:         true,
            removeUserFromGroup:    true,
            sendContactsInvites:    true,
            sendGroupInvites:       true,
            activateNotif:          false,
            activateAlerts:         false
        },
        chat: {
            moduleEnabled:          true,
            createGroups:           true,
            addUserToGroup:         true,
            activateNotif:          false,
            activateAlerts:         false
        },
        admin: {
            moduleEnabled:                  false,
            createRoles:                    false,
            createRolesBasedOnOtherRoles:   false,
            home: {
                rolesWidget:                false,
                clientWidget:               false,
                userWidget:                 false,
                permissionsWidget:          false,
                liveSupportWidget:          false,
                alertNotifWidget:           false,
                paymentsLogsWidget:         false,
                todoWidget:                 false
            },
            permissions: {
                edit:                       false
            },
            settings: {
                edit:                       false
            },
            userManagement: {
                create:                     false,
                delete:                     false,
                update:                     false,
                assignUserToSuperUserRole:  false,
                assignUserToOtherRoles:     false,
                createGroups:               false
            },
            activitiesOnServer: {

            },
            alertNotifications: {

            },
            paymentLogs: {
                setOwner:               false,
                viewDetailes:           false,
                makePayment:            false,
                viewCustomerDetails:    false,
                activateNotif:          false,
                activateAlerts:         false
            }
        },
        api: {
            moduleEnabled:      false,
            activateNotif:      false,
            activateAlerts:     false
        },
        onOffBoarding: {
            moduleEnabled:      false,
            activateNotif:      false,
            activateAlerts:     false
        }

    }

};

//

module.exports = Employee;
