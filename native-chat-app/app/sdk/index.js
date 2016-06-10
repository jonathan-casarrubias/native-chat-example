"use strict";
/**
* @module LoopBack SDK for NativeScript
* @author Jonathan Casarrubias <http://twitter.com/johncasarrubias>
* @description
* This module provide 2 types of communication with a LoopBack API
*
* 1.- Standard RESTful Communication.- HTTP Requests implementing
*     methods like POST, PUT, GET, DELETE
*
*     Example: Room.create({});  <-- Creates a new room using REST
*
* 2.- SocketIO Communication (PubSub).- WebSocket Communication for
*     publish subscriptions.
*
*     Example: Room.onCreate().subscribe(); <-- Listen for new rooms
*     using web sockets.
*
* NOTE: Currently Socket Communication is only supported for Android
* IOS will be added ASAP
*
* NativeScript App_Resources Setup
*
* Make sure you update your App_Resources/Android/app.gradle file by adding
*
* dependencies {
*   compile ('io.socket:socket.io-client:0.7.0') {
*     exclude group: 'org.json', module: 'json'
*   }
* }
**/
/* tslint:disable */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
require('rxjs/add/observable/throw');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/share');
var AppSettings = require('application-settings');
var SocketIO = require('nativescript-socket.io');
var SocketConnections = (function () {
    function SocketConnections() {
    }
    SocketConnections.getHandler = function (url, token) {
        if (!SocketConnections.connections[url])
            SocketConnections.connections[url] = SocketIO.connect(url, {
                log: false,
                secure: false,
                forceWebsockets: true,
            });
        SocketConnections.connections[url].on('connect', function () {
            console.log('Connected, trying to authenticate');
            SocketConnections.connections[url].emit('authentication', token);
            SocketConnections.connections[url].on('unauthorized', function (res) { return console.error('Unauthenticated', res); });
        });
        return SocketConnections.connections[url];
    };
    SocketConnections.connections = {};
    return SocketConnections;
}());
var LoopBackConfig = (function () {
    function LoopBackConfig() {
    }
    LoopBackConfig.setApiVersion = function (version) {
        if (version === void 0) { version = "api"; }
        LoopBackConfig.version = version;
    };
    LoopBackConfig.getApiVersion = function () {
        return LoopBackConfig.version;
    };
    LoopBackConfig.setBaseURL = function (url) {
        if (url === void 0) { url = "/"; }
        LoopBackConfig.path = url;
    };
    LoopBackConfig.getPath = function () {
        return LoopBackConfig.path;
    };
    return LoopBackConfig;
}());
exports.LoopBackConfig = LoopBackConfig;
var LoopBackAuth = (function () {
    function LoopBackAuth() {
        this.propsPrefix = '$LoopBack$';
        this.accessTokenId = this.load("accessTokenId");
        this.currentUserId = this.load("currentUserId");
        this.rememberMe = this.load("rememberMe");
        this.currentUserData = null;
    }
    LoopBackAuth.prototype.setRememberMe = function (value) {
        this.rememberMe = value;
        return this;
    };
    LoopBackAuth.prototype.getCurrentUserId = function () {
        return this.currentUserId;
    };
    LoopBackAuth.prototype.setCurrentUserData = function (data) {
        this.currentUserData = data;
        return this;
    };
    LoopBackAuth.prototype.getCurrentUserData = function () {
        return this.currentUserData;
    };
    LoopBackAuth.prototype.getAccessTokenId = function () {
        return this.accessTokenId;
    };
    LoopBackAuth.prototype.save = function () {
        this.saveThis("accessTokenId", this.accessTokenId);
        this.saveThis("currentUserId", this.currentUserId);
        this.saveThis("rememberMe", this.rememberMe);
    };
    ;
    LoopBackAuth.prototype.setUser = function (accessTokenId, userId, userData) {
        this.accessTokenId = accessTokenId;
        this.currentUserId = userId;
        this.currentUserData = userData;
    };
    LoopBackAuth.prototype.clearUser = function () {
        this.accessTokenId = null;
        this.currentUserId = null;
        this.currentUserData = null;
    };
    LoopBackAuth.prototype.clearStorage = function () {
        this.saveThis("accessTokenId", null);
        this.saveThis("accessTokenId", null);
        this.saveThis("currentUserId", null);
        this.saveThis("currentUserId", null);
        this.saveThis("rememberMe", null);
        this.saveThis("rememberMe", null);
    };
    ;
    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    LoopBackAuth.prototype.saveThis = function (name, value) {
        try {
            var key = this.propsPrefix + name;
            if (value == null) {
                value = '';
            }
            AppSettings.setString(key, String(value));
        }
        catch (err) {
            console.log('Cannot access local/session storage:', err);
        }
    };
    LoopBackAuth.prototype.load = function (name) {
        var key = this.propsPrefix + name;
        return AppSettings.getString(key);
    };
    return LoopBackAuth;
}());
var auth = new LoopBackAuth();
/**
 * Default error handler
 */
var ErrorHandler = (function () {
    function ErrorHandler() {
    }
    ErrorHandler.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
var BaseLoopBackApi = (function () {
    function BaseLoopBackApi(http, errorHandler) {
        this.http = http;
        this.errorHandler = errorHandler;
        if (!errorHandler) {
            this.errorHandler = new ErrorHandler();
        }
        this.init();
    }
    BaseLoopBackApi.prototype.init = function () {
        LoopBackConfig.setBaseURL("/");
    };
    /**
    * Process request
    * @param string  method    Request method (GET, POST, PUT)
    * @param string  url       Request url (my-host/my-url/:id)
    * @param any     urlParams Values of url parameters
    * @param any     params    Parameters for building url (filter and other)
    * @param any     data      Request body
    * @param boolean isio      Request socket connection
    */
    BaseLoopBackApi.prototype.request = function (method, url, urlParams, params, data, isio) {
        if (urlParams === void 0) { urlParams = {}; }
        if (params === void 0) { params = {}; }
        if (data === void 0) { data = null; }
        if (isio === void 0) { isio = false; }
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        if (auth.getAccessTokenId()) {
            headers.append('Authorization', auth.getAccessTokenId());
        }
        var requestUrl = url;
        var key;
        for (key in urlParams) {
            requestUrl = requestUrl.replace(new RegExp(":" + key + "(\/|$)", "g"), urlParams[key] + "$1");
        }
        var parameters = [];
        for (var param in params) {
            parameters.push(param + '=' + (typeof params[param] === 'object' ? JSON.stringify(params[param]) : params[param]));
        }
        requestUrl += (parameters ? '?' : '') + parameters.join('&');
        if (isio) {
            var event_1 = ("[" + method + "]" + requestUrl).replace(/\?/, '');
            var subject_1 = new Subject_1.Subject();
            var socket = SocketConnections.getHandler(LoopBackConfig.getPath(), {
                id: auth.getAccessTokenId(),
                userId: auth.getCurrentUserId()
            });
            socket.on(event_1, function (res) { return subject_1.next(res); });
            return subject_1.asObservable();
        }
        else {
            var request = new http_1.Request({
                headers: headers,
                method: method,
                url: requestUrl,
                body: data ? JSON.stringify(data) : undefined
            });
            return this.http.request(request)
                .map(function (res) { return (res.text() != "" ? res.json() : {}); })
                .catch(this.errorHandler.handleError);
        }
    };
    BaseLoopBackApi = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Optional()),
        __param(1, core_1.Inject(ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, ErrorHandler])
    ], BaseLoopBackApi);
    return BaseLoopBackApi;
}());
exports.BaseLoopBackApi = BaseLoopBackApi;
/**
 * Api for the `User` model.
 */
var UserApi = (function (_super) {
    __extends(UserApi, _super);
    function UserApi(http, errorHandler) {
        _super.call(this, http, errorHandler);
    }
    /**
     * Find a related item by id for accessTokens.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for accessTokens
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.__findById__accessTokens = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onFindByIdAccessTokens = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for accessTokens.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for accessTokens
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    UserApi.prototype.__destroyById__accessTokens = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onDestroyByIdAccessTokens = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for accessTokens.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for accessTokens
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.__updateById__accessTokens = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    UserApi.prototype.onUpdateByIdAccessTokens = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Queries accessTokens of User.
     *
     * @param any id User id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.__get__accessTokens = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onGetAccessTokens = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in accessTokens of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.__create__accessTokens = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    UserApi.prototype.onCreateAccessTokens = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all accessTokens of this model.
     *
     * @param any id User id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    UserApi.prototype.__delete__accessTokens = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onDeleteAccessTokens = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts accessTokens of User.
     *
     * @param any id User id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    UserApi.prototype.__count__accessTokens = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onCountAccessTokens = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/accessTokens/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.create = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    UserApi.prototype.onCreate = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.createMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    UserApi.prototype.onCreateMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Update an existing model instance or insert a new one into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.upsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    UserApi.prototype.onUpsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Check whether a model instance exists in the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `exists` – `{boolean}` -
     */
    UserApi.prototype.exists = function (id) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onExists = function (id) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @param object filter Filter defining fields and include
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.findById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onFindById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find all instances of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.find = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onFind = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find first instance of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.findOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onFindOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * The number of instances updated
     */
    UserApi.prototype.updateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    UserApi.prototype.onUpdateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Delete a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.deleteById = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onDeleteById = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Count instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    UserApi.prototype.count = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onCount = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update attributes for a model instance and persist it into the data source.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `User` object.)
     * </em>
     */
    UserApi.prototype.updateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    UserApi.prototype.onUpdateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a change stream.
     *
     * @param object data Request data.
     *
     *  - `options` – `{object}` -
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `changes` – `{ReadableStream}` -
     */
    UserApi.prototype.createChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    UserApi.prototype.onCreateChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options, true);
        return result;
    };
    /**
     * Login a user with username/email and password.
     *
     * @param string include Related objects to include in the response. See the description of return value for more details.
     *   Default value: `user`.
     *
     *  - `rememberMe` - `boolean` - Whether the authentication credentials
     *     should be remembered in localStorage across app/browser restarts.
     *     Default: `true`.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * The response body contains properties of the AccessToken created on login.
     * Depending on the value of `include` parameter, the body may contain additional properties:
     *
     *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
     *
     *
     */
    UserApi.prototype.login = function (credentials, include) {
        if (include === void 0) { include = "user"; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/login";
        var urlParams = {};
        var params = {};
        if (include !== undefined) {
            params.include = include;
        }
        this.logout();
        var result = this.request(method, url, urlParams, params, credentials)
            .share();
        result.subscribe(function (response) {
            auth.setUser(response.id, response.userId, response.user);
            auth.setRememberMe(true);
            auth.save();
        }, function () { return null; });
        return result;
    };
    UserApi.prototype.onLogin = function (credentials, include) {
        if (include === void 0) { include = "user"; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/login";
        var urlParams = {};
        var params = {};
        if (include !== undefined) {
            params.include = include;
        }
        var result = this.request(method, url, urlParams, params, credentials, true)
            .share();
        result.subscribe(function (response) {
            auth.setUser(response.id, response.userId, response.user);
            auth.setRememberMe(true);
            auth.save();
        }, function () { return null; });
        return result;
    };
    /**
     * Logout a user with access token.
     *
     * @param object data Request data.
     *
     *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    UserApi.prototype.logout = function () {
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/logout";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params)
            .share();
        result.subscribe(function () {
            auth.clearUser();
            auth.clearStorage();
        }, function () { return null; });
        return result;
    };
    UserApi.prototype.onLogout = function () {
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/logout";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, true)
            .share();
        result.subscribe(function () {
            auth.clearUser();
            auth.clearStorage();
        }, function () { return null; });
        return result;
    };
    /**
     * Confirm a user registration with email verification token.
     *
     * @param string uid
     *
     * @param string token
     *
     * @param string redirect
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    UserApi.prototype.confirm = function (uid, token, redirect) {
        if (redirect === void 0) { redirect = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/confirm";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    UserApi.prototype.onConfirm = function (uid, token, redirect) {
        if (redirect === void 0) { redirect = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/confirm";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Reset password for a user with email.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    UserApi.prototype.resetPassword = function (options) {
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/Users/reset";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    UserApi.prototype.onResetPassword = function (options) {
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/Users/reset";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options, true);
        return result;
    };
    /**
     * @ngdoc method
     * @name lbServices.User#getCurrent
     * @methodOf lbServices.User
     *
     * @description
     *
     * Get data of the currently logged user. Fail with HTTP result 401
     * when there is no user logged in.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     */
    UserApi.prototype.getCurrent = function () {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/Users" + "/:id";
        var id = auth.getCurrentUserId();
        if (id == null) {
            id = '__anonymous__';
        }
        var urlParams = {
            id: id
        };
        var result = this.request(method, url, urlParams)
            .share();
        result.subscribe(function (response) {
            auth.setCurrentUserData(response);
            return response.resource;
        }, function () { return null; });
        return result;
    };
    /**
     * Get data of the currently logged user that was returned by the last
     * call to {@link lbServices.User#login} or
     * {@link lbServices.User#getCurrent}. Return null when there
     * is no user logged in or the data of the current user were not fetched
     * yet.
     *
     * @returns object A User instance.
     */
    UserApi.prototype.getCachedCurrent = function () {
        return auth.getCurrentUserData();
    };
    /**
     * @name lbServices.User#isAuthenticated
     *
     * @returns {boolean} True if the current user is authenticated (logged in).
     */
    UserApi.prototype.isAuthenticated = function () {
        return this.getCurrentId() != null;
    };
    /**
     * @name lbServices.User#getCurrentId
     *
     * @returns object Id of the currently logged-in user or null.
     */
    UserApi.prototype.getCurrentId = function () {
        return auth.getCurrentUserId();
    };
    /**
     * The name of the model represented by this $resource,
     * i.e. `User`.
     */
    UserApi.prototype.getModelName = function () {
        return "User";
    };
    UserApi = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Optional()),
        __param(1, core_1.Inject(ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, ErrorHandler])
    ], UserApi);
    return UserApi;
}(BaseLoopBackApi));
exports.UserApi = UserApi;
/**
 * Api for the `Account` model.
 */
var AccountApi = (function (_super) {
    __extends(AccountApi, _super);
    function AccountApi(http, errorHandler) {
        _super.call(this, http, errorHandler);
    }
    /**
     * Find a related item by id for accessTokens.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for accessTokens
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__findById__accessTokens = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onFindByIdAccessTokens = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for accessTokens.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for accessTokens
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__destroyById__accessTokens = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDestroyByIdAccessTokens = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for accessTokens.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for accessTokens
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__updateById__accessTokens = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpdateByIdAccessTokens = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Find a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__findById__rooms = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onFindByIdRooms = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__destroyById__rooms = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDestroyByIdRooms = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__updateById__rooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpdateByIdRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Add a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__link__rooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onLinkRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Remove the rooms relation to an item by id.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__unlink__rooms = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onUnlinkRooms = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Check the existence of rooms relation to an item by id.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__exists__rooms = function (id, fk) {
        var method = "HEAD";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onExistsRooms = function (id, fk) {
        var method = "HEAD";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find a related item by id for messages.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__findById__messages = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onFindByIdMessages = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for messages.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__destroyById__messages = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDestroyByIdMessages = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for messages.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for messages
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__updateById__messages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpdateByIdMessages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Queries accessTokens of Account.
     *
     * @param any id User id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__get__accessTokens = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onGetAccessTokens = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in accessTokens of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__create__accessTokens = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreateAccessTokens = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all accessTokens of this model.
     *
     * @param any id User id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__delete__accessTokens = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteAccessTokens = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts accessTokens of Account.
     *
     * @param any id User id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    AccountApi.prototype.__count__accessTokens = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onCountAccessTokens = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Queries rooms of Account.
     *
     * @param any id User id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__get__rooms = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onGetRooms = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in rooms of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__create__rooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreateRooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all rooms of this model.
     *
     * @param any id User id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__delete__rooms = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteRooms = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts rooms of Account.
     *
     * @param any id User id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    AccountApi.prototype.__count__rooms = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onCountRooms = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Queries messages of Account.
     *
     * @param any id User id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__get__messages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onGetMessages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in messages of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__create__messages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreateMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all messages of this model.
     *
     * @param any id User id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__delete__messages = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteMessages = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts messages of Account.
     *
     * @param any id User id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    AccountApi.prototype.__count__messages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onCountMessages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.create = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreate = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.createMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreateMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Update an existing model instance or insert a new one into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.upsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Check whether a model instance exists in the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `exists` – `{boolean}` -
     */
    AccountApi.prototype.exists = function (id) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onExists = function (id) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @param object filter Filter defining fields and include
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.findById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onFindById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find all instances of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.find = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onFind = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find first instance of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.findOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onFindOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * The number of instances updated
     */
    AccountApi.prototype.updateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpdateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Delete a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.deleteById = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteById = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Count instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    AccountApi.prototype.count = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onCount = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update attributes for a model instance and persist it into the data source.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.updateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpdateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a change stream.
     *
     * @param object data Request data.
     *
     *  - `options` – `{object}` -
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `changes` – `{ReadableStream}` -
     */
    AccountApi.prototype.createChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    AccountApi.prototype.onCreateChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options, true);
        return result;
    };
    /**
     * Login a user with username/email and password.
     *
     * @param string include Related objects to include in the response. See the description of return value for more details.
     *   Default value: `user`.
     *
     *  - `rememberMe` - `boolean` - Whether the authentication credentials
     *     should be remembered in localStorage across app/browser restarts.
     *     Default: `true`.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * The response body contains properties of the AccessToken created on login.
     * Depending on the value of `include` parameter, the body may contain additional properties:
     *
     *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
     *
     *
     */
    AccountApi.prototype.login = function (credentials, include) {
        if (include === void 0) { include = "user"; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/login";
        var urlParams = {};
        var params = {};
        if (include !== undefined) {
            params.include = include;
        }
        this.logout();
        var result = this.request(method, url, urlParams, params, credentials)
            .share();
        result.subscribe(function (response) {
            auth.setUser(response.id, response.userId, response.user);
            auth.setRememberMe(true);
            auth.save();
        }, function () { return null; });
        return result;
    };
    AccountApi.prototype.onLogin = function (credentials, include) {
        if (include === void 0) { include = "user"; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/login";
        var urlParams = {};
        var params = {};
        if (include !== undefined) {
            params.include = include;
        }
        var result = this.request(method, url, urlParams, params, credentials, true)
            .share();
        result.subscribe(function (response) {
            auth.setUser(response.id, response.userId, response.user);
            auth.setRememberMe(true);
            auth.save();
        }, function () { return null; });
        return result;
    };
    /**
     * Logout a user with access token.
     *
     * @param object data Request data.
     *
     *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.logout = function () {
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/logout";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params)
            .share();
        result.subscribe(function () {
            auth.clearUser();
            auth.clearStorage();
        }, function () { return null; });
        return result;
    };
    AccountApi.prototype.onLogout = function () {
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/logout";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, true)
            .share();
        result.subscribe(function () {
            auth.clearUser();
            auth.clearStorage();
        }, function () { return null; });
        return result;
    };
    /**
     * Confirm a user registration with email verification token.
     *
     * @param string uid
     *
     * @param string token
     *
     * @param string redirect
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.confirm = function (uid, token, redirect) {
        if (redirect === void 0) { redirect = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/confirm";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onConfirm = function (uid, token, redirect) {
        if (redirect === void 0) { redirect = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/confirm";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Reset password for a user with email.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.resetPassword = function (options) {
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/reset";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    AccountApi.prototype.onResetPassword = function (options) {
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/reset";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options, true);
        return result;
    };
    /**
     * Find a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__findById__Room__accounts = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onFindByIdRoomAccounts = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__destroyById__Room__accounts = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDestroyByIdRoomAccounts = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__updateById__Room__accounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpdateByIdRoomAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Add a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__link__Room__accounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onLinkRoomAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Remove the accounts relation to an item by id.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__unlink__Room__accounts = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onUnlinkRoomAccounts = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Check the existence of accounts relation to an item by id.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__exists__Room__accounts = function (id, fk) {
        var method = "HEAD";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onExistsRoomAccounts = function (id, fk) {
        var method = "HEAD";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Queries accounts of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__get__Room__accounts = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onGetRoomAccounts = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in accounts of this model.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__create__Room__accounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreateRoomAccounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Creates a new instance in accounts of this model.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__createMany__Room__accounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreateManyRoomAccounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all accounts of this model.
     *
     * @param any id PersistedModel id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    AccountApi.prototype.__delete__Room__accounts = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteRoomAccounts = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts accounts of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    AccountApi.prototype.__count__Room__accounts = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onCountRoomAccounts = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Fetches belongsTo relation account.
     *
     * @param any id PersistedModel id
     *
     * @param boolean refresh
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Account` object.)
     * </em>
     */
    AccountApi.prototype.__get__Message__account = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onGetMessageAccount = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * @ngdoc method
     * @name lbServices.Account#getCurrent
     * @methodOf lbServices.Account
     *
     * @description
     *
     * Get data of the currently logged user. Fail with HTTP result 401
     * when there is no user logged in.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     */
    AccountApi.prototype.getCurrent = function () {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/accounts" + "/:id";
        var id = auth.getCurrentUserId();
        if (id == null) {
            id = '__anonymous__';
        }
        var urlParams = {
            id: id
        };
        var result = this.request(method, url, urlParams)
            .share();
        result.subscribe(function (response) {
            auth.setCurrentUserData(response);
            return response.resource;
        }, function () { return null; });
        return result;
    };
    /**
     * Get data of the currently logged user that was returned by the last
     * call to {@link lbServices.Account#login} or
     * {@link lbServices.Account#getCurrent}. Return null when there
     * is no user logged in or the data of the current user were not fetched
     * yet.
     *
     * @returns object A Account instance.
     */
    AccountApi.prototype.getCachedCurrent = function () {
        return auth.getCurrentUserData();
    };
    /**
     * @name lbServices.Account#isAuthenticated
     *
     * @returns {boolean} True if the current user is authenticated (logged in).
     */
    AccountApi.prototype.isAuthenticated = function () {
        return this.getCurrentId() != null;
    };
    /**
     * @name lbServices.Account#getCurrentId
     *
     * @returns object Id of the currently logged-in user or null.
     */
    AccountApi.prototype.getCurrentId = function () {
        return auth.getCurrentUserId();
    };
    /**
     * The name of the model represented by this $resource,
     * i.e. `Account`.
     */
    AccountApi.prototype.getModelName = function () {
        return "Account";
    };
    AccountApi = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Optional()),
        __param(1, core_1.Inject(ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, ErrorHandler])
    ], AccountApi);
    return AccountApi;
}(BaseLoopBackApi));
exports.AccountApi = AccountApi;
/**
 * Api for the `Room` model.
 */
var RoomApi = (function (_super) {
    __extends(RoomApi, _super);
    function RoomApi(http, errorHandler) {
        _super.call(this, http, errorHandler);
    }
    /**
     * Find a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__findById__accounts = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onFindByIdAccounts = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__destroyById__accounts = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDestroyByIdAccounts = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__updateById__accounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateByIdAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Add a related item by id for accounts.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__link__accounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onLinkAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Remove the accounts relation to an item by id.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__unlink__accounts = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onUnlinkAccounts = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Check the existence of accounts relation to an item by id.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for accounts
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__exists__accounts = function (id, fk) {
        var method = "HEAD";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onExistsAccounts = function (id, fk) {
        var method = "HEAD";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find a related item by id for messages.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__findById__messages = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onFindByIdMessages = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for messages.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__destroyById__messages = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDestroyByIdMessages = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for messages.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for messages
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__updateById__messages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateByIdMessages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Queries accounts of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__get__accounts = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onGetAccounts = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in accounts of this model.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__create__accounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onCreateAccounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all accounts of this model.
     *
     * @param any id PersistedModel id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__delete__accounts = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteAccounts = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts accounts of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    RoomApi.prototype.__count__accounts = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onCountAccounts = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Queries messages of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__get__messages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onGetMessages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in messages of this model.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__create__messages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onCreateMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all messages of this model.
     *
     * @param any id PersistedModel id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__delete__messages = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteMessages = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts messages of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    RoomApi.prototype.__count__messages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onCountMessages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.create = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onCreate = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.createMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onCreateMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Update an existing model instance or insert a new one into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.upsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Check whether a model instance exists in the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `exists` – `{boolean}` -
     */
    RoomApi.prototype.exists = function (id) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onExists = function (id) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @param object filter Filter defining fields and include
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.findById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onFindById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find all instances of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.find = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onFind = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find first instance of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.findOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onFindOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * The number of instances updated
     */
    RoomApi.prototype.updateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Delete a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.deleteById = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteById = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Count instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    RoomApi.prototype.count = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onCount = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update attributes for a model instance and persist it into the data source.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.updateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a change stream.
     *
     * @param object data Request data.
     *
     *  - `options` – `{object}` -
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `changes` – `{ReadableStream}` -
     */
    RoomApi.prototype.createChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    RoomApi.prototype.onCreateChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options, true);
        return result;
    };
    /**
     * Find a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__findById__Account__rooms = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onFindByIdAccountRooms = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__destroyById__Account__rooms = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDestroyByIdAccountRooms = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__updateById__Account__rooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateByIdAccountRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Add a related item by id for rooms.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__link__Account__rooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onLinkAccountRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Remove the rooms relation to an item by id.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__unlink__Account__rooms = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onUnlinkAccountRooms = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Check the existence of rooms relation to an item by id.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for rooms
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__exists__Account__rooms = function (id, fk) {
        var method = "HEAD";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onExistsAccountRooms = function (id, fk) {
        var method = "HEAD";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Queries rooms of Account.
     *
     * @param any id User id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__get__Account__rooms = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onGetAccountRooms = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in rooms of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__create__Account__rooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onCreateAccountRooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Creates a new instance in rooms of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__createMany__Account__rooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onCreateManyAccountRooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all rooms of this model.
     *
     * @param any id User id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    RoomApi.prototype.__delete__Account__rooms = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteAccountRooms = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts rooms of Account.
     *
     * @param any id User id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    RoomApi.prototype.__count__Account__rooms = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onCountAccountRooms = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Fetches belongsTo relation room.
     *
     * @param any id PersistedModel id
     *
     * @param boolean refresh
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Room` object.)
     * </em>
     */
    RoomApi.prototype.__get__Message__room = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onGetMessageRoom = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * The name of the model represented by this $resource,
     * i.e. `Room`.
     */
    RoomApi.prototype.getModelName = function () {
        return "Room";
    };
    RoomApi = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Optional()),
        __param(1, core_1.Inject(ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, ErrorHandler])
    ], RoomApi);
    return RoomApi;
}(BaseLoopBackApi));
exports.RoomApi = RoomApi;
/**
 * Api for the `Message` model.
 */
var MessageApi = (function (_super) {
    __extends(MessageApi, _super);
    function MessageApi(http, errorHandler) {
        _super.call(this, http, errorHandler);
    }
    /**
     * Fetches belongsTo relation room.
     *
     * @param any id PersistedModel id
     *
     * @param boolean refresh
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__get__room = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onGetRoom = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/room";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Fetches belongsTo relation account.
     *
     * @param any id PersistedModel id
     *
     * @param boolean refresh
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__get__account = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onGetAccount = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/account";
        var urlParams = {
            id: id
        };
        var params = {};
        if (refresh !== undefined) {
            params.refresh = refresh;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.create = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreate = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a new instance of the model and persist it into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.createMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreateMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Update an existing model instance or insert a new one into the data source.
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.upsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onUpsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Check whether a model instance exists in the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `exists` – `{boolean}` -
     */
    MessageApi.prototype.exists = function (id) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onExists = function (id) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @param object filter Filter defining fields and include
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.findById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onFindById = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find all instances of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.find = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onFind = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find first instance of the model matched by filter from the data source.
     *
     * @param object filter Filter defining fields, where, include, order, offset, and limit
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.findOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onFindOne = function (filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * The number of instances updated
     */
    MessageApi.prototype.updateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onUpdateAll = function (where, data) {
        if (where === void 0) { where = undefined; }
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/update";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Delete a model instance by id from the data source.
     *
     * @param any id Model id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.deleteById = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDeleteById = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Count instances of the model matched by where from the data source.
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    MessageApi.prototype.count = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onCount = function (where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update attributes for a model instance and persist it into the data source.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.updateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onUpdateAttributes = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Create a change stream.
     *
     * @param object data Request data.
     *
     *  - `options` – `{object}` -
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `changes` – `{ReadableStream}` -
     */
    MessageApi.prototype.createChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/messages/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    MessageApi.prototype.onCreateChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/messages/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options, true);
        return result;
    };
    /**
     * Find a related item by id for messages.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__findById__Account__messages = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onFindByIdAccountMessages = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for messages.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    MessageApi.prototype.__destroyById__Account__messages = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDestroyByIdAccountMessages = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for messages.
     *
     * @param any id User id
     *
     * @param any fk Foreign key for messages
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__updateById__Account__messages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onUpdateByIdAccountMessages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Queries messages of Account.
     *
     * @param any id User id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__get__Account__messages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onGetAccountMessages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in messages of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__create__Account__messages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreateAccountMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Creates a new instance in messages of this model.
     *
     * @param any id User id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__createMany__Account__messages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreateManyAccountMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all messages of this model.
     *
     * @param any id User id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    MessageApi.prototype.__delete__Account__messages = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDeleteAccountMessages = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts messages of Account.
     *
     * @param any id User id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    MessageApi.prototype.__count__Account__messages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onCountAccountMessages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Find a related item by id for messages.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__findById__Room__messages = function (id, fk) {
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onFindByIdRoomMessages = function (id, fk) {
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Delete a related item by id for messages.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for messages
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    MessageApi.prototype.__destroyById__Room__messages = function (id, fk) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDestroyByIdRoomMessages = function (id, fk) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Update a related item by id for messages.
     *
     * @param any id PersistedModel id
     *
     * @param any fk Foreign key for messages
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__updateById__Room__messages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onUpdateByIdRoomMessages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Queries messages of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object filter
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__get__Room__messages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onGetRoomMessages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Creates a new instance in messages of this model.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__create__Room__messages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreateRoomMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Creates a new instance in messages of this model.
     *
     * @param any id PersistedModel id
     *
     * @param object data Request data.
     *
     * This method expects a subset of model properties as request parameters.
     *
     * @returns object[] An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * <em>
     * (The remote method definition does not provide any description.
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.__createMany__Room__messages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreateManyRoomMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data, true);
        return result;
    };
    /**
     * Deletes all messages of this model.
     *
     * @param any id PersistedModel id
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * This method returns no data.
     */
    MessageApi.prototype.__delete__Room__messages = function (id) {
        var method = "DELETE";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDeleteRoomMessages = function (id) {
        var method = "DELETE";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * Counts messages of Room.
     *
     * @param any id PersistedModel id
     *
     * @param object where Criteria to match model instances
     *
     * @returns object An empty reference that will be
     *   populated with the actual data once the response is returned
     *   from the server.
     *
     * Data properties:
     *
     *  - `count` – `{number}` -
     */
    MessageApi.prototype.__count__Room__messages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onCountRoomMessages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, true);
        return result;
    };
    /**
     * The name of the model represented by this $resource,
     * i.e. `Message`.
     */
    MessageApi.prototype.getModelName = function () {
        return "Message";
    };
    MessageApi = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)),
        __param(1, core_1.Optional()),
        __param(1, core_1.Inject(ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, ErrorHandler])
    ], MessageApi);
    return MessageApi;
}(BaseLoopBackApi));
exports.MessageApi = MessageApi;
//# sourceMappingURL=index.js.map