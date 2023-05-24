import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import { updateUser } from "@/database/users/update";

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

    req.user = { ...req.user, ...req.body.user };
    let newUser = await updateUser(req.user);

    if (!newUser) {
        return res.status(400).json({ status: 500, message: "Algo deu errado.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", user: newUser });

});

export default handler;