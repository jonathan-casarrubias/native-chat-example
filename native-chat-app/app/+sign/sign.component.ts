import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { Page } from "ui/page";
import { Animation } from "ui/animation";
import { AnimationCurve } from "ui/enums";
import { View } from "ui/core/view";
import { Color } from "color";
import { TextField } from "ui/text-field";
import {
    LoopBackConfig,
    AccountApi,
    Account,
    setHintColor,
    BASE_URL,
    API_VERSION,
    LoggerService
} from '../shared';

@Component({
    selector: 'sign',
    templateUrl: '+sign/sign.html',
    styleUrls: ['+sign/sign.css'],
    providers: []
})

export class SignComponent {

    @ViewChild("logo") logo: ElementRef;
    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;
    @ViewChild("background") background: ElementRef;
    @ViewChild("primaryBtn") primaryBtn: ElementRef;
    @ViewChild("secondaryBtn") secondaryBtn: ElementRef;
    @ViewChild("signContainer") signContainer: ElementRef;
    @ViewChild("stackContainer") stackContainer: ElementRef;

    private account: Account             = new Account();
    private isLoggingIn: boolean         = true;

    constructor(
        private _account: AccountApi,
        private _router: Router,
        private _page: Page,
        private _logger: LoggerService
    ) {
        LoopBackConfig.setBaseURL(BASE_URL);
        LoopBackConfig.setApiVersion(API_VERSION);
        this._logger.log('SIGN COMPONENT LOADED');
        if (this._account.isAuthenticated())
            this._router.navigate(['/']);
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    loadUI() {
        this.setTextFieldColors();
        this.setAnimations();
    }

    private toggleDisplay(): void {
        this.isLoggingIn = !this.isLoggingIn;
    }

    private submit(): void {
        if (this.isLoggingIn) {
            this.signin();
        } else {
            this.signup();
        }
    }

    private signup(): void {
        this._account.create(this.account).subscribe(res => this.signin(), err => {
            console.log(err.message);
        });
    }

    private signin(): void {
        this._account.login(this.account)
            .subscribe(res => this._router.navigate(['/']), err => alert(err));
    }

    private setAnimations() {
        let signContainer = <View>this.signContainer.nativeElement;
        let stackContainer = <View>this.stackContainer.nativeElement;
        let logo = <View>this.logo.nativeElement;
        let email = <View>this.email.nativeElement;
        let password = <View>this.password.nativeElement;
        let background = <View>this.background.nativeElement;
        let primaryBtn = <View>this.primaryBtn.nativeElement;
        let secondaryBtn = <View>this.secondaryBtn.nativeElement;


        background.animate({ target: background, scale: { x: 1.0, y: 1.0 }, duration: 1300, curve: AnimationCurve.easeOut });

        new Animation([
            { target: email, opacity: 1, duration: 1300 },
            { target: password, opacity: 1, duration: 1300 },
            { target: logo, curve: AnimationCurve.easeIn, translate: { x: 0, y: 0}, opacity: 1, duration: 700 },
            { target: primaryBtn, translate: { x: 0, y: 0 }, opacity: 1, duration: 700 },
            { target: secondaryBtn, translate: { x: 0, y: 0 }, opacity: 1, duration: 800 }
        ], false).play();
          
    }

    private setTextFieldColors() {
        let emailTextField = <TextField>this.email.nativeElement;
        let passwordTextField = <TextField>this.password.nativeElement;
        let mainTextColor = new Color('white');
        emailTextField.color = mainTextColor;
        passwordTextField.color = mainTextColor;
        let hintColor = new Color('white');
        setHintColor({ view: emailTextField, color: hintColor });
        setHintColor({ view: passwordTextField, color: hintColor });
    }

    // Fixes bad performance when using ng2 [()]
    private onChange(property, value): void {
        this.account[property] = value;
    }
}