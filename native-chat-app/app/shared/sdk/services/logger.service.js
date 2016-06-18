"use strict";
var core_1 = require('@angular/core');
var logger_config_1 = require('./logger.config');
var LoggerService = (function () {
    function LoggerService() {
    }
    LoggerService.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (logger_config_1.LoggerConfig.enabled)
            console.log.apply(console, args);
    };
    LoggerService.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (logger_config_1.LoggerConfig.enabled)
            console.info.apply(console, args);
    };
    LoggerService.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (logger_config_1.LoggerConfig.enabled)
            console.error.apply(console, args);
    };
    LoggerService.prototype.count = function (arg) {
        if (logger_config_1.LoggerConfig.enabled)
            console.count(arg);
    };
    LoggerService.prototype.group = function (arg) {
        if (logger_config_1.LoggerConfig.enabled)
            console.count(arg);
    };
    LoggerService.prototype.groupEnd = function () {
        if (logger_config_1.LoggerConfig.enabled)
            console.groupEnd();
    };
    LoggerService.prototype.profile = function (arg) {
        if (logger_config_1.LoggerConfig.enabled)
            console.count(arg);
    };
    LoggerService.prototype.profileEnd = function () {
        if (logger_config_1.LoggerConfig.enabled)
            console.profileEnd();
    };
    LoggerService.prototype.time = function (arg) {
        if (logger_config_1.LoggerConfig.enabled)
            console.count(arg);
    };
    LoggerService.prototype.timeEnd = function (arg) {
        if (logger_config_1.LoggerConfig.enabled)
            console.count(arg);
    };
    LoggerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LoggerService);
    return LoggerService;
}());
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map