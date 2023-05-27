export default function parsePrice(price) {
    if (!price) return "--";

    const priceString = price.toString().replace(",", ".").replace(/[^0-9.]/g, "");

    const priceArray = priceString.split(".");
    const priceInteger = priceArray[0];
    const priceDecimal = priceArray[1] || "00";
    const priceDecimalFormatted = priceDecimal.length === 1 ? `${priceDecimal}0` : priceDecimal;
    const priceFormatted = `${priceInteger},${priceDecimalFormatted}`;
    
    return priceFormatted;
};