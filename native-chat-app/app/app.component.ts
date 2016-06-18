import { Component } from "@angular/core";
import { Account, AccountApi } from './shared';
import { Router, RouteConfig } from "@angular/router-deprecated";
import { NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router";
import { SignComponent } from "./+sign";
import { RoomsComponent } from "./+rooms";

@Component({
    selector: "my-app",
    directives: [ NS_ROUTER_DIRECTIVES ],
    providers: [ NS_ROUTER_PROVIDERS ],
    template: "<page-router-outlet></page-router-outlet>"
})

@RouteConfig([
  { path: "/sign", component: SignComponent, name: "SignComponent", useAsDefault: true },
  { path: "/rooms", component: RoomsComponent, name: "RoomsComponent"  }
])

export class AppComponent {
    constructor(private _router: Router, private _account: AccountApi) {
        this._router.subscribe(() => {
            if (!this._account.isAuthenticated())
            this._router.navigate(['SignComponent'])
        })
    }
}