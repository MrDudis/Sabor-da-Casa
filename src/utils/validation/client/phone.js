export function validateInputPhoneChange(value) {

    let newValue = value.replace(/[^0-9]/g, "");

    newValue = newValue.slice(0, 11);

    const match = newValue.match(/^(\d{0,2})(\d{0,5})?(\d{0,4})?$/);

    if (match) {
        newValue = `${match[1] ? `(${match[1]}` : ''}${match[2] ? `) ${match[2]}` : ''}${match[3] ? `-${match[3]}` : ''}`;
    };

    newValue = newValue.slice(0, 15);

    return newValue;

};

export function parseInputPhone(value) {

    let newValue = value.replace(/[^0-9]/g, "");
    return newValue;

};