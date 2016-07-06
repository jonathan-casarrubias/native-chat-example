import { RouterConfig } from "@angular/router";
import { nsProvideRouter } from "nativescript-angular/router"
import { SignComponent } from "./+sign";
import { RoomsComponent, RoomComponent } from "./+rooms";
import { AuthGuard } from "./auth.guard";

export const routes: RouterConfig = [
  { path: "", component: RoomsComponent, canActivate: [AuthGuard] },
  { path: "rooms/:id", component: RoomComponent, canActivate: [AuthGuard] },
  { path: "sign", component: SignComponent }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, { enableTracing: false }),
  AuthGuard
];
