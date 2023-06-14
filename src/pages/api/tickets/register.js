import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import Ticket from "@/models/Ticket";
import { Role } from "@/models/User";

import * as ticketsDb from "@/database/managers/tickets";

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

handler.post(async (req, res) => {

    if (req.user.role > Role.EMPLOYEE) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para registrar comandas.", code: "UNAUTHORIZED" });
    };

    if (!"userId" in req.body) {
        return res.status(400).json({ status: 400, message: "Você precisa informar o id do cliente para a comanda.", code: "BAD_REQUEST" });
    };
    
    const newTicket = new Ticket({ userId: req.body?.userId, employeeId: req.user.id });

    const newTicketId = await ticketsDb.insert(newTicket);

    if (newTicketId == null) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    const ticket = await ticketsDb.get(newTicketId);

    res.status(200).json({ status: 200, message: "OK", code: "OK", ticket });

});

export default handler;