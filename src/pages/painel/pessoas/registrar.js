import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";

import UserContext from "@/components/painel/auth/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import { AdvancedInput, AdvancedSelect } from "@/components/elements/Input";

import User, { Role, Gender } from "@/models/User";

import * as usersLib from "@/lib/users";

import { validateInputCPFChange, parseInputCPF } from "@/utils/validation/client/cpf";
import { validateInputDateChange, parseInputDate } from "@/utils/validation/client/date";
import { validateInputPhoneChange, parseInputPhone } from "@/utils/validation/client/phone";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {}
    };

};

function RegistrarPessoa() {

    const { user } = useContext(UserContext);

    const [userRegisterErrors, setUserRegisterErrors] = useState({});

    const handleUserRegisterInputChange = (event) => {
        let newUserRegisterErrors = userRegisterErrors[event.target.name] = null;
        setUserRegisterErrors({ ...userRegisterErrors, ...newUserRegisterErrors });

        switch (event.target.name) {
            case "cpf":
                event.target.value = validateInputCPFChange(event.target.value);
                break;
            case "phone":
                event.target.value = validateInputPhoneChange(event.target.value);
                break;
            case "birthdate":
                event.target.value = validateInputDateChange(event.target.value);
                break;
        };
    };

    const handleUserRegisterSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        let newUser = {
            name: formData.get("name"),
            cpf: parseInputCPF(formData.get("cpf")),
            email: formData.get("email"),
            phone: parseInputPhone(formData.get("phone")),
            role: formData.get("role"),
            birthdate: parseInputDate(formData.get("birthdate")),
            gender: formData.get("gender")
        };
        
        let response = await usersLib.register(newUser);

        if (response.status === 200) {
            window.location.href = `/painel/pessoas/${response.userId}`;
        } else {
            setUserRegisterErrors(response?.errors ?? { name: response?.message ?? "Erro desconhecido." });
        };

    };

    return (
        <>

            <Head>
                <title>Painel | Registrar Pessoa | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Registrar Pessoas | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel para registrar usuários no Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start gap-6 border-b border-neutral-800 scale-right-to-left">
                <Link href="/painel/pessoas" className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                    </svg>
                    <p className="font-lgc text-lg">Voltar</p>
                </Link>
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "600ms" }}>Registrar Pessoa</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/pessoas" className="hover:font-bold">Pessoas</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Registrar Pessoa</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-start items-start gap-6 py-6">

                <div className="w-full max-w-2xl flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="m620-283.609 191.782-191.782q12.435-12.435 31.348-12.435 18.913 0 31.348 12.435 12.435 12.434 12.316 31.228-.12 18.793-12.555 31.228L652.065-190.522q-13.761 13.674-32.108 13.674-18.348 0-32.022-13.674L477.522-300.935q-12.435-12.435-12.435-31.228 0-18.794 12.435-31.228 12.435-12.435 31.348-12.435 18.913 0 31.348 12.435L620-283.609Zm-417.13 171.74q-37.538 0-64.269-26.732-26.732-26.731-26.732-64.269v-554.26q0-37.538 26.732-64.269 26.731-26.732 64.269-26.732h157.912q12.435-35.717 45.936-58.456 33.5-22.739 73.282-22.739 41.196 0 74.37 22.739 33.174 22.739 45.848 58.456H757.13q37.538 0 64.269 26.732 26.732 26.731 26.732 64.269v151.63q0 19.152-13.174 32.326T802.63-560q-19.152 0-32.326-13.174T757.13-605.5v-151.63h-78.326v78.326q0 19.152-13.174 32.326t-32.326 13.174H326.696q-19.152 0-32.326-13.174t-13.174-32.326v-78.326H202.87v554.26H394.5q19.152 0 32.326 13.174T440-157.37q0 19.153-13.174 32.327T394.5-111.869H202.87ZM480-760.717q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Z"/>
                    </svg>
                    <h1 className="font-lgc text-2xl font-bold">Informações Pessoais</h1>
                </div>

                <form onSubmit={handleUserRegisterSubmit} className="w-full max-w-2xl flex flex-col gap-6 px-4 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "1000ms" }}>

                    <div className="w-full flex flex-row items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                            <path d="M774.261 459.218 601.435 287.826l52.608-53.174q25.261-25.261 61.587-25.826 36.327-.565 63.849 25.826l48.086 47.522q27.522 26.391 26.826 62-.695 35.609-25.956 60.87l-54.174 54.174ZM169.044 945.044q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-97.738q0-10.826 3.848-20.305 3.848-9.478 12.109-17.739l411.435-411.435 173.391 172.826-411.435 411.435q-8.261 8.261-18.021 12.109-9.761 3.848-20.588 3.848h-97.738Z"/>
                        </svg>
                        <h1 className="font-lgc font-bold text-xl">Adicionar Informações</h1>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col xl:flex-row gap-6">
                            <AdvancedInput name="name" label="Nome Completo" type="text" onChange={handleUserRegisterInputChange} error={userRegisterErrors?.name} bgColor="bg-neutral-100"></AdvancedInput>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-6">
                            <AdvancedInput name="cpf" label="CPF" type="text" onChange={handleUserRegisterInputChange} error={userRegisterErrors?.cpf} bgColor="bg-neutral-100"></AdvancedInput>
                            <AdvancedInput name="email" label="E-mail" type="text" onChange={handleUserRegisterInputChange} error={userRegisterErrors?.email} bgColor="bg-neutral-100"></AdvancedInput>
                        </div>

                        <div className="flex flex-col xl:flex-row items-start gap-6">
                            <AdvancedInput name="phone" label="Telefone" type="text" onChange={handleUserRegisterInputChange} error={userRegisterErrors?.phone} bgColor="bg-neutral-100"></AdvancedInput>
                            
                            <AdvancedSelect name="role" label="Cargo" bgColor="bg-neutral-100"
                                options={[
                                    { value: Role.CUSTOMER, label: "Cliente" },
                                    { value: Role.EMPLOYEE, label: "Funcionário" },
                                    { value: Role.CASHIER, label: "Caixa" },
                                    { value: Role.MANAGER, label: "Gerente" },
                                    { value: Role.ADMIN, label: "Administrador" }
                                ]}
                                defaultValue={Role.CUSTOMER}
                            ></AdvancedSelect>
                        </div>

                        <div className="flex flex-col xl:flex-row items-start gap-6">
                            <AdvancedInput name="birthdate" label="Data de Nascimento" type="text" onChange={handleUserRegisterInputChange} error={userRegisterErrors?.birthdate} bgColor="bg-neutral-100"></AdvancedInput>
                            
                            <AdvancedSelect name="gender" label="Sexo" bgColor="bg-neutral-100"
                                options={[ { label: "Masculino", value: Gender.MALE }, { label: "Feminino", value: Gender.FEMALE } ]}
                                defaultValue={Gender.MALE}
                            ></AdvancedSelect>
                        </div>
                    </div>

                    <div className="w-full flex flex-row justify-end items-center mt-2">
                        <button className="w-full xl:w-[35%] lg::max-w-sm flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white">
                                <path d="M766.218-410.283q-17.814 0-29.864-12.05t-12.05-29.863v-76.174h-76.173q-17.813 0-29.863-12.05t-12.05-29.863q0-17.813 12.05-29.863t29.863-12.05h76.173v-76.174q0-17.813 12.05-29.863t29.864-12.05q17.813 0 29.863 12.05t12.05 29.863v76.174h76.173q17.813 0 29.863 12.05 12.051 12.05 12.051 29.863t-12.051 29.863q-12.05 12.05-29.863 12.05h-76.173v76.174q0 17.813-12.05 29.863t-29.863 12.05Zm-404.783-73.782q-69.587 0-118.859-49.272-49.272-49.272-49.272-118.859 0-69.587 49.272-118.739t118.859-49.152q69.587 0 118.859 49.152 49.271 49.152 49.271 118.739t-49.271 118.859q-49.272 49.272-118.859 49.272ZM78.805-147.804q-19.153 0-32.327-13.174t-13.174-32.326v-75.109q0-36.224 18.743-66.589 18.742-30.365 49.801-46.346 62.717-31.239 127.664-46.978t131.923-15.739q67.435 0 132.391 15.619 64.957 15.62 127.196 46.859 31.059 15.947 49.801 46.245 18.742 30.299 18.742 66.929v75.109q0 19.152-13.174 32.326-13.173 13.174-32.326 13.174H78.805Z"/>
                            </svg>
                            Registrar
                        </button>
                    </div>
                    
                </form>

            </div>   

        </>
    );

};

RegistrarPessoa.requiresUser = true;

RegistrarPessoa.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Pessoas"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default RegistrarPessoa;