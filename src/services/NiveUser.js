'use strict';
angular.module('nive.services').provider('NiveUser', function() {

    var options = {
        resource: 'users'
    };

    this.options = function(option, value) {

        switch (true) {
            case angular.isString(option):
                if(angular.isDefined(value)) {
                    options[option] = value;
                } else {
                    return options[option];
                }
                break;
            case angular.isObject(option):
                angular.extend(options, option);
                break;
        }

        return options;
    };

    this.$get = function(NiveAPI) {

        return {
            signIn: function(params) {
                return NiveAPI.post(options.resource, 'signin', params, options);
            },

            signOut: function() {
               return NiveAPI.get(options.resource, 'signout', null, options);
            },

            identity: function() {
                return NiveAPI.get(options.resource, 'identity', null, options);
            },

            name: function(params) {
                return NiveAPI.get(options.resource, 'name', params, options);
            },

            profile: function() {
                return NiveAPI.get(options.resource, 'profile', null, options);
            },

            authenticated: function(params) {
                if(angular.isArray(params)) {
                    params = {groups: params};
                }

                if(angular.isString(params)) {
                    params = {groups: [params]};
                }

                return NiveAPI.get(options.resource, 'authenticated', params, options);
            },

            signup: function(params) {
                return NiveAPI.get(options.resource, 'signup', params, options);
            },

            signup2: function(params) {
                if(angular.isString(params)) {
                    params = {token: params};
                }

                return NiveAPI.get(options.resource, 'signup2', params, options);
            },

            update: function(params) {
                return NiveAPI.get(options.resource, 'update', params, options);
            },

            updatePassword: function(params) {
                return NiveAPI.get(options.resource, 'updatePassword', params, options);
            },

            updateEmail: function(params) {
                if(angular.isString(params)) {
                    params = {email: params};
                }

                return NiveAPI.get(options.resource, 'updateEmail', params, options);
            },

            updateEmail2: function(params) {
                if(angular.isString(params)) {
                    params = {token: params};
                }

                return NiveAPI.get(options.resource, 'updateEmail2', params, options);
            },

            resetPassword: function(params) {
                if(angular.isString()) {
                    params = {identity: params};
                }

                return NiveAPI.get(options.resource, 'resetPassword', params, options);
            },

            resetPassword2: function(params) {
                return NiveAPI.get(options.resource, 'resetPassword2', params, options);
            }
        };
    };
});
