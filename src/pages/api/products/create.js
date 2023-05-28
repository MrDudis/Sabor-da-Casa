import nextConnect from "next-connect";

import authentication from "@/middlewares/authentication";

import { Role } from "@/models/User";
import Product from "@/models/Product";

import * as productsDb from "@/database/managers/products";

import { validateProductData } from "@/utils/validation/api/products";

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
        return res.status(403).json({ status: 403, message: "Você não tem permissão para criar um produto.", code: "UNAUTHORIZED" });
    };
    
    let newProduct = new Product(req.body.product);

    let errors = validateProductData(newProduct);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ status: 400, message: "Erro de validação.", code: "VALIDATION_ERROR", errors });
    };

    let newProductId = await productsDb.insert(newProduct);

    if (!newProductId) {
        return res.status(500).json({ status: 500, message: "Erro interno.", code: "INTERNAL_SERVER_ERROR" });
    };

    res.status(200).json({ status: 200, message: "OK", code: "OK", productId: newProductId });

});

export default handler;