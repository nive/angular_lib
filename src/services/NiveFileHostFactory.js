'use strict';
angular.module('nive.services').factory('NiveFileHostFactory', function(NiveAPI) {

    var  __options = {},

    /**
     * FileHost Class
     *
     * @param {string|Object} options Options passed to constructor, should at least hace a name
     * @constructor
     */
    FileHost = function FileHost(options) {
        this.options(options);
    };

    /**
    * Factory Method, creates a FileHost
    *
    * @param {string|Object} options - Options passed to constructor
    * @static
    * @returns {FileHost} - new FileHost instance
    */
    FileHost.factory = function(options) {
        return new FileHost(options);
    };

    FileHost.prototype = {

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

        list: function(values) {
            if(angular.isString(values)) {
                values = {path: values};
            }

            return NiveAPI.get(this.options('name'), '@list', values, this.options());
        },

        details: function(values) {
            if(angular.isString(values)) {
                values = {path: values};
            }

            return NiveAPI.get(this.options('name'), '@details', values, this.options());
        },

        properties: function(values) {
            if(angular.isString(values)) {
                values = {path: values};
            }

            return NiveAPI.get(this.options('name'), '@properties', values, this.options());
        }
    };

    return FileHost.factory;
});
