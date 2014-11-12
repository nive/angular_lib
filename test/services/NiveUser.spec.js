'use strict';
describe('NiveUser', function() {

    var niveApi, user, q, rootScope;

    beforeEach(module("nive.services"));

    beforeEach(function() {
        inject(function(_NiveUser_, NiveAPI, $q, $rootScope) {
            niveApi = NiveAPI;
            user = _NiveUser_;
            q = $q;
            rootScope = $rootScope;
        });
    });

    it('should exist', function() {
        expect(user).toBeDefined();
    });

    it('should check authentication', function() {

        var result = false;

        spyOn(niveApi, 'get').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: true});

            return defer.promise;
        });

        user.authenticated().then(function(res) {
            result = res;
        });

        rootScope.$apply();

        expect(result).toBeTruthy();
    });

    it('should signIn only with correct credentials', function() {

        var identity = 'TestIdentity',
            password = 'TEST',
            result = false;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer(),
                params = angular.fromJson(params);

            if(identity === params.identity && params.password === password) {
                defer.resolve({result: true});
            } else {
                defer.reject({status: 403, data: {message: 'Wrong credentials'}});
            }

            return defer.promise;
        });

        // try sign up with wrong credentials
        user.signIn({identity: 'some', password: password})
            .then(function(res) {
                result = res;
            }, function(res) {
                result = res;
            }
        );

        rootScope.$apply();
        expect(result.status).toEqual(403);

        user.signIn({identity: identity, password: password}).then(function(res) {
            result = res;
        });

        rootScope.$apply();

        expect(result).toBeTruthy();
    });
});
