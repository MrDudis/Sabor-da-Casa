export function validateInputPriceChange(value) {

    let newValue = value.replace(/[^0-9,.]/g, "").replace(/\./g, ",");

    newValue = newValue.replace(/^,/, "");

    newValue = newValue.replace(/(,)(?=.*\1)/g, "");

    newValue = newValue.replace(/(,\d{2})(\d+)/g, "$1");

    newValue = newValue.replace(/^0+(?=\d)/g, "");

    return "R$ " + newValue;

};

export function validateInputPriceBlur(value) {

    let newValue = validateInputPriceChange(value);

    if (newValue === "R$ ") { return newValue; };

    if (!newValue.includes(",")) { 
        newValue += ",00"; 
    } else {
        if (newValue.match(/,\d$/)) { newValue += "0"; };
        if (newValue.match(/,$/)) { newValue += "00"; };
    };

    newValue = newValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    
    return newValue;

};

export function parseInputPrice(value) {

    let newValue = value.replace(/R\$\s?/g, "").replace(/\./g, "").replace(/,/g, ".");
    return newValue;

};