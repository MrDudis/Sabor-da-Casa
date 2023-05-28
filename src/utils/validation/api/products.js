export function validateProductData(product) {

    let errors = {};

    if (!product.name || product.name === "") { 
        errors = { ...errors, name: "O nome do produto é obrigatório." };
    } else {

        if (product.name.length < 3) {
            errors = { ...errors, name: "O nome do produto deve ter no mínimo 3 caracteres." };
        } else  if (product.name.length > 255) {
            errors = { ...errors, name: "O nome do produto não pode ter mais que 255 caracteres." };
        };

    };

    if (!product.description || product.description === "") {
        errors = { ...errors, description: "A descrição do produto é obrigatória." };
    } else {
            
        if (product.description.length < 3) {
            errors = { ...errors, description: "A descrição do produto deve ter no mínimo 3 caracteres." };
        } else  if (product.description.length > 1024) {
            errors = { ...errors, description: "A descrição do produto não pode ter mais que 1024 caracteres." };
        };
    
    };

    if (!product.price) {
        errors = { ...errors, price: "O preço do produto é obrigatório." };
    } else {
            
        let priceFloat = parseFloat(product.price);

        if (isNaN(priceFloat)) {
            errors = { ...errors, price: "O preço do produto é inválido." };
        } else if (product.price < 0) {
            errors = { ...errors, price: "O preço do produto não pode ser negativo." };
        };

    };

    if (!product.stock || product.stock == "") {
        errors = { ...errors, stock: "A quantidade em estoque do produto é obrigatória." };
    } else {
                
        if (product.stock < 0) {
            errors = { ...errors, stock: "A quantidade em estoque do produto não pode ser negativa." };
        };
    
    };

    return errors;

};