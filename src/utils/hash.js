import crypto from "crypto";

export function hashStringToSHA256(string) {

    const hash = crypto.createHash("sha256");
    
    hash.update(string);

    return hash.digest("hex");

};