(function () {
'use strict';

angular.module('nive.resource').provider('NiveAPI', function () {

    var _$q,
        successHandler = function (response) {
            return response.data;
        },
        errorHandler = function (response) {

            // if the request was not handled by the server (or what not handles properly - ex. server error),
            // return a general error message
            if (!angular.isObject(response.data) || !response.data.message) {
                return _$q.reject('NiveAPI: An unknown error occurred.');
            }

            // Otherwise, use expected error message.
            return _$q.reject(response.data.message);
        };

    this.successHandler = function (handler) {
        if (angular.isFunction(handler)) {
            successHandler = handler;
        }

        return successHandler;
    };

    this.errorHandler = function (handler) {
        if (angular.isFunction(handler)) {
            errorHandler = handler;
        }

        return errorHandler;
    };

    this.$get = function ($http, $q) {

        _$q = $q;

        return {
            get: function (service, remoteMethod, params, apiOptions) {
                return this.call(service, remoteMethod, params, 'GET', apiOptions);
            },

            post: function (service, remoteMethod, params, apiOptions) {
                return this.call(service, remoteMethod, params, 'POST', apiOptions);
            },

            call: function (service, remoteMethod, params, httpMethod, apiOptions) {

                httpMethod = angular.isString(httpMethod) ? httpMethod : 'GET';

                // build request url
                var url = nive.endpoint.makeUrl(angular.extend({}, {
                    service: service,
                    method: remoteMethod
                }, apiOptions || {}));
                // collect additional headers
                var headers = {};
                if (apiOptions.token) {
                    headers['x-auth-token'] = apiOptions.token;
                }

                var request = $http({
                    method: httpMethod,
                    url: url,
                    data: params,
                    params: httpMethod === 'GET' ? params : '',
                    responseType: 'json',
                    headers: headers
                });

                return request.then(successHandler, errorHandler);
            }
        };
    };
});

})();
