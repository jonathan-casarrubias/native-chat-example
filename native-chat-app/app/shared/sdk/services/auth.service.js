"use strict";
/* tslint:disable */
var core_1 = require('@angular/core');
var AppSettings = require('application-settings');
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
    LoopBackAuth = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LoopBackAuth);
    return LoopBackAuth;
}());
exports.LoopBackAuth = LoopBackAuth;
//# sourceMappingURL=auth.service.js.map