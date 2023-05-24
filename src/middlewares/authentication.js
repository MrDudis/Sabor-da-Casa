import { getById } from "@/database/users/get";
import { getUserIdByToken } from "@/database/tokens/get"

export default async function authenticate(req, res, next) {

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

    req.user = user;
    
    return next();
};