"use strict";
var core_1 = require('@angular/core');
var router_deprecated_1 = require("@angular/router-deprecated");
var page_1 = require("ui/page");
var color_1 = require("color");
var shared_1 = require('../shared');
var SignComponent = (function () {
    function SignComponent(_account, _router, _page) {
        this._account = _account;
        this._router = _router;
        this._page = _page;
        this.account = new shared_1.Account();
        this.isLoggingIn = true;
        shared_1.LoopBackConfig.setBaseURL(shared_1.BASE_URL);
        shared_1.LoopBackConfig.setApiVersion(shared_1.API_VERSION);
        if (this._account.isAuthenticated())
            this._router.navigate(['RoomsComponent']);
    }
    SignComponent.prototype.ngOnInit = function () {
        this._page.actionBarHidden = true;
        this._page.backgroundImage = "res://bg";
        this._page.className = "no-repeat";
    };
    SignComponent.prototype.ngAfterViewInit = function () {
        this.setTextFieldColors();
    };
    SignComponent.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
    };
    SignComponent.prototype.submit = function () {
        if (this.isLoggingIn) {
            this.signin();
        }
        else {
            this.signup();
        }
    };
    SignComponent.prototype.signup = function () {
        var _this = this;
        this._account.create(this.account).subscribe(function (res) { return _this.signin(); }, function (err) {
            console.log(err.message);
        });
    };
    SignComponent.prototype.signin = function () {
        var _this = this;
        this._account.login(this.account)
            .subscribe(function (res) { return _this._router.navigate(['RoomsComponent']); }, function (err) { return alert(err); });
    };
    SignComponent.prototype.setTextFieldColors = function () {
        var emailTextField = this.email.nativeElement;
        var passwordTextField = this.password.nativeElement;
        var mainTextColor = new color_1.Color('white');
        emailTextField.color = mainTextColor;
        passwordTextField.color = mainTextColor;
        var hintColor = new color_1.Color('white');
        shared_1.setHintColor({ view: emailTextField, color: hintColor });
        shared_1.setHintColor({ view: passwordTextField, color: hintColor });
    };
    __decorate([
        core_1.ViewChild("email"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "email", void 0);
    __decorate([
        core_1.ViewChild("password"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "password", void 0);
    SignComponent = __decorate([
        core_1.Component({
            selector: 'sign',
            templateUrl: '+sign/sign.html',
            styleUrls: ['+sign/sign.css'],
            providers: []
        }), 
        __metadata('design:paramtypes', [shared_1.AccountApi, router_deprecated_1.Router, page_1.Page])
    ], SignComponent);
    return SignComponent;
}());
exports.SignComponent = SignComponent;
//# sourceMappingURL=sign.component.js.map