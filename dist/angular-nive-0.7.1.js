/**
 * (c) 2013-2015 Nive GmbH - www.nive.co
 * 
 * angular-nive v0.7.1
 * http://www.nive.co
 * 
 * License: MIT
 */
'use strict';
angular.module('nive.resource', []);
angular.module('nive.services', ['nive.resource']);
angular.module('nive', ['nive.services']);

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
            token: function(params) {
                return NiveAPI.post(options.resource, 'token', params, options);
            },

            signin: function(params) {
                return NiveAPI.post(options.resource, 'signin', params, options);
            },

            signout: function() {
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
                return NiveAPI.post(options.resource, 'signup', params, options);
            },

            signup2: function(params) {
                if(angular.isString(params)) {
                    params = {token: params};
                }

                return NiveAPI.post(options.resource, 'signup2', params, options);
            },

            update: function(params) {
                return NiveAPI.post(options.resource, 'update', params, options);
            },

            updatePassword: function(params) {
                return NiveAPI.post(options.resource, 'updatePassword', params, options);
            },

            updateEmail: function(params) {
                if(angular.isString(params)) {
                    params = {email: params};
                }

                return NiveAPI.post(options.resource, 'updateEmail', params, options);
            },

            updateEmail2: function(params) {
                if(angular.isString(params)) {
                    params = {token: params};
                }

                return NiveAPI.post(options.resource, 'updateEmail2', params, options);
            },

            resetPassword: function(params) {
                if(angular.isString()) {
                    params = {identity: params};
                }

                return NiveAPI.post(options.resource, 'resetPassword', params, options);
            },

            resetPassword2: function(params) {
                return NiveAPI.post(options.resource, 'resetPassword2', params, options);
            }
        };
    };
});

'use strict';
angular.module('nive.resource').provider('NiveAPI', function() {

        var _$q,
        successHandler = function(response) {
            return response.data;
        },
        errorHandler = function(response) {

            // if the request was not handled by the server (or what not handles properly - ex. server error),
            // return a general error message
            if (!angular.isObject(response.data) || !response.data.message) {
                return _$q.reject('NiveAPI: An unknown error occurred.');
            }

            // Otherwise, use expected error message.
            return _$q.reject(response.data.message);
        };

        this.successHandler = function(handler) {
            if(angular.isFunction(handler)) {
                successHandler = handler;
            }

            return successHandler;
        };

        this.errorHandler = function(handler) {
            if(angular.isFunction(handler)) {
                errorHandler = handler;
            }

            return errorHandler;
        };

        this.$get = function($http, $q) {

            _$q = $q;

            return {
                get: function(resource, remoteMethod, params, apiOptions) {
                    return this.call(resource, remoteMethod, params, 'GET', apiOptions);
                },

                post: function(resource, remoteMethod, params, apiOptions) {
                    return this.call(resource, remoteMethod, params, 'POST', apiOptions);
                },

                call: function(resource, remoteMethod, params, httpMethod, apiOptions) {

                    httpMethod = angular.isString(httpMethod) ? httpMethod : 'GET';

                    // build request url
                    var url = nive.endpoint.apiUrl(angular.extend({}, {
                        name: resource,
                        method: remoteMethod
                    }, apiOptions || {}));
                    // collect additional headers
                    var headers = {};
                    if(apiOptions.token) {
                        headers['x-auth-token'] = apiOptions.token;
                    }

                    var request = $http({
                        method: httpMethod,
                        url: url,
                        data: params,
                        params: 'GET' === httpMethod? params : '',
                        responseType: 'json',
                        headers: headers
                    });

                    return request.then(successHandler, errorHandler);
                }
            };
        };
    }
);

// (c) 2013-2014 Nive GmbH - www.nive.co
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive api endpoint url construction
// ----------------------------------
// Documentation: http://www.nive.co/docs/webapi/endpoints.html
//
// Requires <nothing>

'use strict';

window.nive = window.nive || {};
nive.endpoint = nive.endpoint || {};
(function () {

nive.endpoint.apiUrl = function (options) {
    /* values: method, name, domain, path, secure, relative, outpost */
    options = options||{};
    return nive.endpoint.__makeUrl(options,true);
};

nive.endpoint.widgetUrl = function (options) {
    /* values: method, name, domain, path, secure, outpost */
    options = options||{};
    options.version = 'widgets';
    return nive.endpoint.__makeUrl(options);
};

nive.endpoint.EndpointException = function (message) {
    this.message = message;
    this.name = 'EndpointException';
};


nive.endpoint.__makeUrl = function (options) {
    /* values: method, name, domain, path, secure, outpost */
    options = options||{};
    var defaultDomain = '.nive.io';
    var defaultOutpost = 'http://127.0.0.1:5556';
    var domainPlaceholder = '__domain';
    var devmodePrefix = '__proxy';

    // protocol
    var protocol = options.protocol || document.location.protocol;
    if(options.secure) { protocol = 'https:'; }
    else if(protocol.indexOf(':')!=protocol.length-1) { protocol += ':'; }

    // domain
    var domain = options.domain || '';
    if(domain) {
        // if '.' contained in domain, a fully qualified domain expected
        domain = domain.indexOf('.')==-1 ? domain+defaultDomain : domain;
    }

    // version
    var version = options.version || 'api';

    // method
    var method = options.method;

    // outpost development proxy
    var outpost = options.outpost || defaultOutpost;
    var devmode = window.location.href.indexOf(outpost)==0?9:0;

    // base path
    var path = options.path;
    if(path) {
        // relative directory
        if(path.indexOf('./')==0||path.indexOf('../')==0) {
            // not supported in if devmode=9
            if(path.lastIndexOf('/')!=path.length-1) { path += '/'; }
            return path + method;
        }
        // remove slash
        if(path.indexOf('/')==0) { path = path.substr(1, path.length); }
        if(path.lastIndexOf('/')==path.length-1) { path = path.substr(0, path.length-1); }
    }

    // service name
    if(!options.name && !options.relative) { throw 'Invalid service name'; }
    var name = options.name||'';

    // make url
    var url = '';
    if(devmode==9) {
        if(name=='') { throw 'Service name required in development mode'; }
        if(domain=='') { domain = domainPlaceholder; }
        url = outpost + '/' + devmodePrefix + '/' + domain;
    }
    else if(domain) {
        url = protocol + '//' + domain;
    }
    url += '/' + name;
    if(version) { url += '/'+version; }
    if(path) { url += '/'+path; }
    if(method) { url += '/'+method; }
    return url;
};
})();
