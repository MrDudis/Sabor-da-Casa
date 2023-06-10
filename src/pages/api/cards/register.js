import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import Card from "@/models/Card";
import { Role } from "@/models/User";

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

handler.use(authentication);

handler.post(async (req, res) => {

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para registrar cartões.", code: "UNAUTHORIZED" });
    };
    
    const newCard = req.body?.card;
    
    if (!newCard || newCard.id == null) {
        return res.status(400).json({ status: 400, message: "Você precisa informar o ID do cartão.", code: "BAD_REQUEST" });
    };

    let card = await cardsDb.get(newCard.id);

    if (card) {
        return res.status(400).json({ status: 400, message: "Um cartão com este ID já está registrado.", code: "ALREADY_REGISTERED" });
    };

    if (!newCard.id.match(/^[0-9]+$/)) {
        return res.status(400).json({ status: 400, message: "O ID do cartão deve conter apenas números.", code: "BAD_REQUEST" });
    };
    
    const upserted = await cardsDb.upsert(new Card(newCard));

    if (!upserted) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    card = await cardsDb.get(newCard.id);

    res.status(200).json({ status: 200, message: "OK", code: "OK", card });

});

export default handler;