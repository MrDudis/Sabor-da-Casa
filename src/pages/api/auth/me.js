import nextConnect from "next-connect";

import { getById } from "@/database/users/get";
import { getUserIdByToken } from "@/database/tokens/get"

const handler = nextConnect({
    onError: (error, req, res, next) => {
        console.error(error.stack);
        res.status(500).json({ status: 500, message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ status: 404, message: "Not Found", code: "NOT_FOUND" });
    }
});

handler.get(async (req, res) => {

    const token = req?.cookies?.token;

    if (!token) {
        return res.status(401).json({ status: 401, message: "Não autorizado.", code: "UNAUTHORIZED" });
    };

    const userId = await getUserIdByToken(token);

    if (!userId) {
        return res.status(401).json({ status: 401, message: "Não autorizado.", code: "UNAUTHORIZED" });
    };

    const user = await getById(userId);

    if (!user) {
        return res.status(401).json({ status: 401, message: "Não autorizado.", code: "UNAUTHORIZED" });
    };
    
    res.status(200).json({ status: 200, message: "OK", code: "OK", user });

});

export default handler;