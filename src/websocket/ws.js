import Connection from "./Connection.js";

import * as devicesDb from "../database/managers/devices.js";

export default class WebSocket {

    constructor(websocket) {
        this.websocket = websocket;

        devicesDb.deleteAll();

        websocket.on("connection", (socket) => this.onConnection(socket));
    };

    onConnection(socket) {
        new Connection(socket);
    };

};