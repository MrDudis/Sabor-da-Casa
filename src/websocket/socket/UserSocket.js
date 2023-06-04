import DeviceSocket from "./DeviceSocket.js";

export default class UserSocket {

    static sockets = new Set();

    static emit(message) {

        for (let socket of UserSocket.sockets) {
            socket.socket.send(JSON.stringify(message));
        };

    };

    constructor(socket) {
        this.socket = socket;
        this.guildId = null;

        UserSocket.sockets.add(this);
        
        this.socket.on("close", () => this.onClose());
    };

    onMessage(message) {
        if (!message) { return; };

        message = JSON.parse(message);

        
    };

    onClose() {
        UserSocket.sockets.delete(this);
    };

};