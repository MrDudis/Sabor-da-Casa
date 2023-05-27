import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import User from "@/models/User";

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

    res.status(200).json({ status: 200, message: "OK", code: "OK", user: req.user });

});

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

handler.patch(async (req, res) => {

    let formattedUserBody = new User({ id: req.user.id, role: req.user.role, ...req.body.user });
    let newUserData = { ...req.user, ...formattedUserBody };
    
    let errors = {};

    if (!newUserData.name || !newUserData.cpf || !newUserData.email || !newUserData.phone || !newUserData.birthdate) {
        errors = {
            ...errors,
            name: newUserData.name ? null : "Digite seu nome.",
            cpf: newUserData.cpf ? null : "Digite seu CPF.",
            email: newUserData.email ? null : "Digite seu e-mail.",
            phone: newUserData.phone ? null : "Digite seu telefone.",
            birthdate: newUserData.birthdate ? null : "Digite sua data de nascimento.",
        };
    };

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ status: 400, message: "Erro de validação.", code: "VALIDATION_ERROR", errors });
    };

    newUserData.cpf = newUserData.cpf.replace(/\D/g, "");
    newUserData.phone = newUserData.phone.replace(/\D/g, "");

    newUserData.birthdate = newUserData.birthdate.replace(/\//g, "-");
    newUserData.birthdate = newUserData.birthdate.split("-").reverse().join("-");

    if (newUserData.name.split(" ").length < 2) {
        errors = {
            ...errors,
            name: "Nome inválido."
        };
    };

    if (newUserData.cpf.length != 11) {
        errors = {
            ...errors,
            cpf: "CPF inválido."
        };
    };

    if (!emailRegex.test(newUserData.email)) {
        errors = {
            ...errors,
            email: "E-mail inválido."
        };
    };

    if (newUserData.phone.length < 10) {
        errors = {
            ...errors,
            phone: "Telefone inválido."
        };
    };

    if (newUserData.birthdate.split("-").length < 3) {
        errors = {
            ...errors,
            birthdate: "Data de nascimento inválida."
        };
    };
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ status: 400, message: "Erro de validação.", code: "VALIDATION_ERROR", errors });
    };

    let newUser = new User(newUserData);
    
    let updated = await usersDb.updateUser(newUser);

    if (!updated) {
        return res.status(400).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", user: newUser });

});

export default handler;