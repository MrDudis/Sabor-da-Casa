import { useState, useEffect } from "react";

import WebSocketContext from "@/providers/websocket/WebSocketContext";

import EventEmitter from "events";

class WebSocketManager extends EventEmitter {

    constructor(token) {
        super();
        this.socket = null;
        this.token = token;

        this.connect();
    };

    connect() {
        this.socket = new WebSocket("ws://192.168.15.151:8081/");

        this.socket.onopen = this.onopen.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onclose = this.onclose.bind(this);
    };

    onopen() {

    };

    onmessage(event) {
        if (!event.data) { return; };
            
        const message = JSON.parse(event.data);

        switch (message.operation) {
            case "HELLO":
                this.socket.send(JSON.stringify({ operation: "IDENTIFY", data: { token: this.token } }));
                break;
            default:
                this.emit(message.operation, message);
                break;
        };
    };

    onclose() {

    };

};

const WebSocketProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);

    const connect = (token) => {
        if (socket) { return; }
        setSocket(new WebSocketManager(token));
    };

    return (
        <WebSocketContext.Provider value={{ connect, socket }}>
            {children}
        </WebSocketContext.Provider>
    );

};

export default WebSocketProvider;