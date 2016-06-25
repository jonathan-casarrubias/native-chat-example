"use strict";
var core_1 = require("@angular/core");
var shared_1 = require('./shared');
var router_deprecated_1 = require("@angular/router-deprecated");
var router_1 = require("nativescript-angular/router");
var _sign_1 = require("./+sign");
var _rooms_1 = require("./+rooms"); // Add to tuto
var AppComponent = (function () {
    function AppComponent(_router, _account) {
        var _this = this;
        this._router = _router;
        this._account = _account;
        this._router.subscribe(function () {
            if (!_this._account.isAuthenticated())
                _this._router.navigate(['SignComponent']);
        });
    }
    AppComponent = __decorate([
        // Add to tuto
        core_1.Component({
            selector: "my-app",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            providers: [router_1.NS_ROUTER_PROVIDERS],
            template: "<page-router-outlet></page-router-outlet>"
        }),
        router_deprecated_1.RouteConfig([
            { path: "/sign", component: _sign_1.SignComponent, name: "SignComponent", useAsDefault: true },
            { path: "/rooms", component: _rooms_1.RoomsComponent, name: "RoomsComponent" },
            { path: "/rooms/:id", component: _rooms_1.RoomComponent, name: "RoomComponent" } // Add to tuto
        ]), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, shared_1.AccountApi])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map