export function generateToken() {

    let token = "";

    for (let i = 0; i < 64; i++) {
        token += Math.floor(Math.random() * 16).toString(16);
    }

    return token;

};