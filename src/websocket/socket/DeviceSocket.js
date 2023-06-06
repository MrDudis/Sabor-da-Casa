import UserSocket from "./UserSocket.js";

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

    onMessage(message) {
        if (!message) { return; };

        message = JSON.parse(message);
        
        //
    };

    onClose() {
        DeviceSocket.sockets.delete(this);

        UserSocket.emit({ operation: "REFRESH_DEVICES" });
        UserSocket.emit({ operation: "DELETE_DEVICE" }, { data: { id: this.id }})
    };

    setUserId(userId) {
        this.userId = userId;

        UserSocket.emit({ operation: "REFRESH_DEVICES" });
        UserSocket.emit({ operation: "UPDATE_DEVICE" }, { data: { id: this.id }})
    };

    forceDisconnect() {
        this.socket.close();
    };

};