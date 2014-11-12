#AngularNive

AngularNive is the officially supported AngularJS binding for Nive. Nive is a cloud based backend service, so you don`t need your own server for angular apps. AngularNive provides you with useful services allowing you to keep your $scope in sync with your Nive backend easily.

##Installation
AngularNive depends on nive-endpoint, a small helper library for building Api requests.Therefore you need to make sure nive-endpoint is loaded before angular-nive.

    <script src="/vendor/nive/endpoint-0.7.1.js"></script>
    <script src="/vendor/angular/angular.js"></script>
    <script src="/vendor/angular-nive/angular-nive-0.7.0.js"></script>
    <script src="app.js"></script>
Nive-endpoint might be included directly in angular-nive in the future for your convenience.
    
**Bower coming soon!**

##Getting started with AngularNive
AngularNive requires Nive to sync data. [Sign up for your Nive account](http://www.nive.co/workspace/account/signup)

Require 'nive' in your Angular App and you can use the included services as any Angular service.

    var myApp = angular.module('myApp', ['nive'])
        .controller('MyCtrl', function($scope, NiveUser, NiveDataStorageFactory) {
            
            // create a storage resource
            var myResource = NiveDataStorageFactory({resource: 'my-resource'});
            
            // check for authentication
            NiveUser.authenticated().then(function(response) {
                
                // if authenticated, load list of 'my-resource' items
                if(response.result) {
                    myResource.list().then(function(response) {
                        $scope.items = response.items;
                    });    
                } else {
                    // make sure we get authentication, e.g. redirect to signIn
                }
            });
        });

##Best practices
It is recommended to setup a factory for each of your apps resources.
This enables you to access your resources in any controller or service and enhance your resources to match your requirements. 

    var myApp = angular.module('myApp', ['nive'])
        .factory('People', function(NiveDataStorageFactory) {
            
            var people = NiveDataStorageFactory({resource: 'people'});
            
            // add some methods to match peoples requirements
            people.isNice = function(person) {
                // psychological algorithms determining if this is a nice person
            }
            
            return people;
        })
        .factory('Company', function(NiveDataStorageFactory) {
            return NiveDataStorageFactory({resource: 'company'});
        })
        .controller('FirstCtrl', function($scope, People, Company) {
            People.getItem({id:3}).then(function(response) {
                if(People.isNice(response.value)) {
                    $scope.happy = true;
                }
            });
        })
        .controller('SecondCtrl', function($scope, People, Company) {
            // does something with Persons and Companies
        });

##Documentation
[See Nive service Api docs for full list of available methods](http://devmaster.niveapps.com/docs/webapi/index.html)

