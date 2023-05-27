import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import { Role } from "@/models/User";
import Product from "@/models/Product";

import * as productsDb from "@/database/managers/products";

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

handler.post(async (req, res) => {

    if (req.user.role > Role.MANAGER) {
        return res.status(403).json({ status: 403, message: "Você não tem permissão para acessar esse recurso.", code: "UNAUTHORIZED" });
    };
    
    let newProduct = new Product(req.body.product);

    if (!newProduct.name) {
        return res.status(400).json({ status: 400, message: "Nome é obrigatório.", code: "MISSING_NAME" });
    };

    if (!newProduct.description) {
        return res.status(400).json({ status: 400, message: "Descrição é obrigatória.", code: "MISSING_DESCRIPTION" });
    };

    if (!newProduct.price) {
        return res.status(400).json({ status: 400, message: "Preço é obrigatório.", code: "MISSING_PRICE" });
    };

    if (newProduct.stock == null) { newProduct.stock = 0; };

    let newProductId = await productsDb.insert(newProduct);

    if (!newProductId) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", productId: newProductId });

});

export default handler;