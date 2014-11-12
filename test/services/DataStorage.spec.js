'use strict';
describe('NiveDataStorageFactory', function() {

    var RESOURCE = 'mocks',
        RESOURCE_KEY = 'mock',

        // some mock data
        mocks = [
            {
                id: 1,
                key: RESOURCE_KEY,
                text: 'first stored note ever!',
                timestamp: 1414747731.52867
            },
            {
                id: 2,
                key: RESOURCE_KEY,
                text: 'yet another note',
                timestamp: 1414747731.52834
            }
        ],

        q, niveDataStorageFactory, niveApi, dataStorage, rootScope;

    beforeEach(module("nive.services"));

    beforeEach(function() {

        inject(function(_NiveDataStorageFactory_, NiveAPI, $q, $rootScope) {
            niveDataStorageFactory = _NiveDataStorageFactory_;
            niveApi = NiveAPI;
            q = $q;
            rootScope = $rootScope;
        });

        dataStorage = niveDataStorageFactory({resource: RESOURCE});
    });

    it('should exist', function() {
        expect(dataStorage).toBeDefined();
    });

    it('should create a new item', function() {

        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer(),
                params = angular.fromJson(params);

            // resolve if all params are correct
            if(resource === RESOURCE && params.key === RESOURCE_KEY && angular.isDefined(params.value)) {
                defer.resolve({result: 1, success: [5]});
            }

            return defer.promise;
        });

        dataStorage.newItem({key: RESOURCE_KEY, value: 'some text'}).then(function(res) {
            result = res;
        });

        rootScope.$apply();

        expect(result.success[0]).toEqual(5);
    });

    it('should return stored items', function() {

        spyOn(niveApi, 'get').and.callFake(function() {
            var defer = q.defer();
            defer.resolve({total: 1, items: mocks});
            return defer.promise;
        });

        var result = null;

        dataStorage.list().then(function(response) {
            result = response;
            expect(result.items.length).toEqual(mocks.length);
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
    });

    it('should update a item', function() {

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({total: 1, success: [params.id]});
            return defer.promise;
        });

        var itemId = 1,
            result = null;

        dataStorage.setItem({id:itemId, key: RESOURCE_KEY, value: 'some updated value'}).then(function(response) {
            result = response;
            expect(result.success[0]).toEqual(itemId);
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
    });
});