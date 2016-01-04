// (c) 2013-2015 Nive GmbH - nive.io
// This file is released under the MIT-License. See http://jquery.org/license
//
// Nive api endpoint url construction
// Docs: http://www.nive.co/docs/webapi/endpoint.html
//
// Requires <nothing>


window.nive = window.nive || {};
nive.endpoint = nive.endpoint || {};
(function () {
'use strict';


nive.endpoint.makeUrl = function (options, extendedPath) {
    /*
     options: method, service, domain, path, secure, version
     extendedPath: additional relative path to be used in services with tree like structures
    * */
    options = options||{};
    var defaultDomain = '.nive.io';
    var protocol = 'https';

    // protocol
    if(options.secure==false) { protocol = 'http:'; }
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

    // construct path
    var path=extendedPath;
    if(path||options.path) {
        if(!path) {
            path = options.path;
        } else if(options.path&&!path.indexOf('/')==0) {
            if(options.path.lastIndexOf('/')!=path.length-1) { path = '/'+path; }
            path = options.path+path;
        }
        // relative directory
        // this option is not supported by all services
        if(path.indexOf('./')==0||path.indexOf('../')==0) {
            if(!method) {
              return path;
            }
            if(path.lastIndexOf('/')!=path.length-1) { path += '/'; }
            return path + method;
        }
        // remove slash
        if(path.indexOf('/')==0) { path = path.substr(1, path.length); }
        if(path.lastIndexOf('/')==path.length-1) { path = path.substr(0, path.length-1); }
    }

    // service name
    if(!options.service) { throw 'Invalid service name'; }
    var service = options.service||'';

    // make url
    var url = '';
    if(domain) { url = protocol + '//' + domain; }
    url += '/' + service;
    if(version) { url += '/'+version; }
    if(path) { url += '/'+path; }
    if(method) { url += '/'+method; }
    return url;
};

nive.endpoint.EndpointException = function (message) {
    this.message = message;
    this.name = 'EndpointException';
};

})();
