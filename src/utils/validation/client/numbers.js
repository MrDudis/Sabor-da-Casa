export function validateInputNumbersChange(value) {

    let newValue = value.replace(/[^0-9]/g, "");

    return newValue;

};