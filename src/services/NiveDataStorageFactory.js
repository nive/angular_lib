'use strict';
angular.module('nive.services').factory('NiveDataStorageFactory', function(NiveAPI) {

    var __options = {},

    /**
     * DataStorage
     *
     * @param {string|Object} options Options passed to constructor, should at least have a resource
     * @constructor
     */
    DataStorage = function DataStorage(options) {
        this.options(options);
    };

    /**
     * Factory method for creating a new DataStorage instance
     *
     * @param {string|Object} options - Options passed to constructor
     * @static
     * @returns {DataStorage} new instance
     */
    DataStorage.factory = function(options) {
        return new DataStorage(angular.isString(options)? {resource: options} : options);
    };

    DataStorage.prototype = {

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

        getItem: function(options) {
            if(angular.isString(options)) {
                options = {key: options};
            }

            return NiveAPI.get(this.options('resource'), 'getItem', options, this.options());
        },

        newItem: function(values) {
            if(angular.isArray(values)) {
                values = {items: values};
            }

            return NiveAPI.post(this.options('resource'), 'newItem', values, this.options());
        },

        setItem: function(values) {
            if(angular.isArray(values)) {
                values = {items: values};
            }

            return NiveAPI.post(this.options('resource'), 'setItem', values, this.options());
        },

        removeItem: function(values) {
            if(angular.isString(values)) {
                values = {key: values};
            }

            return NiveAPI.post(this.options('resource'), 'removeItem', values, this.options());
        },

        deleteItem: function(values) {
            return this.removeItem(values);
        },

        list: function(values) {
            return NiveAPI.get(this.options('resource'), 'list', values, this.options());
        },

        keys: function(values) {
            return NiveAPI.get(this.options('resource'), 'keys', values, this.options());
        }
    };

    return DataStorage.factory;
});
