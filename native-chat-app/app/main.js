"use strict";
// this import should be first in order to load some required settings (like globals and reflect-metadata)
var application_1 = require("nativescript-angular/application");
var app_component_1 = require("./app.component");
var shared_1 = require("./shared");
shared_1.setStatusBarColors();
application_1.nativeScriptBootstrap(app_component_1.AppComponent, shared_1.API_PROVIDERS.slice());
//# sourceMappingURL=main.js.map