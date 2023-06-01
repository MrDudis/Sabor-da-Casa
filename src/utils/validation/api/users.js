import { Role } from "@/models/User";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

export function validateUserMeData(user) {

    let errors = {};

    if (!user.name || user.name === "") { 
        errors = { ...errors, name: "O nome completo é obrigatório." };
    } else {

        if (user.name.length < 3) {
            errors = { ...errors, name: "O nome completo deve ter no mínimo 3 caracteres." };
        } else  if (user.name.length > 255) {
            errors = { ...errors, name: "O nome completo não pode ter mais que 255 caracteres." };
        };

        if (user.name.split(" ").length < 2) {
            errors = { ...errors, name: "Nome inválido." };
        };

    };

    if (!user.cpf || user.cpf == "") {
        errors = { ...errors, cpf: "O CPF é obrigatório." };
    } else {

        if (user.cpf.length < 11 || user.cpf.length > 11) {
            errors = { ...errors, cpf: "O CPF deve ter 11 dígitos." };
        };

        if (!/^\d+$/.test(user.cpf)) {
            errors = { ...errors, cpf: "O CPF deve conter apenas números." };
        };

    };

    if (!user.email || user.email == "") {
        errors = { ...errors, email: "O e-mail é obrigatório." };
    } else {
            
        if (user.email.length < 3) {
            errors = { ...errors, email: "O e-mail deve ter no mínimo 3 caracteres." };
        } else if (user.email.length > 255) {
            errors = { ...errors, email: "O e-mail não pode ter mais que 255 caracteres." };
        };

        if (!emailRegex.test(user.email)) {
            errors = { ...errors, email: "E-mail inválido." };
        };
    
    };

    if (!user.phone || user.phone == "") {
        errors = { ...errors, phone: "O telefone é obrigatório." };
    } else {

        if (!/^\d+$/.test(user.phone)) {
            errors = { ...errors, phone: "O telefone deve conter apenas números." };
        };

        if (user.phone.length < 10 || user.phone.length > 11) {
            errors = { ...errors, phone: "O telefone deve ter entre 10 e 11 dígitos." };
        };
    
    };

    if (!user.birthdate || user.birthdate == "") {
        errors = { ...errors, birthdate: "A data de nascimento é obrigatória." };
    } else {

        if (!dateRegex.test(user.birthdate)) {
            errors = { ...errors, birthdate: "Data de nascimento inválida." };
        };

    };

    if (!user.gender || user.gender == "") {
        errors = { ...errors, gender: "O sexo é obrigatório." };
    } else {

        if (user.gender < 0 || user.gender > 1) {
            errors = { ...errors, gender: "Sexo inválido." };
        };

    };

    return errors;

};

export function validateUserData(user, me) {

    let errors = validateUserMeData(user);

    if (!user.role || user.role == "") {
        errors = { ...errors, role: "O cargo é obrigatório." };
    } else {

        if (user.role < Role.ADMIN || user.role > Role.CUSTOMER) {
            errors = { ...errors, role: "Cargo inválido." };
        };

        if (me.role != Role.ADMIN && me.role >= user.role) {
            errors = { ...errors, role: "Você não tem permissão para criar um usuário com este cargo." };
        };

    };

    return errors;
    
};