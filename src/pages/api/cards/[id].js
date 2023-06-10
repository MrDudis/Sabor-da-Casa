import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import Card from "@/models/Card";
import { Role } from "@/models/User";

import * as usersDb from "@/database/managers/users";
import * as cardsDb from "@/database/managers/cards";

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

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para buscar um cartão.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const card = await cardsDb.get(id);

    if (!card) {
        return res.status(404).json({ status: 404, message: "Cartão não encontrado.", code: "UNKNOWN_CARD" });
    };

    if (card.userId != null) {
        card.user = await usersDb.getById(card.userId);
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", card });

});

handler.patch(async (req, res) => {

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para editar um cartão.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    let { userId } = req.body;
    userId ??= null;
    
    let updated = await cardsDb.upsert(new Card({ id, userId }));

    if (!updated) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    const updatedCard = await cardsDb.get(id);

    if (updatedCard.userId != null) {
        updatedCard.user = await usersDb.getById(updatedCard.userId);
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", card: updatedCard });

});

handler.delete(async (req, res) => {

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para apagar um cartão.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const card = await cardsDb.get(id);

    if (!card) {
        return res.status(404).json({ status: 404, message: "Cartão não encontrado.", code: "UNKNOWN_CARD" });
    };

    let deleted = await cardsDb.deleteCard(id);

    if (!deleted) {
        return res.status(404).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK" });

});

export default handler;