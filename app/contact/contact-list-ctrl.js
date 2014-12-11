(function () {
    'use strict';

    angular.module('app365').controller('contactCtrl', ['$scope', 'app365api', contactCtrl]);

    function contactCtrl($scope, app365api) {
        var vm = this;
        var outlookClient;

        function getContacts() {
            NProgress.start();

            // Fetch all the contacts.
            outlookClient.me.contacts.getContacts().fetch()
            .then(function (contacts) {
                // Get the current page. Use getNextPage() to fetch next set of contacts.
                vm.contacts = contacts.currentPage;
                $scope.$apply();
                NProgress.done();
            });
        };

        vm.loadList = function () {
            // Get the Outlook client object.
            outlookClient = app365api.outlookClientObj();
            // Get contacts.
            getContacts();

        };

        vm.loadList();
    }

})();