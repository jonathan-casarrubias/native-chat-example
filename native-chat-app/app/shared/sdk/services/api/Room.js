"use strict";
/* tslint:disable */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var baseApi_service_1 = require('../baseApi.service');
var config_service_1 = require('../config.service');
var auth_service_1 = require('../auth.service');
var errorHandler_service_1 = require('../errorHandler.service');
var search_params_1 = require('../search.params');
require('rxjs/add/observable/throw');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/share');
/**
 * Api for the `Room` model.
 */
var RoomApi = (function (_super) {
    __extends(RoomApi, _super);
    function RoomApi(http, auth, searchParams, errorHandler) {
        _super.call(this, http, auth, searchParams, errorHandler);
        this.auth = auth;
        this.searchParams = searchParams;
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
    RoomApi.prototype.findByIdAccounts = function (id, fk) {
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
    RoomApi.prototype.destroyByIdAccounts = function (id, fk) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDestroyByIdAccounts = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.updateByIdAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateByIdAccounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.linkAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onLinkAccounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.unlinkAccounts = function (id, fk) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onUnlinkAccounts = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.existsAccounts = function (id, fk) {
        var method = "HEAD";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
    RoomApi.prototype.findByIdMessages = function (id, fk) {
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
    RoomApi.prototype.destroyByIdMessages = function (id, fk) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDestroyByIdMessages = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.updateByIdMessages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateByIdMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.getAccounts = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
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
    RoomApi.prototype.createAccounts = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
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
    RoomApi.prototype.deleteAccounts = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteAccounts = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
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
    RoomApi.prototype.countAccounts = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
    RoomApi.prototype.getMessages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
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
    RoomApi.prototype.createMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
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
    RoomApi.prototype.deleteMessages = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteMessages = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
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
    RoomApi.prototype.countMessages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onCreate = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/findOne";
        var urlParams = {};
        var params = {};
        if (filter !== undefined) {
            params.filter = filter;
        }
        var result = this.request(method, url, urlParams, params);
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/update";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/update";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteById = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/count";
        var urlParams = {};
        var params = {};
        if (where !== undefined) {
            params.where = where;
        }
        var result = this.request(method, url, urlParams, params);
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    RoomApi.prototype.onCreateChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/change-stream";
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
    RoomApi.prototype.findByIdAccountRooms = function (id, fk) {
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
    RoomApi.prototype.destroyByIdAccountRooms = function (id, fk) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDestroyByIdAccountRooms = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.updateByIdAccountRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onUpdateByIdAccountRooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.linkAccountRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    RoomApi.prototype.onLinkAccountRooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.unlinkAccountRooms = function (id, fk) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onUnlinkAccountRooms = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id
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
    RoomApi.prototype.existsAccountRooms = function (id, fk) {
        var method = "HEAD";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
        var urlParams = {
            id: id,
            fk: fk
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
    RoomApi.prototype.getAccountRooms = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
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
    RoomApi.prototype.createAccountRooms = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
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
    RoomApi.prototype.deleteAccountRooms = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    RoomApi.prototype.onDeleteAccountRooms = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
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
    RoomApi.prototype.countAccountRooms = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
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
    RoomApi.prototype.getMessageRoom = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id/room";
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
        __param(1, core_1.Inject(auth_service_1.LoopBackAuth)),
        __param(2, core_1.Inject(search_params_1.JSONSearchParams)),
        __param(3, core_1.Optional()),
        __param(3, core_1.Inject(errorHandler_service_1.ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, auth_service_1.LoopBackAuth, search_params_1.JSONSearchParams, errorHandler_service_1.ErrorHandler])
    ], RoomApi);
    return RoomApi;
}(baseApi_service_1.BaseLoopBackApi));
exports.RoomApi = RoomApi;
//# sourceMappingURL=Room.js.map