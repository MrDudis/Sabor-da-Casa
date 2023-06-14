export function formatPrice(price) {
    if (!price) return "R$ --,--";

    let priceFormatted = price.toString();

    priceFormatted = priceFormatted.replace(/[^0-9,.]/g, "");

    if (priceFormatted === "") return "R$ --,--";

    priceFormatted = priceFormatted.replace(/\./g, ",");

    if (!priceFormatted.includes(",")) {
        priceFormatted += ",00";
    } else {
        if (priceFormatted.match(/,\d$/)) { priceFormatted += "0"; };
        if (priceFormatted.match(/,$/)) { priceFormatted += "00"; };
    };
    
    priceFormatted = priceFormatted.replace(/(,\d{2})\d+$/g, "$1");

    priceFormatted = priceFormatted.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    return "R$ " + priceFormatted;
};