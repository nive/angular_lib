'use strict';
angular.module('nive.services').factory('NiveFileHostFactory', function(NiveAPI) {

    var  __options = {},

    /**
     * FileHost Class
     *
     * @param {string|Object} options Options passed to constructor, should at least have a resource name
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
        return new FileHost(angular.isString(options)? {resource: options} : options);
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

            return NiveAPI.get(this.options('resource'), '@list', values, this.options());
        },

        getItem: function(values) {
            if(angular.isString(values)) {
                values = {path: values};
            }

            return NiveAPI.get(this.options('resource'), '@getItem', values, this.options());
        }
    };

    return FileHost.factory;
});
