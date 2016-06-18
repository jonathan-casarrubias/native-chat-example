"use strict";
/* tslint:disable */
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/observable/throw');
/**
 * Default error handler
 */
var ErrorHandler = (function () {
    function ErrorHandler() {
    }
    ErrorHandler.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    ErrorHandler = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ErrorHandler);
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorHandler.service.js.map