import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import { Role } from "@/models/User";

import * as cardsDb from "@/database/managers/cards";
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

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para buscar cartões de usuários.", code: "UNAUTHORIZED" });
    };
    
    const id = req.query.id;

    const user = await usersDb.getById(id);

    if (!user) {
        return res.status(404).json({ status: 404, message: "Usuário não encontrado.", code: "NOT_FOUND" });
    };

    const cards = await cardsDb.getCardsByUserId(id);

    if (cards == null) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    for (let card of cards) {

        if (card.userId != null && card.userId == id) {
            card.user = user;
        } else {
            card.user = await usersDb.getById(card.userId);
        };

        card.user ??= null;

    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", cards });

});

export default handler;