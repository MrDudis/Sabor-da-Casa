import UserSocket from "./UserSocket.js";

import * as devicesDb from "../../database/managers/devices.js";

export default class DeviceSocket {

    constructor(socket) {
        this.socket = socket;

        this.userId = 1;
        
        devicesDb.insert(this).then(id => {
            this.id = id;
        });
        
        UserSocket.emit({ operation: "REFRESH_DEVICES" });

        this.socket.on("close", async () => {
            await devicesDb.deleteDevice(this.id);
            UserSocket.emit({ operation: "REFRESH_DEVICES" });
        });
    };

    onMessage(message) {
        if (!message) { return; };

        message = JSON.parse(message);
        
        //
    };

};