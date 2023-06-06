import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import { Role } from "@/models/User";

import * as usersDb from "@/database/managers/users";

const handler = nextConnect({
    onError: (error, req, res, next) => {
        console.error(error.stack);
        res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ status: 404, message: "Não encontrado.", code: "NOT_FOUND" });
    }
});

handler.use(authentication);

handler.get(async (req, res) => {

    if (req.user.role > Role.MANAGER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para buscar dispositivos.", code: "UNAUTHORIZED" });
    };

    const deviceSockets = req.wss.getDeviceSocket().sockets;

    let devices = [];

    for (let deviceSocket of deviceSockets) {

        let device = {
            id: deviceSocket.id,
            name: deviceSocket.name,
            userId: deviceSocket.userId,
        };
        
        if (deviceSocket.userId != null) {
            device.user = await usersDb.getById(device.userId);
        } else {
            device.user = null;
        };

        devices.push(device);

    };
    
    res.status(200).json({ status: 200, message: "OK", code: "OK", devices });

});

export default handler;