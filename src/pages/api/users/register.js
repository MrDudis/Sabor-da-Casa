import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import User, { Role } from "@/models/User";

import * as usersDb from "@/database/managers/users";

import { validateUserData } from "@/utils/validation/api/users";

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
        return res.status(403).json({ status: 403, message: "Você não tem permissão para registrar usuários.", code: "UNAUTHORIZED" });
    };

    let newUser = new User(req.body.user);
    newUser.password = newUser?.cpf;

    let errors = validateUserData(newUser, req.user);

    let checkUser = await usersDb.getByEmailOrCPF(newUser.email, newUser.cpf);

    if (checkUser) {
        if (checkUser.email == newUser.email) { errors = { ...errors, email: "Este e-mail já está em uso." }; };
        if (checkUser.cpf == newUser.cpf) { errors = { ...errors, cpf: "Este CPF já está em uso." }; };
    };

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ status: 400, message: "Erro de validação.", code: "VALIDATION_ERROR", errors });
    };

    let userId = await usersDb.insert(newUser);

    if (userId == null) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", userId });

});

export default handler;