import Connection from "./Connection.js";

import DeviceSocket from "./socket/DeviceSocket.js";
import UserSocket from "./socket/UserSocket.js";

export default class WebSocket {

    constructor(websocket) {
        this.websocket = websocket;

        websocket.on("connection", (socket) => this.onConnection(socket));
    };

    onConnection(socket) {
        new Connection(socket);
    };

    getDeviceSocket() {
        return DeviceSocket;
    };

    getUserSocket() {
        return UserSocket;
    };

};