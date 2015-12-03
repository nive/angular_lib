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

    var q, niveKvStoreFactory, niveApi, kvStore, rootScope;

    beforeEach(module("nive.services"));

    beforeEach(function() {

        inject(function(_NiveKvStoreFactory_, NiveAPI, $q, $rootScope) {
            niveKvStoreFactory = _NiveKvStoreFactory_;
            niveApi = NiveAPI;
            q = $q;
            rootScope = $rootScope;
        });

        kvStore = niveKvStoreFactory({service: SERVICE});
    });

    it('new instance', function() {
        var instance = niveKvStoreFactory({service: SERVICE});
        expect(instance.options('service')).toEqual(SERVICE);

        instance = niveKvStoreFactory(SERVICE);
        expect(instance.options('service')).toEqual(SERVICE);

        instance = niveKvStoreFactory({service: SERVICE, token: '123456'});
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

});