// Nive FileStore Angular wrapper
// Docs: http://www.nive.co/docs/webapi/filestore.html#api

(function () {
'use strict';

angular.module('nive.services').factory('NiveFileStoreFactory', function(NiveAPI) {

    var  __options = {};

    /**
     * FileStore Class
     *
     * @param {string|Object} options Options passed to constructor, should at least have a service name
     * @constructor
     */
    var FileStore = function FileStore(options) {
        this.options(options);
    };

    /**
    * Factory Method, creates a FileStore
    *
    * @param {string|Object} options - Options passed to constructor
    * @static
    * @returns {FileStore} - new FileStore instance
    */
    FileStore.factory = function(options) {
        return new FileStore(angular.isString(options)? {service: options} : options);
    };

    FileStore.prototype = {

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
            // values: {name}
            if(angular.isString(values)) {
                values = { name: values };
            }
            return NiveAPI.post(this.options('service'), '@getItem', values, this.options());
        },

        newItem: function(values) {
            // values: {name, contents, type, mime, header}
            return NiveAPI.post(this.options('service'), '@newItem', values, this.options());
        },

        setItem: function(values) {
            // values: {name, contents, mime, header}
            return NiveAPI.post(this.options('service'), '@setItem', values, this.options());
        },

        removeItem: function(values) {
            // values: {name, recursive}
            return NiveAPI.post(this.options('service'), '@removeItem', values, this.options());
        },

        read: function(values) {
            // values: {name}
            if(angular.isString(values)) {
                values = { name: values };
            }
            return NiveAPI.post(this.options('service'), '@read', values, this.options());
        },

        write: function(values) {
            // values: {name, contents}
            return NiveAPI.post(this.options('service'), '@write', values, this.options());
        },

        move: function(values) {
            // values: {name, newpath}
            return NiveAPI.post(this.options('service'), '@move', values, this.options());
        },

        list: function(values) {
            // values: {name, type, sort, order, size, start}
            return NiveAPI.post(this.options('service'), '@list', values, this.options());
        },

        allowed: function(values) {
            // values: {name, permission}
            return NiveAPI.post(this.options('service'), '@allowed', values, this.options());
        },

        getPermissions: function(values) {
            // values: {name}
            if(angular.isString(values)) {
                values = { name: values };
            }
            return NiveAPI.post(this.options('service'), '@getPermissions', values, this.options());
        },

        setPermissions: function(values) {
            // values: {name, permission, group, action}
            return NiveAPI.post(this.options('service'), '@setPermissions', values, this.options());
        },

        getOwner: function(values) {
            // values: {name}
            if(angular.isString(values)) {
                values = { name: values };
            }
            return NiveAPI.post(this.options('service'), '@getOwner', values, this.options());
        },

        setOwner: function(values) {
            // values: {name, owner}
            return NiveAPI.post(this.options('service'), '@setOwner', values, this.options());
        }
    };

    return FileStore.factory;
});

})();