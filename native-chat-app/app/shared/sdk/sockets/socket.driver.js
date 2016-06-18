"use strict";
var SocketIO = require('nativescript-socket.io');
var SocketDriver = (function () {
    function SocketDriver() {
    }
    SocketDriver.connect = function (url, options) {
        return SocketIO.connect(url, options);
    };
    return SocketDriver;
}());
exports.SocketDriver = SocketDriver;
//# sourceMappingURL=socket.driver.js.map