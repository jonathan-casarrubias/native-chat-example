import { Injectable } from "@angular/core";
import { Router, CanActivate } from '@angular/router';
import { AccountApi } from "./shared";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountApi: AccountApi
  ) { }

  canActivate() {
    if (this.accountApi.getCurrentId()) {
      return true;
    }
    else {
      this.router.navigate(["/sign"]);
      return false;
    }
  }
}

