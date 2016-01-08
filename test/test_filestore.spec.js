'use strict';
describe('NiveFileStoreFactory', function() {

    var SERVICE = 'mocks',

        // some mock data
        mocks = [
            {
                name: 'file1.txt',
                type: 'f',
                size: 234,
                contents: 'Hello!',
                mime: 'text/plain',
                header: 'source=local',
                mtime: '2014/03/01 12:15:10',
                ctime: '2014/03/01 11:15:10'
            },
            {
                name: 'folder1',
                type: 'd',
                size: 0,
                mime: '',
                header: 'source=local',
                mtime: '2014/03/01 12:15:10',
                ctime: '2014/03/01 11:15:10'
            }
        ],

        q, niveFileStoreFactory, niveApi, fileStore, rootScope;

    beforeEach(module("nive.services"));

    beforeEach(function() {

        inject(function(_NiveFileStoreFactory_, NiveAPI, $q, $rootScope) {
            niveFileStoreFactory = _NiveFileStoreFactory_;
            niveApi = NiveAPI;
            q = $q;
            rootScope = $rootScope;
        });

        fileStore = niveFileStoreFactory({service: SERVICE});
    });

    it('new instance', function() {
        var instance = niveFileStoreFactory({service: SERVICE});
        expect(instance.options('service')).toEqual(SERVICE);

        instance = niveFileStoreFactory(SERVICE);
        expect(instance.options('service')).toEqual(SERVICE);

        instance = niveFileStoreFactory({service: SERVICE, token: '123456'});
        expect(instance.options('token')).toEqual('123456');
    });

    it('should exist', function() {
        expect(fileStore).toBeDefined();
    });

    it('should create a new item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: 1, success: [params.name]});
            return defer.promise;
        });

        fileStore.newItem({
              name: 'file2.txt', contents: 'some text', type: 'f', mime: 'text/plain', header: 'source=local'
          }).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result.result).toBeTruthy();
        expect(result.success[0]).toEqual('file2.txt');
    });

    it('should fail to create a new item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: 0, messages: ['storage_limit']});
            return defer.promise;
        });

        fileStore.newItem({
              name: 'file2.txt', contents: 'some text', type: 'f', mime: 'text/plain', header: 'source=local'
          }).then(function(response) {
            result = response;
        });

        rootScope.$apply();
        expect(result.result).toBeFalsy();
        expect(result.messages).toBeDefined();
    });

    it('should get a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve(mocks[0]);
            return defer.promise;
        });

        fileStore.getItem({path: mocks[0].name}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.name).toEqual(mocks[0].name);
        expect(result.type).toBeDefined();
        expect(result.mime).toBeDefined();
        expect(result.size).toBeDefined();
        expect(result.header).toBeDefined();
        expect(result.mtime).toBeDefined();
        expect(result.ctime).toBeDefined();
    });

    it('should get a item and map param', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve(mocks[0]);
            return defer.promise;
        });

        fileStore.getItem(mocks[0].name).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.name).toEqual(mocks[0].name);
        expect(result.type).toBeDefined();
        expect(result.mime).toBeDefined();
        expect(result.size).toBeDefined();
        expect(result.header).toBeDefined();
        expect(result.mtime).toBeDefined();
        expect(result.ctime).toBeDefined();
    });

    it('should update a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 1});
            return defer.promise;
        });

        fileStore.setItem({
              path: 'file2.txt', contents: 'some text', mime: 'text/plain', header: 'source=local'
          }).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result.result).toBeTruthy();
    });

    it('should fail to update a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 0, messages: ['storage_limit']});
            return defer.promise;
        });

        fileStore.setItem({
              path: 'file2.txt', contents: 'some text', mime: 'text/plain', header: 'source=local'
          }).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result.result).toBeFalsy();
        expect(result.messages).toBeDefined();
    });

    it('should remove a file', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 1});
            return defer.promise;
        });

        fileStore.removeItem({path: 'file1.txt'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toEqual(1);
    });

    it('should remove a folder', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 2});
            return defer.promise;
        });

        fileStore.removeItem({path: 'folder1', recursive: true}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toEqual(2);
    });

    it('should not remove a folder recursive', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            params = angular.fromJson(params);
            var defer = q.defer();
            defer.resolve({result: 0, messages: ['not_empty']});
            return defer.promise;
        });

        fileStore.removeItem({path: 'folder1', recursive: false}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toEqual(0);
        expect(result.messages).toBeDefined();
    });

    it('should read a file', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve(mocks[0].contents);
            return defer.promise;
        });

        fileStore.read({path: mocks[0].name}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result).toEqual(mocks[0].contents);
    });

    it('should read a file and map param', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            expect(params.path).toBeUndefined();
            var defer = q.defer();
            defer.resolve(mocks[0].contents);
            return defer.promise;
        });

        fileStore.read(mocks[0].name).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result).toEqual(mocks[0].contents);
    });

    it('should write a file', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: 1});
            return defer.promise;
        });

        fileStore.write({path: mocks[0].name, contents: 'Updated.'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should fail to write a file', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: false, messages: ['storage_limit']});
            return defer.promise;
        });

        fileStore.write({path: mocks[0].name, contents: 'Updated.'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeFalsy();
        expect(result.messages).toBeDefined();
    });

    it('should move a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: 1});
            return defer.promise;
        });

        fileStore.move({path: mocks[0].name, newpath: 'newfilename.txt'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

    it('should fail to move a item', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({result: false, messages: ['not_found']});
            return defer.promise;
        });

        fileStore.move({path: mocks[0].name, newpath: '/no_folder/'}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeFalsy();
        expect(result.messages).toBeDefined();
    });

    it('should list stored items', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({start: 1, size: 20, items: mocks});
            return defer.promise;
        });

        fileStore.list().then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.items.length).toEqual(mocks.length);
    });

    it('should list selected items', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({start: 1, size: 50, items: mocks});
            return defer.promise;
        });

        fileStore.list({
            type: 'f', sort: 'size', order: '<', size: 50, start: 1
        }).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.items.length).toEqual(mocks.length);
    });

    it('should show access allowed', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve({removeItem: true});
            return defer.promise;
        });

        fileStore.allowed({path: 'file1.txt', permission: 'removeItem'}).then(function(response) {
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
            defer.resolve({removeItem: false, write: true});
            return defer.promise;
        });

        fileStore.allowed({path: 'file1.txt', permission: ['removeItem', 'write']}).then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result['removeItem']).toBeFalsy();
        expect(result['write']).toBeTruthy();
    });

    it('should show permissions', function() {
        var result = null;

        spyOn(niveApi, 'post').and.callFake(function(resource, remoteMethod, params) {
            var defer = q.defer();
            defer.resolve([['newItem', ['sys:authenticated']], ['getItem', ['sys:owner','admins']]]);
            return defer.promise;
        });

        fileStore.getPermissions({path: 'file1.txt'}).then(function(response) {
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

        fileStore.setPermissions({path: 'file1.txt', permissions: {permission: 'newItem', group: 'sys:owner'}}).then(function(response) {
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

        fileStore.setPermissions({path: 'file1.txt', permissions: [{permission: 'newItem', group: 'sys:owner'},
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

        fileStore.setPermissions({path: 'file1.txt', permissions: {permission: 'newItem', group: 'sys:owner', action: 'revoke'}}).then(function(response) {
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

        fileStore.setPermissions({path: 'file1.txt', permissions: {permission: 'whatever', group: 'sys:owner'}}).then(function(response) {
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

        fileStore.getOwner({path: 'file1.txt'}).then(function(response) {
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

        fileStore.setOwner({path: 'file1.txt', owner: 'Test 1'}).then(function(response) {
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

        fileStore.setOwner({path: 'file1.txt', owner: 'whatever'}).then(function(response) {
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

        fileStore.ping().then(function(response) {
            result = response;
        });

        rootScope.$apply();

        expect(result).not.toBeNull();
        expect(result.result).toBeTruthy();
    });

});