import crypto from "crypto";

export default function hashSHA256(string) {

    const hash = crypto.createHash("sha256");
    hash.update(string);
    return hash.digest("hex");

};