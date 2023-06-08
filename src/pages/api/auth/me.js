import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import User from "@/models/User";

import * as usersDb from "@/database/managers/users";

import { validateUserMeData } from "@/utils/validation/api/users";

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

    res.status(200).json({ status: 200, message: "OK", code: "OK", user: req.user });

});

handler.patch(async (req, res) => {

    let newUser = new User({ ...req.user, ...req.body.user, id: req.user.id, role: req.user.role });
    
    let errors = validateUserMeData(newUser);

    let checkUser = await usersDb.getByEmailOrCPF(newUser.email, newUser.cpf);

    if (checkUser && checkUser.id != req.user.id) {
        if (checkUser.email == newUser.email) { errors = { ...errors, email: "Este e-mail já está em uso." }; };
        if (checkUser.cpf == newUser.cpf) { errors = { ...errors, cpf: "Este CPF já está em uso." }; };
    };
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ status: 400, message: "Erro de validação.", code: "VALIDATION_ERROR", errors });
    };
    
    let updated = await usersDb.updateUser(newUser);

    if (!updated) {
        return res.status(400).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    const updatedUser = await usersDb.getById(newUser.id);

    res.status(200).json({ status: 200, message: "OK", code: "OK", user: updatedUser });

});

export default handler;