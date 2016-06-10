"use strict";
var core_1 = require("@angular/core");
var http_1 = require('@angular/http');
var sdk_1 = require('./sdk');
var AppComponent = (function () {
    function AppComponent(room) {
        this.room = room;
        // local network IP or public IP/DNS
        sdk_1.LoopBackConfig.setBaseURL('http://192.168.100.5:3000');
        sdk_1.LoopBackConfig.setApiVersion('api');
        room.onCreate().subscribe(function (res) {
            alert(res.name);
        });
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            template: "\n<StackLayout>\n    <Label text=\"Real Time App\" class=\"title\"></Label>\n</StackLayout>\n",
            providers: [http_1.HTTP_PROVIDERS, sdk_1.RoomApi]
        }), 
        __metadata('design:paramtypes', [sdk_1.RoomApi])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map