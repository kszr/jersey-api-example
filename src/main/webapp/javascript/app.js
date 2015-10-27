(function (angular) {

    'use strict';

    var app = angular.module('my-app', [
        'ngResource',
        'ui.router'
    ]);
    app.factory('TodoList', ['$resource', function ($resource) {
        return $resource('/api/todo-lists/:id', {id: '@id'}, {
            'update': { method : 'PUT'}
        });
    }]);

    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/todo-lists');

            $stateProvider.state('todo-lists', {
                url: '/todo-lists',
                templateUrl: 'all-lists.html',
                controller: 'AllListsController'
            });

            $stateProvider.state('todo-list', {
                url: '/todo-lists/:id',
                templateUrl: 'todo-list.html',
                controller: 'TodoListController'
            });
        }
    ]);

    app.controller('AllListsController', [
        'TodoList',
        '$scope',
        function (TodoList, $scope) {

            $scope.lists = TodoList.query();

            $scope.createList = function () {
                TodoList.save({
                    items: []
                }).$promise.then(function () {
                    $scope.lists = TodoList.query();
                });
            };
        }
    ]);

    app.controller('TodoListController', [
        'TodoList',
        '$scope',
        '$stateParams',
        function (TodoList, $scope, $stateParams) {
            $scope.list = TodoList.get({id: $stateParams.id});

            $scope.doneStatus = {
                done: false
            };

            $scope.addItem = function () {
                if (!$scope.list.items) {
                    $scope.list.items = [];
                }
                $scope.list.items.push({done: false, message: ''});
            };

            $scope.removeItem = function (item) {
                $scope.list.items.splice($scope.list.items.indexOf(item), 1);
                $scope.update();
            };

            $scope.update = function () {
                TodoList.update($scope.list);
            };
        }
    ]);

}(window.angular));
