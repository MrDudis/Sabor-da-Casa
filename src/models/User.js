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

export const roleNames = {
    [Role.CUSTOMER]: "Cliente",
    [Role.EMPLOYEE]: "Funcionário",
    [Role.CASHIER]: "Caixa",
    [Role.MANAGER]: "Gerente",
    [Role.ADMIN]: "Administrador"
};

export default class User {

    constructor(data) {
        this._patch(data);
    };

    _patch(data) {

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
        
        if ("sexo" in data) {
            this.gender = data.sexo;
        } else if ("gender" in data) {
            this.gender = data.gender;
        } else {
            this.gender ??= null;
        };
        
        if ("role" in data) {
            this.role = data.role;
        } else if (data.administrador_id) {
            this.role = Role.ADMIN;
        } else if (data.funcionario_id) {
            this.role = Role.EMPLOYEE;
        } else if (data.gerente_id) {
            this.role = Role.MANAGER;
        } else if (data.caixa_id) {
            this.role = Role.CASHIER;
        } else {
            this.role = Role.CUSTOMER;
        };

        if ("data_criacao" in data) {
            this.createdAt = data.data_criacao;
        } else if ("createdAt" in data) {
            this.createdAt = data.createdAt;
        } else {
            this.createdAt ??= null;
        };

        if ("data_edicao" in data) {
            this.updatedAt = data.data_edicao;
        } else if ("updatedAt" in data) {
            this.updatedAt = data.updatedAt;
        } else {
            this.updatedAt ??= null;
        };

    }

}