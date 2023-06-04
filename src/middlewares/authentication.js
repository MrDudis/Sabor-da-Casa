import * as usersDb from "../database/managers/users.js";
import * as tokensDb from "../database/managers/tokens.js";

export default async function authenticate(req, res, next) {

    const token = req?.cookies?.token;

    if (!token) {
        return res.status(401).json({ status: 401, message: "Não autorizado.", code: "UNAUTHORIZED" });
    };

    const userId = await tokensDb.get(token);

    if (!userId) {
        return res.status(401).json({ status: 401, message: "Não autorizado.", code: "UNAUTHORIZED" });
    };

    const user = await usersDb.getById(userId);

    if (!user) {
        return res.status(401).json({ status: 401, message: "Não autorizado.", code: "UNAUTHORIZED" });
    };

    req.user = user;
    
    return next();
};