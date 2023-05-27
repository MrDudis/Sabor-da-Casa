import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import User, { Role } from "@/models/User";

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

handler.post(async (req, res) => {

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para acessar esse recurso.", code: "UNAUTHORIZED" });
    };

    let newUser = new User(req.body.user);
    newUser.password = newUser?.cpf;

    if (!newUser.name) {
        return res.status(400).json({ status: 400, message: "O nome é obrigatório.", code: "BAD_REQUEST" });
    };

    if (!newUser.cpf) {
        return res.status(400).json({ status: 400, message: "O CPF é obrigatório.", code: "BAD_REQUEST" });
    };

    if (!newUser.email) {
        return res.status(400).json({ status: 400, message: "O email é obrigatório.", code: "BAD_REQUEST" });
    };

    if (!newUser.role) {
        return res.status(400).json({ status: 400, message: "O nível de acesso é obrigatório.", code: "BAD_REQUEST" });
    };
    
    if (req.user.role != Role.ADMIN && req.user.role >= newUser.role) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para criar um usuário com esse nível de acesso.", code: "UNAUTHORIZED" });
    };

    if (!newUser.phone) {
        return res.status(400).json({ status: 400, message: "O telefone é obrigatório.", code: "BAD_REQUEST" });
    };

    if (!newUser.birthdate) {
        return res.status(400).json({ status: 400, message: "A data de nascimento é obrigatória.", code: "BAD_REQUEST" });
    };

    let userId = await usersDb.insert(newUser);

    if (userId == null) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", userId });

});

export default handler;