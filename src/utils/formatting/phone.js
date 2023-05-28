export function formatPhone(phone) {
    
    let phoneFormatted = phone.toString();

    phoneFormatted = phoneFormatted.replace(/[^0-9]/g, "");

    if (phoneFormatted == "") { return "(--) -----/----"; };

    const match = phoneFormatted.match(/^(\d{0,2})(\d{0,5})?(\d{0,4})?$/);

    if (match) {
        phoneFormatted = `${match[1] ? `(${match[1]}` : ''}${match[2] ? `) ${match[2]}` : ''}${match[3] ? `-${match[3]}` : ''}`;
    };

    return phoneFormatted;

};