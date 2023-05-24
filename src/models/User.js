export const Gender = {
    MALE: 0,
    FEMALE: 1,
};

export const Role = {
    ADMIN: 0,
    MANAGER: 1,
    CASHIER: 2,
    EMPLOYEE: 3,
    CUSTOMER: 4
};

export default class User {

    constructor(data) {
        this.id = data.id;
        this.patch(data);
    };

    patch(data) {

        if (data.id) {
            this.id = data.id;
        } else {
            this.id ??= null;
        };

        if (data.nome || data.name) { 
            this.name = data.nome || data.name; 
        } else {
            this.name ??= null;
        };

        if (data.cpf) {
            this.cpf = data.cpf;
        } else {
            this.cpf ??= null;
        };

        if (data.data_nasc || data.birthdate) {
            this.birthdate = data.data_nasc || data.birthdate;
        } else {
            this.birthdate ??= null;
        };

        if (data.email) {
            this.email = data.email;
        } else {
            this.email ??= null;
        };

        if (data.telefone || data.phone) {
            this.phone = data.telefone || data.phone;
        } else {
            this.phone ??= null;
        };
        
        if ("sexo" in data || "gender" in data) {
            this.gender = data.gender || data.sexo;
        } else {
            this.gender ??= null;
        };

        if (data.administrador_id) {
            this.role = Role.ADMIN;
        } else if (data.funcionario_id) {
            this.role = Role.EMPLOYEE;
        } else  if (data.gerente_id) {
            this.role = Role.MANAGER;
        } else {
            this.role = Role.CUSTOMER;
        };

    }

}