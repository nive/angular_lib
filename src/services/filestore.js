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
            var extendedPath = null;
            // values: {name}
            if(angular.isString(values)) {
                extendedPath = values;
                values = {};
            } else {
                extendedPath = values.name;
                values = {};
            }
            return NiveAPI.post(this.options('service'), '@getItem', values, this.options(), extendedPath);
        },

        newItem: function(values) {
            var extendedPath = null;
            // values: {name, contents, type, mime, header}
            //split name into path and trailing name
            if(values&&values.name) {
                var pos = values.name.lastIndexOf('/');
                if (pos > -1) {
                    extendedPath = values.name.substr(pos + 1);
                    values.name = values.name.substr(0, pos);
                }
            }
            return NiveAPI.post(this.options('service'), '@newItem', values, this.options(), extendedPath);
        },

        setItem: function(values) {
            var extendedPath = null;
            // values: {name, contents, mime, header}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@setItem', values, this.options(), extendedPath);
        },

        removeItem: function(values) {
            var extendedPath = null;
            // values: {name, recursive}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@removeItem', values, this.options(), extendedPath);
        },

        read: function(values) {
            var extendedPath = null;
            // values: {name}
            if(angular.isString(values)) {
                extendedPath = values;
                values = {};
            } else {
                extendedPath = values.name;
                values = {};
            }
            return NiveAPI.post(this.options('service'), '@read', values, this.options(), extendedPath);
        },

        write: function(values) {
            var extendedPath = null;
            // values: {name, contents}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@write', values, this.options(), extendedPath);
        },

        move: function(values) {
            var extendedPath = null;
            // values: {name, newpath}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@move', values, this.options(), extendedPath);
        },

        list: function(values) {
            values=values||{};
            var extendedPath = null;
            // values: {name, type, sort, order, size, start}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@list', values, this.options(), extendedPath);
        },

        allowed: function(values) {
            var extendedPath = null;
            // values: {name, permission}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@allowed', values, this.options(), extendedPath);
        },

        getPermissions: function(values) {
            var extendedPath = null;
            // values: {name}
            if(angular.isString(values)) {
                extendedPath = values;
                values = {};
            } else {
                extendedPath = values.name;
                values = {};
            }
            return NiveAPI.post(this.options('service'), '@getPermissions', values, this.options(), extendedPath);
        },

        setPermissions: function(values) {
            var extendedPath = null;
            // values: {name, permissions}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@setPermissions', values, this.options(), extendedPath);
        },

        getOwner: function(values) {
            var extendedPath = null;
            // values: {name}
            if(angular.isString(values)) {
                extendedPath = values;
                values = {};
            } else {
                extendedPath = values.name;
                values = {};
            }
            return NiveAPI.post(this.options('service'), '@getOwner', values, this.options(), extendedPath);
        },

        setOwner: function(values) {
            var extendedPath = null;
            // values: {name, owner}
            if(values&&values.name) {
                extendedPath = values.name;
                values.name = null;
            }
            return NiveAPI.post(this.options('service'), '@setOwner', values, this.options(), extendedPath);
        }
    };

    return FileStore.factory;
});

})();