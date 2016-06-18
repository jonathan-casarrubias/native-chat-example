"use strict";
var core_1 = require('@angular/core');
var shared_1 = require('../shared');
var RoomsComponent = (function () {
    function RoomsComponent(_account) {
        this._account = _account;
        this.room = new shared_1.Room();
        this.rooms = new Array();
        shared_1.LoopBackConfig.setBaseURL(shared_1.BASE_URL);
        shared_1.LoopBackConfig.setApiVersion(shared_1.API_VERSION);
        this.getRooms();
    }
    RoomsComponent.prototype.addRoom = function () {
        var _this = this;
        this._account.createRooms(this._account.getCurrentId(), this.room)
            .subscribe(function () { return _this.room = new shared_1.Room(); });
    };
    RoomsComponent.prototype.getRooms = function () {
        var _this = this;
        this._account.getRooms(this._account.getCurrentId()).subscribe(function (rooms) {
            _this.rooms = rooms;
        });
        this._account.onCreateRooms(this._account.getCurrentId()).subscribe(function (room) {
            _this.rooms.push(room);
        });
    };
    RoomsComponent = __decorate([
        core_1.Component({
            selector: 'rooms',
            templateUrl: '+rooms/rooms.component.html',
            providers: []
        }), 
        __metadata('design:paramtypes', [shared_1.AccountApi])
    ], RoomsComponent);
    return RoomsComponent;
}());
exports.RoomsComponent = RoomsComponent;
//# sourceMappingURL=rooms.component.js.map