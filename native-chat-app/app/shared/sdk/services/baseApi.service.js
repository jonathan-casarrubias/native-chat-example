"use strict";
/* tslint:disable */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Subject_1 = require('rxjs/Subject');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
var auth_service_1 = require('./auth.service');
var config_service_1 = require('./config.service');
var errorHandler_service_1 = require('./errorHandler.service');
var search_params_1 = require('./search.params');
var socket_connections_1 = require('../sockets/socket.connections');
var BaseLoopBackApi = (function () {
    function BaseLoopBackApi(http, auth, searchParams, errorHandler) {
        this.http = http;
        this.auth = auth;
        this.searchParams = searchParams;
        this.errorHandler = errorHandler;
        if (!auth) {
            this.auth = new auth_service_1.LoopBackAuth();
        }
        if (!errorHandler) {
            this.errorHandler = new errorHandler_service_1.ErrorHandler();
        }
    }
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
        if (this.auth.getAccessTokenId()) {
            headers.append('Authorization', config_service_1.LoopBackConfig.getAuthPrefix() + this.auth.getAccessTokenId());
        }
        var requestUrl = url;
        var key;
        for (key in urlParams) {
            requestUrl = requestUrl.replace(new RegExp(":" + key + "(\/|$)", "g"), urlParams[key] + "$1");
        }
        if (isio) {
            if (requestUrl.match(/fk/)) {
                var arr = requestUrl.split('/');
                arr.pop();
                requestUrl = arr.join('/');
            }
            var event_1 = ("[" + method + "]" + requestUrl).replace(/\?/, '');
            var subject_1 = new Subject_1.Subject();
            var socket = socket_connections_1.SocketConnections.getHandler(config_service_1.LoopBackConfig.getPath(), {
                id: this.auth.getAccessTokenId(),
                userId: this.auth.getCurrentUserId()
            });
            socket.on(event_1, function (res) { return subject_1.next(res); });
            return subject_1.asObservable();
        }
        else {
            this.searchParams.setJSON(params);
            var request = new http_1.Request({
                headers: headers,
                method: method,
                url: requestUrl,
                search: this.searchParams.getURLSearchParams(),
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
        __param(1, core_1.Inject(auth_service_1.LoopBackAuth)),
        __param(2, core_1.Inject(search_params_1.JSONSearchParams)),
        __param(3, core_1.Optional()),
        __param(3, core_1.Inject(errorHandler_service_1.ErrorHandler)), 
        __metadata('design:paramtypes', [http_1.Http, auth_service_1.LoopBackAuth, search_params_1.JSONSearchParams, errorHandler_service_1.ErrorHandler])
    ], BaseLoopBackApi);
    return BaseLoopBackApi;
}());
exports.BaseLoopBackApi = BaseLoopBackApi;
//# sourceMappingURL=baseApi.service.js.map