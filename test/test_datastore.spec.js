'use strict';
describe('NiveKvStorageFactory', function() {

    var SERVICE = 'mocks',
        KEY = 'key',

        // some mock data
        mocks = [
            {
                key: KEY+"1",
                value: 'first stored note ever!',
                id: 1,
                timestamp: 1414747731.52867
            },
            {
                key: KEY+"2",
                value: 'yet another note',
                id: 2,
                timestamp: 1414747731.52834
            }
        ];

    var q, niveDataStoreFactory, niveApi, kvStore, rootScope;

    beforeEach(module("nive.services"));

    beforeEach(function() {

        inject(function(_NiveDataStoreFactory_, NiveAPI, $q, $rootScope) {
            niveDataStoreFactory = _NiveDataStoreFactory_;
            niveApi = NiveAPI;
            q = $q;
            rootScope = $rootScope;
        });

        kvStore = niveDataStoreFactory({service: SERVICE});
    });

    it('new instance', function() {
        var instance = niveDataStoreFactory({service: SERVICE});
        expect(instance.options('service')).toEqual(SERVICE);

        instance = niveDataStoreFactory(SERVICE);
        expect(instance.options('service')).toEqual(SERVICE);

        instance = niveDataStoreFactory({service: SERVICE, token: '123456'});
        expect(instance.options('token')).toEqual('123456');
    });

    it('should exist', function() {
        expect(kvStore).toBeDefined();
    });

    it('should create a new item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 1, success: [params.items.key]});
            return defer.promise;
        });

        kvStore.newItem({items: {key: KEY, value: 'some text'}}).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result.success[0]).toEqual(KEY);
    });

    it('should create multiple new items', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise;
        });

        kvStore.newItem({items: [{key: KEY+"4", value: 'some text'},
                                 {key: KEY+"5", value: 12345}]}).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(KEY+"4");
        expect(result.success[1]).toEqual(KEY+"5");
    });

    it('should create a new item and map param', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            expect(params.items.length).toEqual(2);
            var defer = q.defer();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise;
        });

        kvStore.newItem([{key: KEY+"4", value: 'some text'},
                         {key: KEY+"5", value: 12345}]).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(KEY+"4");
        expect(result.success[1]).toEqual(KEY+"5");
    });

    it('should get a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve(mocks[0]);
            return defer.promise;
        });

        kvStore.getItem({key: KEY+"1"}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.key).toEqual(KEY+"1");
        expect(result.value).toEqual(mocks[0].value);
    });

    it('should get a item and map param', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            expect(params.key).toEqual(KEY+"1");
            var defer = q.defer();
            defer.resolve(mocks[0]);
            return defer.promise;
        });

        kvStore.getItem(KEY+"1").then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.key).toEqual(KEY+"1");
        expect(result.value).toEqual(mocks[0].value);
    });

    it('should update a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 1, success: [params.items.key]});
            return defer.promise;
        });

        kvStore.setItem({items: {key: KEY+"1", value: 'some text'}}).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result.success[0]).toEqual(KEY+"1");
    });

    it('should update multiple items', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise;
        });

        kvStore.setItem({items: [{key: KEY+"1", value: 'some text'},
                                 {key: KEY+"2", value: 12345}]}).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(KEY+"1");
        expect(result.success[1]).toEqual(KEY+"2");
    });

    it('should update items and map param', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            expect(params.items.length).toEqual(2);
            var defer = q.defer();
            defer.resolve({result: 2, success: [params.items[0].key, params.items[1].key]});
            return defer.promise;
        });

        kvStore.setItem([{key: KEY+"1", value: 'some text'},
                         {key: KEY+"2", value: 12345}]).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
        expect(result.success[0]).toEqual(KEY+"1");
        expect(result.success[1]).toEqual(KEY+"2");
    });

    it('should remove a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 1, success: [params.keys]});
            return defer.promise;
        });

        kvStore.removeItem({key: KEY+"1"}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toEqual(1);
    });

    it('should remove a item and map param', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            expect(params.key).not.toBeNull();
            var defer = q.defer();
            defer.resolve({result: 1, success: [params.keys]});
            return defer.promise;
        });

        kvStore.removeItem(KEY+"1").then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toEqual(1);
    });

    it('should list stored items', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({total: 1, items: mocks});
            return defer.promise;
        });

        kvStore.list().then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.items.length).toEqual(mocks.length);
    });

    it('should list stored keys', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({keys: [KEY]});
            return defer.promise;
        });

        kvStore.keys().then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.keys.length).toEqual(1);
        expect(result.keys[0]).toEqual(KEY);
    });

    it('should show access allowed', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({removeItem: true});
            return defer.promise;
        });

        kvStore.allowed({permission: 'removeItem'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result['removeItem']).toBeTruthy();
    });

    it('should show multiple access allowed', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({removeItem: false, setItem: true});
            return defer.promise;
        });

        kvStore.allowed({permission: ['removeItem', 'setItem']}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result['removeItem']).toBeFalsy();
        expect(result['setItem']).toBeTruthy();
    });

    it('should show permissions', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve([['newItem', ['sys:authenticated']], ['getItem', ['sys:owner','admins']]]);
            return defer.promise;
        });

        kvStore.getPermissions({}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.length).toBeTruthy();
    });

    it('should set permissions', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: true});
            return defer.promise;
        });

        kvStore.setPermissions({permissions: {permission: 'newItem', group: 'sys:owner'}}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should set multiple permissions', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: true});
            return defer.promise;
        });

        kvStore.setPermissions({permissions: [{permission: 'newItem', group: 'sys:owner'},
                                              {permission: 'getItem', group: 'sys:owner'}]}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should set permissions revoke', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: true});
            return defer.promise;
        });

        kvStore.setPermissions({permissions: {permission: 'newItem', group: 'sys:owner', action: 'revoke'}}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should fail to set permissions', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: false, messages: ['unknown_permission']});
            return defer.promise;
        });

        kvStore.setPermissions({permissions: {permission: 'whatever', group: 'sys:owner'}}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeFalsy();
        expect(result.messages).toBeDefined();
    });

    it('should show owner', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({owner: 'Test'});
            return defer.promise;
        });

        kvStore.getOwner({key: KEY}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.owner).toEqual('Test');
    });

    it('should set owner', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: true});
            return defer.promise;
        });

        kvStore.setOwner({key: KEY, owner: 'Test 1'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should fail to set owner', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: false, messages: ['unknown_user']});
            return defer.promise;
        });

        kvStore.setOwner({key: KEY, owner: 'whatever'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeFalsy();
        expect(result.messages).toBeDefined();
    });

    it('should call ping', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: 1});
            return defer.promise;
        });

        kvStore.ping().then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

});