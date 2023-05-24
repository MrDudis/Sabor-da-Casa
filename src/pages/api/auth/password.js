import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import { validatePassword } from "@/database/users/validate";
import { updatePassword } from "@/database/users/update";

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

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ status: 400, message: "Preencha todos os campos.", code: "MISSING_PASSWORDS" });
    };

    const validPassword = await validatePassword(req.user, currentPassword);

    if (!validPassword) {
        return res.status(400).json({ status: 400, message: "Senha atual incorreta.", code: "INVALID_PASSWORD" });
    };

    const updatedUser = await updatePassword(req.user, newPassword);

    if (!updatedUser) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "Senha alterada com successo!", code: "OK" });

});

export default handler;