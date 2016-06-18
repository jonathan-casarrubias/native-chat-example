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
 * Api for the `Message` model.
 */
var MessageApi = (function (_super) {
    __extends(MessageApi, _super);
    function MessageApi(http, auth, searchParams, errorHandler) {
        _super.call(this, http, auth, searchParams, errorHandler);
        this.auth = auth;
        this.searchParams = searchParams;
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
    MessageApi.prototype.getRoom = function (id, refresh) {
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
    MessageApi.prototype.onGetRoom = function (id, refresh) {
        if (refresh === void 0) { refresh = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id/room";
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
    MessageApi.prototype.getAccount = function (id, refresh) {
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
    MessageApi.prototype.onGetAccount = function (id, refresh) {
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreate = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onCreateMany = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, data);
        return result;
    };
    MessageApi.prototype.onUpsert = function (data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id/exists";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onExists = function (id) {
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id/exists";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/findOne";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/findOne";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/update";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/update";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDeleteById = function (id) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/count";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/count";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id";
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
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/:id";
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
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/change-stream";
        var urlParams = {};
        var params = {};
        var result = this.request(method, url, urlParams, params, options);
        return result;
    };
    MessageApi.prototype.onCreateChangeStream = function (options) {
        if (options === void 0) { options = undefined; }
        var method = "POST";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/messages/change-stream";
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
    MessageApi.prototype.findByIdAccountMessages = function (id, fk) {
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
    MessageApi.prototype.onFindByIdAccountMessages = function (id, fk) {
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
    MessageApi.prototype.destroyByIdAccountMessages = function (id, fk) {
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
    MessageApi.prototype.onDestroyByIdAccountMessages = function (id, fk) {
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
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.updateByIdAccountMessages = function (id, fk, data) {
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
    MessageApi.prototype.onUpdateByIdAccountMessages = function (id, fk, data) {
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
    MessageApi.prototype.getAccountMessages = function (id, filter) {
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
    MessageApi.prototype.onGetAccountMessages = function (id, filter) {
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
     * This usually means the response is a `Message` object.)
     * </em>
     */
    MessageApi.prototype.createAccountMessages = function (id, data) {
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
    MessageApi.prototype.onCreateAccountMessages = function (id, data) {
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
    MessageApi.prototype.createManyAccountMessages = function (id, data) {
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
    MessageApi.prototype.onCreateManyAccountMessages = function (id, data) {
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
    MessageApi.prototype.deleteAccountMessages = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/accounts/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDeleteAccountMessages = function (id) {
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
    MessageApi.prototype.countAccountMessages = function (id, where) {
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
    MessageApi.prototype.onCountAccountMessages = function (id, where) {
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
    MessageApi.prototype.findByIdRoomMessages = function (id, fk) {
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
    MessageApi.prototype.onFindByIdRoomMessages = function (id, fk) {
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
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
    MessageApi.prototype.destroyByIdRoomMessages = function (id, fk) {
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
    MessageApi.prototype.onDestroyByIdRoomMessages = function (id, fk) {
        var method = "DELETE";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
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
    MessageApi.prototype.updateByIdRoomMessages = function (id, fk, data) {
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
    MessageApi.prototype.onUpdateByIdRoomMessages = function (id, fk, data) {
        if (data === void 0) { data = undefined; }
        var method = "PUT";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/:fk";
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
    MessageApi.prototype.getRoomMessages = function (id, filter) {
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
    MessageApi.prototype.onGetRoomMessages = function (id, filter) {
        if (filter === void 0) { filter = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
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
    MessageApi.prototype.createRoomMessages = function (id, data) {
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
    MessageApi.prototype.onCreateRoomMessages = function (id, data) {
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
    MessageApi.prototype.createManyRoomMessages = function (id, data) {
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
    MessageApi.prototype.onCreateManyRoomMessages = function (id, data) {
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
    MessageApi.prototype.deleteRoomMessages = function (id) {
        var method = "DELETE";
        var url = config_service_1.LoopBackConfig.getPath() + "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages";
        var urlParams = {
            id: id
        };
        var params = {};
        var result = this.request(method, url, urlParams, params);
        return result;
    };
    MessageApi.prototype.onDeleteRoomMessages = function (id) {
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
    MessageApi.prototype.countRoomMessages = function (id, where) {
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
    MessageApi.prototype.onCountRoomMessages = function (id, where) {
        if (where === void 0) { where = undefined; }
        var method = "GET";
        var url = "/" + config_service_1.LoopBackConfig.getApiVersion() + "/rooms/:id/messages/count";
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
        __param(1, core_1.Inject(auth_service_1.LoopBackAuth)),
        __param(2, core_1.Inject(search_params_1.JSONSearchParams)),
        __param(3, core_1.Optional()),
        __param(3, core_1.Inject(errorHandler_service_1.ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, auth_service_1.LoopBackAuth, search_params_1.JSONSearchParams, errorHandler_service_1.ErrorHandler])
    ], MessageApi);
    return MessageApi;
}(baseApi_service_1.BaseLoopBackApi));
exports.MessageApi = MessageApi;
//# sourceMappingURL=Message.js.map