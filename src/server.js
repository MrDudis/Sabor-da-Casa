import http from "http";
import expressJS from "express";
import nextJS from "next";

import { WebSocketServer } from "ws";
import WebSocket from "./websocket/ws.js";

const express = expressJS();
const server = http.Server(express);

const next = nextJS({ dev: false });
const nextHandler = next.getRequestHandler();

next.prepare().then(async () => {

    const webSocketServer = new WebSocketServer({ port: process.env.WS_PORT });
    console.log(`> Ready on ws://localhost:${process.env.WS_PORT}`);

    const wss = new WebSocket(webSocketServer);

    express.all("*", (req, res) => {
        req.wss = wss;

        return nextHandler(req, res);
    });

    server.listen(process.env.PORT, (error) => {
        if (error) { throw error.message; };
        console.log(`> Ready on http://localhost:${process.env.PORT}`);
    });

});