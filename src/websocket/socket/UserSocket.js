import DeviceSocket from "./DeviceSocket.js";

export default class UserSocket {

    static sockets = new Set();

    static emit(message) {

        for (let socket of UserSocket.sockets) {
            socket.socket.send(JSON.stringify(message));
        };

    };

    static emitToUserId(userId, message) {
            
        for (let socket of UserSocket.sockets) {
            if (socket.userId == userId) {
                socket.sendMessage(message);
            };
        };

    };

    constructor(socket, user) {
        this.socket = socket;

        this.user = user;
        this.userId = user.id;

        UserSocket.sockets.add(this);
        
        this.socket.on("close", () => this.onClose());
    };

    sendMessage(message) {
        this.socket.send(JSON.stringify(message));
    };

    onMessage(message) {
        if (!message) { return; };

        message = JSON.parse(message);

        // Handles messages from the user to the server
        // Currently there are no messages from the user to the server
    };

    onClose() {
        UserSocket.sockets.delete(this);
    };

};