"use strict";
var core_1 = require('@angular/core');
var router_1 = require("@angular/router");
var page_1 = require("ui/page");
var animation_1 = require("ui/animation");
var enums_1 = require("ui/enums");
var color_1 = require("color");
var shared_1 = require('../shared');
var SignComponent = (function () {
    function SignComponent(_account, _router, _page, _logger) {
        this._account = _account;
        this._router = _router;
        this._page = _page;
        this._logger = _logger;
        this.account = new shared_1.Account();
        this.isLoggingIn = true;
        shared_1.LoopBackConfig.setBaseURL(shared_1.BASE_URL);
        shared_1.LoopBackConfig.setApiVersion(shared_1.API_VERSION);
        this._logger.log('SIGN COMPONENT LOADED');
        if (this._account.isAuthenticated())
            this._router.navigate(['/']);
    }
    SignComponent.prototype.ngOnInit = function () {
        this._page.actionBarHidden = true;
    };
    SignComponent.prototype.loadUI = function () {
        this.setTextFieldColors();
        this.setAnimations();
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
            .subscribe(function (res) { return _this._router.navigate(['/']); }, function (err) { return alert(err); });
    };
    SignComponent.prototype.setAnimations = function () {
        var signContainer = this.signContainer.nativeElement;
        var stackContainer = this.stackContainer.nativeElement;
        var logo = this.logo.nativeElement;
        var email = this.email.nativeElement;
        var password = this.password.nativeElement;
        var background = this.background.nativeElement;
        var primaryBtn = this.primaryBtn.nativeElement;
        var secondaryBtn = this.secondaryBtn.nativeElement;
        background.animate({ target: background, scale: { x: 1.0, y: 1.0 }, duration: 1300, curve: enums_1.AnimationCurve.easeOut });
        new animation_1.Animation([
            { target: email, opacity: 1, duration: 1300 },
            { target: password, opacity: 1, duration: 1300 },
            { target: logo, curve: enums_1.AnimationCurve.easeIn, translate: { x: 0, y: 0 }, opacity: 1, duration: 700 },
            { target: primaryBtn, translate: { x: 0, y: 0 }, opacity: 1, duration: 700 },
            { target: secondaryBtn, translate: { x: 0, y: 0 }, opacity: 1, duration: 800 }
        ], false).play();
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
    // Fixes bad performance when using ng2 [()]
    SignComponent.prototype.onChange = function (property, value) {
        this.account[property] = value;
    };
    __decorate([
        core_1.ViewChild("logo"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "logo", void 0);
    __decorate([
        core_1.ViewChild("email"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "email", void 0);
    __decorate([
        core_1.ViewChild("password"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "password", void 0);
    __decorate([
        core_1.ViewChild("background"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "background", void 0);
    __decorate([
        core_1.ViewChild("primaryBtn"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "primaryBtn", void 0);
    __decorate([
        core_1.ViewChild("secondaryBtn"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "secondaryBtn", void 0);
    __decorate([
        core_1.ViewChild("signContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "signContainer", void 0);
    __decorate([
        core_1.ViewChild("stackContainer"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignComponent.prototype, "stackContainer", void 0);
    SignComponent = __decorate([
        core_1.Component({
            selector: 'sign',
            templateUrl: '+sign/sign.html',
            styleUrls: ['+sign/sign.css'],
            providers: []
        }), 
        __metadata('design:paramtypes', [shared_1.AccountApi, router_1.Router, page_1.Page, shared_1.LoggerService])
    ], SignComponent);
    return SignComponent;
}());
exports.SignComponent = SignComponent;
//# sourceMappingURL=sign.component.js.map