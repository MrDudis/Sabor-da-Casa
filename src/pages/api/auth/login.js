import nextConnect from "next-connect";

import * as usersDb from "@/database/managers/users";
import * as tokensDb from "@/database/managers/tokens";

const handler = nextConnect({
    onError: (error, req, res, next) => {
        console.error(error.stack);
        res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ status: 404, message: "Não encontrado.", code: "NOT_FOUND" });
    }
});

handler.post(async (req, res) => {

    const { userinfo, password } = req.body;

    if (!userinfo || !password) {
        return res.status(400).json({ status: 400, message: "Preencha todos os campos.", code: "MISSING_CREDENTIALS" });
    };
    
    const user = await usersDb.getByCredentials(userinfo, password);

    if (!user) {
        return res.status(401).json({ status: 401, message: "Credenciais inválidas.", code: "INVALID_CREDENTIALS" });
    };

    const token = await tokensDb.insert(user.id);
    
    if (!token) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000;`);
    res.status(200).json({ status: 200, message: "OK", code: "OK" });

});

export default handler;