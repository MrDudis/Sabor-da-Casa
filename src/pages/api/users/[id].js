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

handler.use(authentication)

handler.get(async (req, res) => {

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para buscar um usuário.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const user = await usersDb.getById(id);

    if (!user) {
        return res.status(404).json({ status: 404, message: "Usuário não encontrado.", code: "UNKNOWN_USER" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", user });

});

handler.patch(async (req, res) => {

    if (req.user.role > Role.CASHIER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para editar um usuário.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    const user = await usersDb.getById(id);

    if (!user) {
        return res.status(404).json({ status: 404, message: "Usuário não encontrado.", code: "UNKNOWN_USER" });
    };

    if (req.user.role >= user.role) {

        if (req.user.id == id) {
            return res.status(403).json({ status: 403, message: "Para editar as suas informações, utilize a aba Minha Conta.", code: "UNAUTHORIZED" });
        };

        return res.status(403).json({ status: 403, message: "Você não tem permissão para editar este usuário.", code: "UNAUTHORIZED" });
    };

    let newUser = new User(Object.assign({}, user, { ...req.body.user }));

    let errors = validateUserData(newUser, req.user);

    let checkUser = await usersDb.getByEmailOrCPF(newUser.email, newUser.cpf);

    if (checkUser && checkUser.id != id) {
        if (checkUser.email == newUser.email) { errors = { ...errors, email: "Este e-mail já está em uso." }; };
        if (checkUser.cpf == newUser.cpf) { errors = { ...errors, cpf: "Este CPF já está em uso." }; };
    };

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ status: 400, message: "Erro de validação.", code: "VALIDATION_ERROR", errors });
    };

    let updated = await usersDb.update(newUser);

    if (!updated) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    const updatedUser = await usersDb.getById(id);

    res.status(200).json({ status: 200, message: "OK", code: "OK", user: updatedUser });

});

handler.delete(async (req, res) => {

    if (req.user.role > Role.MANAGER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para deletar um usuário.", code: "UNAUTHORIZED" });
    };

    const id = req.query?.id;

    if (req.user.id == id) {
        return res.status(403).json({ status: 403, message: "Você não pode deletar você mesmo.", code: "UNAUTHORIZED" });
    };

    let deleted = usersDb.deleteUser(id);

    if (!deleted) {
        return res.status(404).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK" });

});

export default handler;