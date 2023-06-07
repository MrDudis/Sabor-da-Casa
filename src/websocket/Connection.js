import { identify } from "./auth/identify.js";

import UserSocket from "./socket/UserSocket.js";
import DeviceSocket from "./socket/DeviceSocket.js";

export default class Connection {

    constructor(socket) {
        this.socket = socket;

        this.start();

        this.onMessage = (message) => this.identify(message);

        this.socket.on("message", (message) => this.onMessage(message));
    };

    start() {

        let startMessage = {
            operation: "HELLO"
        };

        this.socket.send(JSON.stringify(startMessage));

        this.identify();
        
    };

    async identify(message) {

        if (!message) { return; };

        message = JSON.parse(message);

        if (message?.operation == "IDENTIFY") {
            let token = message?.data?.token;

            let identification = await identify(token);
            
            if (identification?.authenticated) {
                
                this.socket.authenticated = true;
                this.socket.client = identification.client;
                
                let authenticatedMessage = {
                    operation: "IDENTIFY_SUCCESS"
                };

                this.socket.send(JSON.stringify(authenticatedMessage));

                if (identification.type == "user") {

                    let userSocket = new UserSocket(this.socket, identification.client);
                    this.onMessage = (message) => userSocket.onMessage(message);

                } else if (identification.type == "device") {
                    
                    let deviceSocket = new DeviceSocket(this.socket, (message?.data?.name ?? "Dispositivo Desconhecido"));
                    this.onMessage = (message) => deviceSocket.onMessage(message);

                };

            } else {

                let identifyErrorMessage = {
                    operation: "IDENTIFY_ERROR"
                };

                this.socket.send(JSON.stringify(identifyErrorMessage));

            };
        };

    };

};