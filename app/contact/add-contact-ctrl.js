/// <reference path="../../services/office365/scripts/exchange.js" />

(function () {
    'use strict';

    angular.module('app365').controller('newContactCtrl', ['$scope', '$state', '$ionicLoading', 'app365api', newContactCtrl]);

    function newContactCtrl($scope, $state, $ionicLoading, app365api) {
        var vm = this;

        // Outlook client object.
        var outlookClient;

        // To store contact info.
        $scope.newContact = {};

        $scope.addContact = function () {
            outlookClient = app365api.outlookClientObj();           

            // Contact object
            var contact = new Microsoft.OutlookServices.Contact();

            // First and last name
            contact.givenName = $scope.newContact.firstname;
            contact.surname = $scope.newContact.lastname;

            // Mobile phone
            contact.mobilePhone1 = $scope.newContact.phone;

            // Email address
            var emailAddress = new Microsoft.OutlookServices.EmailAddress();
            emailAddress.address = $scope.newContact.email;
            contact.emailAddresses.push(emailAddress);

            // Add Contact
            outlookClient.me.contacts.addContact(contact)
             .then((function (response) {
                 $ionicLoading.show({ template: 'Contact added successfully !!', noBackdrop: true, duration: 1000 });
                 // Navigate to contact list page after adding the contact.
                 $state.go('app.contact');
             })
            .bind(this), function (reason) {
                // Log the error message when add contact fails.
                console.log('Fail to add contact. Error = ' + reason.message);
            });
        };
    };
})();