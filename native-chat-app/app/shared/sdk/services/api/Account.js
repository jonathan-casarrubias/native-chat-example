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
 * Api for the `Account` model.
 */
var AccountApi = (function (_super) {
    __extends(AccountApi, _super);
    function AccountApi(http, auth, searchParams, errorHandler) {
        _super.call(this, http, auth, searchParams, errorHandler);
        this.auth = auth;
        this.searchParams = searchParams;
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
    AccountApi.prototype.findByIdAccessTokens = function (id, fk) {
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
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
    AccountApi.prototype.destroyByIdAccessTokens = function (id, fk) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
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
    AccountApi.prototype.updateByIdAccessTokens = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/:fk";
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
    AccountApi.prototype.findByIdRooms = function (id, fk) {
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
    AccountApi.prototype.onFindByIdRooms = function (id, fk) {
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
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
    AccountApi.prototype.destroyByIdRooms = function (id, fk) {
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
    AccountApi.prototype.onDestroyByIdRooms = function (id, fk) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
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
    AccountApi.prototype.updateByIdRooms = function (id, fk, data) {
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
    AccountApi.prototype.onUpdateByIdRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/:fk";
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
    AccountApi.prototype.linkRooms = function (id, fk, data) {
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
    AccountApi.prototype.onLinkRooms = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
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
    AccountApi.prototype.unlinkRooms = function (id, fk) {
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
    AccountApi.prototype.onUnlinkRooms = function (id, fk) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
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
    AccountApi.prototype.existsRooms = function (id, fk) {
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
    AccountApi.prototype.onExistsRooms = function (id, fk) {
        var method = "HEAD";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/rel/:fk";
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
    AccountApi.prototype.findByIdMessages = function (id, fk) {
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
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
    AccountApi.prototype.destroyByIdMessages = function (id, fk) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
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
    AccountApi.prototype.updateByIdMessages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/:fk";
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
    AccountApi.prototype.getAccessTokens = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
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
    AccountApi.prototype.createAccessTokens = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
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
    AccountApi.prototype.deleteAccessTokens = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteAccessTokens = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens";
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
    AccountApi.prototype.countAccessTokens = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/count";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/accessTokens/count";
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
    AccountApi.prototype.getRooms = function (id, filter) {
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
    AccountApi.prototype.onGetRooms = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
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
    AccountApi.prototype.createRooms = function (id, data) {
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
    AccountApi.prototype.onCreateRooms = function (id, data) {
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
    AccountApi.prototype.deleteRooms = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteRooms = function (id) {
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
    AccountApi.prototype.countRooms = function (id, where) {
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
    AccountApi.prototype.onCountRooms = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/rooms/count";
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
    AccountApi.prototype.getMessages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
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
    AccountApi.prototype.createMessages = function (id, data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
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
    AccountApi.prototype.deleteMessages = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteMessages = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
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
    AccountApi.prototype.countMessages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages/count";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreate = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onCreateMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    AccountApi.prototype.onUpsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onExists = function (id) {
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/exists";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/findOne";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/findOne";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/update";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/update";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteById = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/count";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/count";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    AccountApi.prototype.onCreateChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/change-stream";
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
        var _this = this;
        if (include === void 0) { include = "user"; }
        var method = "POST";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/login";
        var urlParams = {};
        var params = {};
        if (include !== undefined) {
            params.include = include;
        }
        var result = this.request(method, url, urlParams, params, credentials)
            .share();
        result.subscribe(function (response) {
            _this.auth.setUser(response.id, response.userId, response.user);
            _this.auth.setRememberMe(true);
            _this.auth.save();
        }, function () { return null; });
        return result;
    };
    AccountApi.prototype.onLogin = function (credentials, include) {
        var _this = this;
        if (include === void 0) { include = "user"; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/login";
        var urlParams = {};
        var params = {};
        if (include !== undefined) {
            params.include = include;
        }
        var result = this.request(method, url, urlParams, params, credentials, true)
            .share();
        result.subscribe(function (response) {
            _this.auth.setUser(response.id, response.userId, response.user);
            _this.auth.setRememberMe(true);
            _this.auth.save();
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
        var _this = this;
        var method = "POST";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/logout";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params)
            .share();
        result.subscribe(function () {
            _this.auth.clearUser();
            _this.auth.clearStorage();
        }, function () { return null; });
        return result;
    };
    AccountApi.prototype.onLogout = function () {
        var _this = this;
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/logout";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, true)
            .share();
        result.subscribe(function () {
            _this.auth.clearUser();
            _this.auth.clearStorage();
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/confirm";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onConfirm = function (uid, token, redirect) {
        if (redirect === void 0) { redirect = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/confirm";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/reset";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    AccountApi.prototype.onResetPassword = function (options) {
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/reset";
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
    AccountApi.prototype.findByIdRoomAccounts = function (id, fk) {
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
    AccountApi.prototype.onFindByIdRoomAccounts = function (id, fk) {
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
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
    AccountApi.prototype.destroyByIdRoomAccounts = function (id, fk) {
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
    AccountApi.prototype.onDestroyByIdRoomAccounts = function (id, fk) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
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
    AccountApi.prototype.updateByIdRoomAccounts = function (id, fk, data) {
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
    AccountApi.prototype.onUpdateByIdRoomAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/:fk";
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
    AccountApi.prototype.linkRoomAccounts = function (id, fk, data) {
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
    AccountApi.prototype.onLinkRoomAccounts = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
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
    AccountApi.prototype.unlinkRoomAccounts = function (id, fk) {
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
    AccountApi.prototype.onUnlinkRoomAccounts = function (id, fk) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
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
    AccountApi.prototype.existsRoomAccounts = function (id, fk) {
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
    AccountApi.prototype.onExistsRoomAccounts = function (id, fk) {
        var method = "HEAD";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/rel/:fk";
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
    AccountApi.prototype.getRoomAccounts = function (id, filter) {
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
    AccountApi.prototype.onGetRoomAccounts = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
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
    AccountApi.prototype.createRoomAccounts = function (id, data) {
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
    AccountApi.prototype.onCreateRoomAccounts = function (id, data) {
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
    AccountApi.prototype.createManyRoomAccounts = function (id, data) {
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
    AccountApi.prototype.onCreateManyRoomAccounts = function (id, data) {
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
    AccountApi.prototype.deleteRoomAccounts = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    AccountApi.prototype.onDeleteRoomAccounts = function (id) {
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
    AccountApi.prototype.countRoomAccounts = function (id, where) {
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
    AccountApi.prototype.onCountRoomAccounts = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/accounts/count";
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
    AccountApi.prototype.getMessageAccount = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id/account";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id/account";
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
        var _this = this;
        var method = "GET";
        var url = config_service_1.LoopBackConfig.getPath() + "/accounts" + "/:id";
        var id = this.auth.getCurrentUserId();
        if (id == null) {
            id = '__anonymous__';
        }
        var urlParams = {
            id: id
        };
        var result = this.request(method, url, urlParams)
            .share();
        result.subscribe(function (response) {
            _this.auth.setCurrentUserData(response);
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
        return this.auth.getCurrentUserData();
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
        return this.auth.getCurrentUserId();
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
        __param(1, core_1.Inject(auth_service_1.LoopBackAuth)),
        __param(2, core_1.Inject(search_params_1.JSONSearchParams)),
        __param(3, core_1.Optional()),
        __param(3, core_1.Inject(errorHandler_service_1.ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, auth_service_1.LoopBackAuth, search_params_1.JSONSearchParams, errorHandler_service_1.ErrorHandler])
    ], AccountApi);
    return AccountApi;
}(baseApi_service_1.BaseLoopBackApi));
exports.AccountApi = AccountApi;
//# sourceMappingURL=Account.js.map