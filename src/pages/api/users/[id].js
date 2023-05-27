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

handler.use(authentication)

handler.get(async (req, res) => {

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para acessar esse recurso.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const user = await usersDb.getById(id);

    if (!user) {
        return res.status(404).json({ status: 404, message: "Usuário não encontrado.", code: "UNKNOWN_USER" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", user });

});

handler.patch(async (req, res) => {

    if (req.user.role > Role.MANAGER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para acessar esse recurso.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const user = await usersDb.getById(id);

    if (!user) {
        return res.status(404).json({ status: 404, message: "Usuário não encontrado.", code: "UNKNOWN_USER" });
    };

    let newUserData = { ...req.body.user };
    let newUser = Object.assign({}, user, newUserData);

});

handler.delete(async (req, res) => {

    if (req.user.role > Role.MANAGER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para acessar esse recurso.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    if (req.user.id == id) {
        return res.status(403).json({ status: 403, message: "Não tenta apagar você mesmo >:C", code: "UNAUTHORIZED" });
    };

    let deleted = usersDb.deleteUser(id);

    if (!deleted) {
        return res.status(404).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK" });

});

export default handler;