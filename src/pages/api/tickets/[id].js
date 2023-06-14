import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import { Role } from "@/models/User";

import * as ticketsDb from "@/database/managers/tickets";
import * as usersDb from "@/database/managers/users";
import * as productsDb from "@/database/managers/products";

const handler = nextConnect({
    onError: (error, req, res, next) => {
        console.error(error.stack);
        res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ status: 404, message: "Não encontrado.", code: "NOT_FOUND" });
    }
});

handler.use(authentication)

handler.get(async (req, res) => {

    if (req.user.role > Role.EMPLOYEE) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para buscar uma comanda.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const ticket = await ticketsDb.get(id);

    if (!ticket) {
        return res.status(404).json({ status: 404, message: "Comanda não encontrada.", code: "UNKNOWN_TICKET" });
    };

    if (ticket.userId != null) {
        ticket.user = await usersDb.getById(ticket.userId);
    };

    if (ticket.employeeId != null) {
        ticket.employee = await usersDb.getById(ticket.employeeId);
    };
    
    for (let product of ticket.products) {
        
        if (product?.id != null) {
            let productData = await productsDb.get(product.id);
            ticket.products[ticket.products.indexOf(product)] = { ...product, ...productData };
        };

    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", ticket });

});

handler.delete(async (req, res) => {

    if (req.user.role > Role.EMPLOYEE) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para buscar uma comanda.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const ticket = await ticketsDb.get(id);

    if (!ticket) {
        return res.status(404).json({ status: 404, message: "Comanda não encontrada.", code: "UNKNOWN_TICKET" });
    };

    if (!ticket.active) {
        return res.status(400).json({ status: 400, message: "Você não pode pagar uma comanda que já está paga.", code: "INACTIVE_TICKET" });
    };

    const deleted = await ticketsDb.deleteTicket(id);

    if (!deleted) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK" });

});

export default handler;