"use strict";
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
/**
* Filter Params
* JSON Wrapper of URLSearchParams
**/
var JSONSearchParams = (function () {
    function JSONSearchParams() {
    }
    JSONSearchParams.prototype.setJSON = function (obj) {
        this._usp = new http_1.URLSearchParams(this._JSON2URL(obj, false));
    };
    JSONSearchParams.prototype.getURLSearchParams = function () {
        return this._usp;
    };
    JSONSearchParams.prototype._JSON2URL = function (obj, parent) {
        var parts = [];
        for (var key in obj)
            parts.push(this._parseParam(key, obj[key], parent));
        return parts.join('&');
    };
    JSONSearchParams.prototype._parseParam = function (key, value, parent) {
        if (typeof value !== 'object' && typeof value !== 'array') {
            return parent ? parent + '[' + key + ']=' + encodeURIComponent(value)
                : key + '=' + encodeURIComponent(value);
        }
        else if (typeof value === 'object' || typeof value === 'array') {
            return parent ? this._JSON2URL(value, parent + '[' + key + ']')
                : this._JSON2URL(value, key);
        }
        else {
            throw new Error('Unexpected Type');
        }
    };
    JSONSearchParams = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], JSONSearchParams);
    return JSONSearchParams;
}());
exports.JSONSearchParams = JSONSearchParams;
//# sourceMappingURL=search.params.js.map