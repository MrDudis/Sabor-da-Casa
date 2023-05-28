export function validateInputCPFChange(value) {

    let newValue = value.replace(/[^0-9]/g, "");

    newValue = newValue.slice(0, 11);

    const match = newValue.match(/^(\d{0,3})(\d{0,3})?(\d{0,3})?(\d{0,2})?$/);

    if (match) {
        newValue = `${match[1]}${match[2] ? `.${match[2]}` : ''}${match[3] ? `.${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
    };

    newValue = newValue.slice(0, 14); 

    return newValue;

};

export function parseInputCPF(value) {

    let newValue = value.replace(/,|\.|-/g, "");

    return newValue;

};