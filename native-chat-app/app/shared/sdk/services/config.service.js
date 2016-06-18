"use strict";
/* tslint:disable */
/**
* @module LoopBackConfig
* @description
*
* The LoopBackConfig module help developers to externally
* configure the base url and api version for loopback.io
*
* Example
*
* import { LoopBackConfig } from './sdk';
*
* @Component() // No metadata needed for this module
*
* export class MyApp {
*   constructor() {
*     LoopBackConfig.setBaseURL('http://localhost:3000');
*     LoopBackConfig.setApiVersion('api');
*   }
* }
**/
var LoopBackConfig = (function () {
    function LoopBackConfig() {
    }
    LoopBackConfig.setApiVersion = function (version) {
        if (version === void 0) { version = 'api'; }
        LoopBackConfig.version = version;
    };
    LoopBackConfig.getApiVersion = function () {
        return LoopBackConfig.version;
    };
    LoopBackConfig.setBaseURL = function (url) {
        if (url === void 0) { url = '/'; }
        LoopBackConfig.path = url;
    };
    LoopBackConfig.getPath = function () {
        return LoopBackConfig.path;
    };
    LoopBackConfig.setAuthPrefix = function (authPrefix) {
        if (authPrefix === void 0) { authPrefix = ''; }
        LoopBackConfig.authPrefix = authPrefix;
    };
    LoopBackConfig.getAuthPrefix = function () {
        return LoopBackConfig.authPrefix;
    };
    LoopBackConfig.authPrefix = '';
    return LoopBackConfig;
}());
exports.LoopBackConfig = LoopBackConfig;
//# sourceMappingURL=config.service.js.map