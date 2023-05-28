export function formatCPF(cpf) {
    
    let cpfFormatted = cpf.toString();

    cpfFormatted = cpfFormatted.replace(/[^0-9]/g, "");

    if (cpfFormatted == "") { return "---.---.---/--"; };

    const match = cpfFormatted.match(/^(\d{0,3})(\d{0,3})?(\d{0,3})?(\d{0,2})?$/);

    if (match) {
        cpfFormatted = `${match[1]}${match[2] ? `.${match[2]}` : ''}${match[3] ? `.${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
    };

    return cpfFormatted;

};