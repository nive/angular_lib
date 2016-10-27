// Nive User Account Service Angular wrapper
// Docs: http://www.nive.co/docs/webapi/userstore.html#api

(function () {
'use strict';

angular.module('nive.services').factory('NiveUserFactory', function(NiveAPI) {

    var __options = {
        service: 'users',
        token: null
    };
    
    /**
     * User Class
     *
     * @param {string|Object} options Options passed to constructor
     * @constructor
     */
    var User = function User(options) {
        this.options(options);
    };

    /**
    * Factory Method, creates a User
    *
    * @param {string|Object} options - Options passed to constructor
    * @static
    * @returns {User} - new User instance
    */
    User.factory = function(options) {
        return new User(options);
    };

    User.prototype = {

        options: function(option, value) {

            switch (true) {
                case angular.isString(option):
                    if(angular.isDefined(value)) {
                        __options[option] = value;
                    } else {
                        return __options[option];
                    }
                    break;
                case angular.isObject(option):
                    angular.extend(__options, option);
                    break;
            }

            return __options;
        },

        token: function(values) {
            var result = NiveAPI.post(this.options('service'), 'token', values, this.options());
            if(result.token) {
                // store token in user instance
                this.options('token', result.token);
            }
            return result;
        },

        signin: function(values) {
            return NiveAPI.post(this.options('service'), 'signin', values, this.options());
        },

        signout: function() {
           var result = NiveAPI.post(this.options('service'), 'signout', null, this.options());
            if(this.options('token')) {
                // remove token from user instance if set
                this.options('token', null);
            }
            return result;
        },

        identity: function() {
            return NiveAPI.get(this.options('service'), 'identity', null, this.options());
        },

        name: function() {
            return NiveAPI.get(this.options('service'), 'name', null, this.options());
        },

        profile: function() {
            return NiveAPI.get(this.options('service'), 'profile', null, this.options());
        },

        authenticated: function(values) {
            if(angular.isArray(values)) {
                values = {groups: values};
            } else if(angular.isString(values)) {
                values = {groups: [values]};
            }
            return NiveAPI.post(this.options('service'), 'authenticated', values, this.options());
        },

        signupDirect: function(values) {
            return NiveAPI.post(this.options('service'), 'signupDirect', values, this.options());
        },
        signupOptin: function(values) {
            return NiveAPI.post(this.options('service'), 'signupOptin', values, this.options());
        },
        signupReview: function(values) {
            return NiveAPI.post(this.options('service'), 'signupReview', values, this.options());
        },
        signupSendpw: function(values) {
            return NiveAPI.post(this.options('service'), 'signupSendpw', values, this.options());
        },
        signupUid: function(values) {
            return NiveAPI.post(this.options('service'), 'signupUid', values, this.options());
        },

        activate: function(values) {
            if(angular.isString(values)) {
                values = {token: values};
            }
            return NiveAPI.post(this.options('service'), 'activate', values, this.options());
        },

        update: function(values) {
            return NiveAPI.post(this.options('service'), 'update', values, this.options());
        },

        updatePassword: function(values) {
            return NiveAPI.post(this.options('service'), 'updatePassword', values, this.options());
        },

        updateEmail: function(values) {
            if(angular.isString(values)) {
                values = {email: values};
            }
            return NiveAPI.post(this.options('service'), 'updateEmail', values, this.options());
        },

        verifyEmail: function(values) {
            if(angular.isString(values)) {
                values = {email: values};
            }
            return NiveAPI.post(this.options('service'), 'verifyEmail', values, this.options());
        },

        verifyEmail2: function(values) {
            if(angular.isString(values)) {
                values = {token: values};
            }
            return NiveAPI.post(this.options('service'), 'verifyEmail2', values, this.options());
        },

        resetPassword: function(values) {
            if(angular.isString()) {
                values = {identity: values};
            }
            return NiveAPI.post(this.options('service'), 'resetPassword', values, this.options());
        },

        resetPassword2: function(values) {
            return NiveAPI.post(this.options('service'), 'resetPassword2', values, this.options());
        },

        message: function(values) {
            return NiveAPI.post(this.options('service'), 'message', values, this.options());
        },

        disable: function(values) {
            return NiveAPI.post(this.options('service'), 'disable', values, this.options());
        },
        delete: function(values) {
            return NiveAPI.post(this.options('service'), 'delete', values, this.options());
        },

        review: function(values) {
            return NiveAPI.post(this.options('service'), 'review', values, this.options());
        },

        list: function(values) {
            return NiveAPI.post(this.options('service'), 'list', values, this.options());
        },
        identities: function(values) {
            return NiveAPI.post(this.options('service'), 'identities', values, this.options());
        },

        getUser: function(values) {
            if(angular.isString(values)) {
                values = {identity: values};
            }
            return NiveAPI.post(this.options('service'), 'getUser', values, this.options());
        },
        setUser: function(values) {
            return NiveAPI.post(this.options('service'), 'setUser', values, this.options());
        },
        removeUser: function(values) {
            if(angular.isString(values)) {
                values = {identity: values};
            }
            return NiveAPI.post(this.options('service'), 'removeUser', values, this.options());
        },

        allowed: function(values) {
            return NiveAPI.post(this.options('service'), 'allowed', values, this.options());
        },

        getPermissions: function(values) {
            return NiveAPI.post(this.options('service'), 'getPermissions', values, this.options());
        },
        setPermissions: function(values) {
            return NiveAPI.post(this.options('service'), 'setPermissions', values, this.options());
        },

        ping: function(values) {
            return NiveAPI.post(this.options('service'), 'ping', values, this.options());
        }
    };

    return User.factory;
});

})();