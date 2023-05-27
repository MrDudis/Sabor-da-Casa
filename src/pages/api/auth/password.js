import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

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

handler.patch(async (req, res) => {

    const { currentPassword, newPassword } = req.body;

    let errors = {};

    if (!currentPassword || !newPassword) {
        errors = {
            ...errors,
            currentPassword: !currentPassword ? "Digite sua senha atual." : null,
            newPassword: !newPassword ? "Digite sua nova senha." : null
        };
    };

    if (newPassword && newPassword.length < 7) {
        errors = {
            ...errors,
            newPassword: "Sua senha deve conter no mínimo 7 caracteres."
        };
    };

    const validPassword = await usersDb.validatePassword(req.user, currentPassword);

    if (!validPassword && currentPassword != "") {
        errors = {
            ...errors,
            currentPassword: "Senha incorreta."
        };
    };

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ status: 400, message: "Erro de validação.", code: "VALIDATION_ERROR", errors });
    };

    const updatedUser = await usersDb.updatePassword(req.user, newPassword);

    if (!updatedUser) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "Senha alterada com successo!", code: "OK" });

});

export default handler;