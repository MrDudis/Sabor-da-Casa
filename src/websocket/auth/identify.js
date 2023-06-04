import * as tokensDb from "../../database/managers/tokens.js";
import * as usersDb from "../../database/managers/users.js";

export async function identify(token) {
    
    if (token == process.env.DEVICE_TOKEN) {

        return {
            authenticated: true,
            type: "device",
            client: {
                token: token
            }
        };

    };

    let userId = await tokensDb.get(token);
    if (!userId) { return { authenticated: false }; };

    let user = await usersDb.getById(userId);
    if (!user) { return { authenticated: false }; };
    
    return {
        authenticated: true,
        type: "user",
        client: user
    };

};