"use strict";
var socket_driver_1 = require('./socket.driver');
var SocketConnections = (function () {
    function SocketConnections() {
    }
    SocketConnections.getHandler = function (url, token) {
        if (!SocketConnections.connections[url]) {
            console.log('Trying to make connection with: ', url);
            SocketConnections.connections[url] = socket_driver_1.SocketDriver.connect(url, {
                log: false,
                secure: false,
                forceWebsockets: true,
            });
            SocketConnections.connections[url].on('connect', function () {
                console.log('Connected to %s', url);
                SocketConnections.connections[url].emit('authentication', token);
                SocketConnections.connections[url].on('unauthorized', function (res) { return console.error('Unauthenticated', res); });
            });
        }
        else {
            console.log('Returning existing connection for: ', url);
        }
        return SocketConnections.connections[url];
    };
    SocketConnections.connections = {};
    return SocketConnections;
}());
exports.SocketConnections = SocketConnections;
//# sourceMappingURL=socket.connections.js.map