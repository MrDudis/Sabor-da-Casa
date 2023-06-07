import UserSocket from "./UserSocket.js";

import { Role } from "../../models/User.js";

import * as usersDb from "../../database/managers/users.js";
import * as cardsDb from "../../database/managers/cards.js";

import Device from "../../models/Device.js";

export default class DeviceSocket {

    static id = 0;
    static sockets = new Set();

    static get(id) {

        for (let socket of DeviceSocket.sockets) {
            if (socket.id == id) {
                return socket;
            };
        };

        return null;

    };

    constructor(socket, name) {
        this.socket = socket;

        this.name = name;
        this.id = DeviceSocket.id++;

        this.userId = null;
        this.user = null;

        DeviceSocket.sockets.add(this);
        UserSocket.emit({ operation: "DEVICE_CREATE", data: { device: new Device(this) } });
        
        this.socket.on("close", () => this.onClose());
    };

    onMessage(message) {
        if (!message) { return; };

        message = JSON.parse(message);
        
        switch (message.operation) {
            case "PAIR":
                this.pair(message?.data?.cardId);
                break;
            case "ACTION":
                this.action(message?.data?.cardId);
                break;
        };
    };

    onClose() {
        DeviceSocket.sockets.delete(this);

        UserSocket.emit({ operation: "DEVICE_DELETE", data: { device: new Device(this) } });
    };

    async setUserId(userId) {
        this.userId = userId;

        if (userId != null) {
            this.user = await usersDb.getById(userId);
        } else {
            this.user = null;
        };

        UserSocket.emit({ operation: "DEVICE_UPDATE", data: { device: new Device(this) } });
    };

    async pair(cardId) {
        if (!cardId) { return; }

        const userId = await cardsDb.get(cardId);
        if (!userId) { return; }

        const user = await usersDb.getById(userId);
        if (!user) { return; }

        if (user.role == Role.CUSTOMER) { return; }

        this.setUserId(userId);
    };

    async action(cardId) {
        if (!cardId) { return; }
        if (this.userId == null) { return; }

        const userId = await cardsDb.get(cardId);

        let user = null;

        if (userId != null) {
            user = await usersDb.getById(userId);
        };

        UserSocket.emitToUserId(this.userId, { operation: "ACTION", data: { deviceId: this.id, user, userId, cardId }});
    };

    forceDisconnect() {
        this.socket.close();
    };

};