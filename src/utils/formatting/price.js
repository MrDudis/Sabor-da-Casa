export function formatPrice(price) {
    if (!price) return "R$ --,--";

    let priceFormatted = price.toString();

    // Remove any non-numeric characters, except for commas and periods.
    priceFormatted = priceFormatted.replace(/[^0-9,.]/g, "");

    if (priceFormatted === "") return "R$ --,--";

    // Replace dot with comma
    priceFormatted = priceFormatted.replace(/\./g, ",");

    // If there are no commas, add a comma and 2 zeros at the end.
    if (!priceFormatted.includes(",")) {
        priceFormatted += ",00";
    } else {
        if (priceFormatted.match(/,\d$/)) { priceFormatted += "0"; };
        if (priceFormatted.match(/,$/)) { priceFormatted += "00"; };
    };
    
    // Add a dot every 3 digits before the comma.
    priceFormatted = priceFormatted.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    
    return "R$ " + priceFormatted;
};