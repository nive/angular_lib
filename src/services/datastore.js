// Nive KeyValueStore Angular wrapper
// Docs: http://www.nive.co/docs/webapi/datastore.html#api

(function () {
'use strict';

angular.module('nive.services').factory('NiveKvStoreFactory', function(NiveAPI) {

    var __options = {};

    /**
     * KvStore
     *
     * @param {string|Object} options Options passed to constructor, should at least have a service name
     * @constructor
     */
    var KvStore = function KvStore(options) {
        this.options(options);
    };

    /**
     * Factory method for creating a new KvStore instance
     *
     * @param {string|Object} options - Options passed to constructor
     * @static
     * @returns {KvStore} new instance
     */
    KvStore.factory = function(options) {
        return new KvStore(angular.isString(options)? {service: options} : options);
    };

    KvStore.prototype = {

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

        getItem: function(values) {
            if(angular.isString(values)) {
                values = {key: values};
            }

            return NiveAPI.post(this.options('service'), 'getItem', values, this.options());
        },

        newItem: function(values) {
            if(angular.isArray(values)) {
                values = {items: values};
            }

            return NiveAPI.post(this.options('service'), 'newItem', values, this.options());
        },

        setItem: function(values) {
            if(angular.isArray(values)) {
                values = {items: values};
            }

            return NiveAPI.post(this.options('service'), 'setItem', values, this.options());
        },

        removeItem: function(values) {
            if(angular.isString(values)) {
                values = {key: values};
            }

            return NiveAPI.post(this.options('service'), 'removeItem', values, this.options());
        },

        list: function(values) {
            return NiveAPI.post(this.options('service'), 'list', values, this.options());
        },
        keys: function(values) {
            return NiveAPI.post(this.options('service'), 'keys', values, this.options());
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
        getOwner: function(values) {
            return NiveAPI.post(this.options('service'), 'getOwner', values, this.options());
        },
        setOwner: function(values) {
            return NiveAPI.post(this.options('service'), 'setOwner', values, this.options());
        },

        ping: function(values) {
            return NiveAPI.post(this.options('service'), 'ping', values, this.options());
        }
    };

    return KvStore.factory;
});

})();