import UserSocket from "./UserSocket.js";

import { Role } from "@/models/User.js";

import * as usersDb from "../../database/managers/users.js";
import * as cardsDb from "../../database/managers/cards.js";

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

        DeviceSocket.sockets.add(this);
        UserSocket.emit({ operation: "REFRESH_DEVICES" });

        this.socket.on("close", () => this.onClose());
    };

    setUserId(userId) {
        this.userId = userId;

        UserSocket.emit({ operation: "REFRESH_DEVICES" });
        UserSocket.emit({ operation: "UPDATE_DEVICE" }, { data: { id: this.id }})
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

        UserSocket.emit({ operation: "REFRESH_DEVICES" });
        UserSocket.emit({ operation: "DELETE_DEVICE" }, { data: { id: this.id }})
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
        if (!userId) { return; }
        
        UserSocket.emitToUserId(this.userId, { operation: "ACTION", data: { deviceId: this.id, userId, cardId }});
    };

    forceDisconnect() {
        this.socket.close();
    };

};