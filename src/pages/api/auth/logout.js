import nextConnect from "next-connect";

import { deleteToken } from "@/database/tokens/delete";

const handler = nextConnect({
    onError: (error, req, res, next) => {
        console.error(error.stack);
        res.status(500).json({ status: 500, message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ status: 404, message: "Not Found", code: "NOT_FOUND" });
    }
});

handler.post(async (req, res) => {

    const token = req?.cookies?.token;

    if (!token) {
        return res.status(400).json({ status: 400, message: "Envie um token para fazer logout.", code: "MISSING_TOKEN" });
    };

    const deletedToken = await deleteToken(token);

    if (!deletedToken) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.setHeader("Set-Cookie", `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;`);
    res.status(200).json({ status: 200, message: "OK", code: "OK" });

});

export default handler;