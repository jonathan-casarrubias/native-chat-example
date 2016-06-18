import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router-deprecated";
import { Page } from "ui/page";
import { Color } from "color";
import { TextField } from "ui/text-field";
import {
    LoopBackConfig,
    AccountApi,
    Account,
    setHintColor,
    BASE_URL,
    API_VERSION
} from '../shared';

@Component({
    selector: 'sign',
    templateUrl: '+sign/sign.html',
    styleUrls: ['+sign/sign.css'],
    providers: []
})

export class SignComponent {

    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;

    private account: Account = new Account();
    private isLoggingIn: boolean = true;

    constructor(
        private _account: AccountApi,
        private _router: Router,
        private _page: Page
    ) {
        LoopBackConfig.setBaseURL(BASE_URL);
        LoopBackConfig.setApiVersion(API_VERSION);
        if (this._account.isAuthenticated())
            this._router.navigate(['RoomsComponent']);
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
        this._page.backgroundImage = "res://bg";
        this._page.className = "no-repeat"
    }

    ngAfterViewInit() {
        this.setTextFieldColors();
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
            .subscribe(res => this._router.navigate(['RoomsComponent']), err => alert(err));
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
}