#AngularNive

AngularNive is the officially supported AngularJS binding for Nive. Nive is a cloud based backend service, so you don`t need 
your own server for angular apps. AngularNive provides you with useful services allowing you to keep your $scope in sync with your 
Nive backend easily.

##Installation
```html
<script src="/vendor/angular/angular.js"></script>
<script src="/vendor/angular-nive/angular-nive-0.8.1.js"></script>
<script src="app.js"></script>
```
    
**Bower coming soon!**

##Getting started with AngularNive
AngularNive requires Nive to sync data. [Sign up for your Nive account](http://www.nive.co/workspace)

Require 'nive' in your Angular App and you can use the included services as any Angular service.
```javascript
var myApp = angular.module('myApp', ['nive'])
    .controller('MyCtrl', function($scope, NiveUser, NiveDataStoreFactory) {
        
        // create a storage resource
        var myResource = NiveDataStoreFactory({resource: 'my-resource'});
        
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
```

##Best practices
It is recommended to setup a factory for each of your apps resources.
This enables you to access your resources in any controller or service and enhance your resources to match your requirements. 

```javascript
var myApp = angular.module('myApp', ['nive'])
    .factory('People', function(NiveDataStoreFactory) {
        
        var people = NiveDataStoreFactory({resource: 'people'});
        
        // add some methods to match peoples requirements
        people.isNice = function(person) {
            // psychological algorithms determining if this is a nice person
        }
        
        return people;
    })
    .factory('Company', function(NiveDataStoreFactory) {
        return NiveDataStoreFactory({resource: 'company'});
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
```

##Documentation
[See Nive service Api docs for full list of available methods](http://www.nive.co/docs/webapi/index.html)

