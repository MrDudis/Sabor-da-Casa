import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

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
        return res.status(403).json({ status: 403, message: "Você não tem permissão para adicionar produtos em comandas.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const ticket = await ticketsDb.get(id);

    if (!ticket) {
        return res.status(404).json({ status: 404, message: "Comanda não encontrada.", code: "UNKNOWN_TICKET" });
    };
    
    if (!ticket.active) {
        return res.status(400).json({ status: 400, message: "Você não pode adicionar produtos a uma comanda inativa.", code: "INACTIVE_TICKET" });
    };

    const products = req.body?.products;
    
    if (!products || products.length == 0) {
        return res.status(400).json({ status: 400, message: "Você precisa informar os produtos para adicionar na comanda.", code: "BAD_REQUEST" });
    };

    const added = await ticketsDb.insertProducts(ticket, products);

    if (!added) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    const updatedTicket = await ticketsDb.get(id);

    res.status(200).json({ status: 200, message: "OK", code: "OK", ticket: updatedTicket });

});

handler.patch(async (req, res) => {

    if (req.user.role > Role.EMPLOYEE) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para editar produtos em comandas.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const ticket = await ticketsDb.get(id);

    if (!ticket) {
        return res.status(404).json({ status: 404, message: "Comanda não encontrada.", code: "UNKNOWN_TICKET" });
    };
    
    if (!ticket.active) {
        return res.status(400).json({ status: 400, message: "Você não pode editar os produtos de uma comanda inativa.", code: "INACTIVE_TICKET" });
    };

    const productId = req.body?.productId;
    const quantity = req.body?.quantity;

    if (productId == null || quantity == null) {
        return res.status(400).json({ status: 400, message: "Você precisa informar o produto e a quantidade para editar na comanda.", code: "BAD_REQUEST" });
    };

    const edited = await ticketsDb.updateProduct(ticket?.id, productId, quantity);

    if (!edited) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK" });

});

export default handler;