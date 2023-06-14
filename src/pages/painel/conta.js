import { useContext, useState, useEffect } from "react";

import Head from "next/head";
import Link from "next/link";

import { roleNames, Gender } from "@/models/User";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import { BasicInput, AdvancedInput, BasicSelect } from "@/components/elements/input/Input";
import { MessageModal } from "@/components/elements/modal/Modal";

import * as meLib from "@/lib/me";

import { formatTimestamp } from "@/utils/formatting/timestamp";
import { formatCPF } from "@/utils/formatting/cpf";
import { formatDate } from "@/utils/formatting/date";
import { formatPhone } from "@/utils/formatting/phone";

import { validateInputCPFChange, parseInputCPF } from "@/utils/validation/client/cpf";
import { validateInputDateChange, parseInputDate } from "@/utils/validation/client/date";
import { validateInputPhoneChange, parseInputPhone } from "@/utils/validation/client/phone";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
        return { props: {} };
    };

    return {
        props: {
            token: req.cookies.token
        }
    };

};

function Conta({ token }) {

    const { showModal, closeModal } = useContext(ModalContext);
    const { user, setUser } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [userUpdateErrors, setUserUpdateErrors] = useState({});
    const [userUpdateLoading, setUserUpdateLoading] = useState(false);

    const handleUserUpdateInputChange = (event) => {
        const target = event.target;

        let newUserUpdateErrors = userUpdateErrors[target.name] = null;
        setUserUpdateErrors({ ...userUpdateErrors, ...newUserUpdateErrors });

        switch (target.name) {
            case "cpf":
                target.value = validateInputCPFChange(target.value);
                break;
            case "phone":
                target.value = validateInputPhoneChange(target.value);
                break;
            case "birthdate":
                target.value = validateInputDateChange(target.value);
                break;
        };
    };
    
    const handleUserUpdateSubmit = async (event) => {
        event.preventDefault();

        setUserUpdateLoading(true);

        const formData = new FormData(event.target);

        let newUser = {
            name: formData.get("name"),
            cpf: parseInputCPF(formData.get("cpf")),
            email: formData.get("email"),
            phone: parseInputPhone(formData.get("phone")),
            birthdate: parseInputDate(formData.get("birthdate")),
            gender: formData.get("gender")
        };

        let response = await meLib.updateUser(newUser);

        if (response.status === 200) {
            setUserUpdateErrors({});

            setUser(response.user);
            
            showModal(
                <MessageModal 
                    icon="success" title="Successo!" message="Suas alterações foram salvas com successo."
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
        } else {

            if (response.errors && Object.keys(response.errors).length > 0) {
                setUserUpdateErrors(response.errors);
            } else {
                showModal(
                    <MessageModal 
                        icon="error" title="Erro" message={response?.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
            };

        };

        setTimeout(() => { setUserUpdateLoading(false); }, 500);

    };

    const [passwordUpdateErrors, setPasswordUpdateErrors] = useState({});
    const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);

    const handlePasswordUpdateInputChange = (event) => {
        let newPasswordUpdateErrors = passwordUpdateErrors[event.target.name] = null;
        setPasswordUpdateErrors({ ...passwordUpdateErrors, ...newPasswordUpdateErrors });
    };

    const handlePasswordUpdateSubmit = async (event) => {
        event.preventDefault();

        setPasswordUpdateLoading(true);

        const formData = new FormData(event.target);

        if (formData.get("newPassword") !== formData.get("confirmNewPassword")) {
            setTimeout(() => { setPasswordUpdateLoading(false); }, 500);
            return setPasswordUpdateErrors({ confirmNewPassword: "As senhas não coincidem." });
        };

        let response = await meLib.updatePassword(formData.get("currentPassword"), formData.get("newPassword"));

        if (response.status === 200) {
            setPasswordUpdateErrors({});
            event.target.reset();

            showModal(
                <MessageModal 
                    icon="success" title="Successo!" message="Sua senha foi alterada com successo."
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
        } else {
            
            if (response.errors && Object.keys(response.errors).length > 0) {
                setPasswordUpdateErrors(response.errors);
            } else {
                showModal(
                    <MessageModal 
                        icon="error" title="Erro" message={response?.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
            };
            
        };

        setTimeout(() => { setPasswordUpdateLoading(false); }, 500);
    };

    return (
        <>

            <Head>
                <title>Painel | Minha Conta | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Minha Conta | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de configurações da sua conta no Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>
            
            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl text-left slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Minha Conta</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Minha Conta</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <div className="w-full md:w-[60%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M400-489.609q-74.479 0-126.849-52.37-52.369-52.37-52.369-126.849 0-74.478 52.369-126.565 52.37-52.088 126.849-52.088 74.479 0 126.849 52.088 52.369 52.087 52.369 126.565 0 74.479-52.369 126.849-52.37 52.37-126.849 52.37ZM113.782-131.172q-22.087 0-37.544-15.457-15.456-15.457-15.456-37.544v-79.348q0-41.479 22.37-74.436 22.369-32.956 52.369-47.956 51-26 119.24-44.848Q323-449.609 400-449.609h18.805q10.804 0 19.065 2-9.13 18-19.718 48.239-10.587 30.24-13.022 55.762-3.304 30.348-2.434 52.869.869 22.522 8.174 53.565 6.565 30.044 22.217 57.61 15.653 27.565 31.609 48.392H113.782Zm582.045-102.61q30.739 0 53.108-22.652 22.37-22.653 22.37-53.392 0-30.739-22.37-53.108-22.369-22.37-53.108-22.37-30.739 0-53.391 22.37-22.652 22.369-22.652 53.108 0 30.739 22.652 53.392 22.652 22.652 53.391 22.652Zm-59.914 70.174q-9.739-3.869-19.108-9.087-9.37-5.217-18.674-11.521l-40.739 12.434q-9.261 3.131-17.804-.5-8.544-3.63-13.109-11.891l-25.131-41.696q-5.13-8.261-3.348-18.087 1.783-9.826 9.479-16.522l31.304-26.739q-2.565-11.174-2.283-22.326.283-11.152 2.283-22.326l-31.304-27.304q-7.696-6.696-9.479-16.239-1.782-9.544 3.348-17.805l25.131-42.261q4.565-8.261 13.109-11.609 8.543-3.348 17.804-.217l40.739 12.434q9.304-6.304 18.674-11.521 9.369-5.218 19.108-9.087l8.435-41.174q2.565-9.261 9.544-15.457 6.978-6.195 16.239-6.195h50.826q9.261 0 16.24 6.195 6.978 6.196 9.543 15.457l8.435 41.174q9.739 3.869 19.391 9.304 9.652 5.435 18.957 13.304l39.173-13.869q9.261-4.131 18.305-.283 9.044 3.848 14.174 12.109l24.565 43.696q4.566 8.261 3.283 17.805-1.283 9.543-8.978 16.239l-31.739 27.304q2.565 9.739 2.282 21.326-.282 11.587-2.282 21.326l31.304 26.739q7.696 6.696 9.478 16.522 1.783 9.826-3.348 18.087l-25.13 41.696q-4.565 8.261-13.109 11.891-8.544 3.631-17.805.5l-40.173-12.434q-9.305 6.304-18.957 11.521-9.652 5.218-19.391 9.087l-8.435 41.174q-2.565 9.261-9.543 15.457-6.979 6.195-16.24 6.195h-50.826q-9.261 0-16.239-6.195-6.979-6.196-9.544-15.457l-8.435-41.174Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Minhas Informações</h1>
                    </div>

                    <div className="w-full flex flex-col xl:flex-row items-center gap-6">

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                <path d="M206.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-546.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848H240v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.739 13.478q13.479 13.478 13.479 32.739v33.783h293.998v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.74 13.478Q720-872.262 720-853.001v33.783h33.217q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v546.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-106.001h546.434V-560H206.783v393.217ZM480-395.478q-18.922 0-31.722-12.8T435.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T480-395.478Zm-160 0q-18.922 0-31.722-12.8T275.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T320-395.478Zm320 0q-18.13 0-31.326-12.8-13.196-12.8-13.196-31.722t13.196-31.722q13.196-12.8 31.609-12.8 18.413 0 31.326 12.8T684.522-440q0 18.922-12.8 31.722T640-395.478Zm-160 160q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T480-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm-160 0q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T320-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm320 0q-18.13 0-31.326-13.196-13.196-13.196-13.196-31.609 0-18.413 13.196-31.326t31.609-12.913q18.413 0 31.326 12.8T684.522-280q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Entrou em</p>
                                <p className="font-lgc text-lg">{formatTimestamp(user?.createdAt)}</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                <path d="M240-233.217h240v-18q0-17-9.5-31.5t-26.5-22.5q-20-9-40.5-13.5t-43.5-4.5q-23 0-43.5 4.5t-40.5 13.5q-17 8-26.5 22.5t-9.5 31.5v18Zm350-60h100q13 0 21.5-8.5t8.5-21.5q0-13-8.5-21.5t-21.5-8.5H590q-13 0-21.5 8.5t-8.5 21.5q0 13 8.5 21.5t21.5 8.5Zm-230-60q25 0 42.5-17.5t17.5-42.5q0-25-17.5-42.5t-42.5-17.5q-25 0-42.5 17.5t-17.5 42.5q0 25 17.5 42.5t42.5 17.5Zm230-60h100q13 0 21.5-8.5t8.5-21.5q0-13-8.5-21.5t-21.5-8.5H590q-13 0-21.5 8.5t-8.5 21.5q0 13 8.5 21.5t21.5 8.5ZM166.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-426.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h173.999v-106.434q0-40.914 26.326-67.24 26.326-26.326 67.24-26.326h91.304q40.914 0 67.24 26.326 26.326 26.326 26.326 67.24v106.434h173.999q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v426.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783ZM441.13-613.566h77.74V-798.87h-77.74v185.304Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Cargo</p>
                                <p className="font-lgc text-lg">{roleNames[user?.role]}</p>
                            </div>
                        </div>

                    </div>

                    <form onSubmit={handleUserUpdateSubmit} className="w-full flex flex-col gap-5 px-4 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>

                        <div className="w-full flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                                <path d="M774.261 459.218 601.435 287.826l52.608-53.174q25.261-25.261 61.587-25.826 36.327-.565 63.849 25.826l48.086 47.522q27.522 26.391 26.826 62-.695 35.609-25.956 60.87l-54.174 54.174ZM169.044 945.044q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-97.738q0-10.826 3.848-20.305 3.848-9.478 12.109-17.739l411.435-411.435 173.391 172.826-411.435 411.435q-8.261 8.261-18.021 12.109-9.761 3.848-20.588 3.848h-97.738Z"/>
                            </svg>
                            <h1 className="font-lgc font-bold text-xl">Editar Informações</h1>
                        </div>

                        <div className="flex flex-row items-center gap-3 bg-neutral-200 rounded-md px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M202.87-71.87q-37.783 0-64.392-26.608-26.609-26.609-26.609-64.392v-554.26q0-37.783 26.609-64.392 26.609-26.609 64.392-26.609H240V-845.5q0-17.957 12.457-30.294 12.456-12.337 30.413-12.337 17.956 0 30.293 12.337T325.5-845.5v37.369h309V-845.5q0-17.957 12.456-30.294 12.457-12.337 30.414-12.337 17.956 0 30.293 12.337T720-845.5v37.369h37.13q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v196.652q0 19.152-13.174 32.326t-32.327 13.174q-19.152 0-32.326-13.174t-13.174-32.326V-560H202.87v397.13H434.5q19.152 0 32.326 13.174T480-117.37q0 19.153-13.174 32.327T434.5-71.87H202.87Zm691.456-195.934-92.652-92.652 29-29q12.435-12.435 31.707-12.555 19.271-.119 31.945 12.555l29 29q12.674 12.674 12.555 31.945-.12 19.272-12.555 31.707l-29 29ZM633.5-26.13h-50.87q-9.195 0-15.913-6.717Q560-39.566 560-48.761v-50.87q0-9.195 3.359-17.532 3.358-8.337 10.076-15.054l200.239-200.239 92.652 92.652-200.239 200.24q-6.717 6.717-15.054 10.075-8.337 3.359-17.533 3.359Z"/>
                            </svg>
                            <div className="flex flex-col lg:flex-row gap-0 lg:gap-1">
                                <p className="font-lgc text-black font-bold">Última Edição em</p>
                                <p className="font-lgc text-black">{formatTimestamp(user?.updatedAt)}</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 bg-yellow-200 rounded-md px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="w-[28px]">
                                <path d="m858.391 455.131-66.304-30.652 66.269-30.123 30.123-66.269 30.652 66.304 65.74 30.088-65.74 30.652-30.652 65.74-30.088-65.74ZM723.13 244.391l-99.522-45.914 99.522-45.348 45.349-99.522 45.913 99.522 99.523 45.348-99.382 46.055-46.054 99.381-45.349-99.522ZM342.477 1010.48q-35.798 0-61.29-27.174-25.493-27.174-25.493-66.392h174.132q0 39.218-25.659 66.392-25.659 27.174-61.69 27.174ZM221.912 872.392q-18.922 0-31.722-12.8t-12.8-31.722q0-18.681 12.8-31.319 12.8-12.638 31.722-12.638h241.696q18.922 0 31.722 12.641 12.8 12.64 12.8 31.326t-12.8 31.599q-12.8 12.913-31.722 12.913H221.912ZM187.39 739.391Q113.303 695 68.564 621.195q-44.74-73.804-44.74-161.022 0-132.772 92.97-225.713 92.969-92.94 225.783-92.94t225.966 92.94q93.153 92.941 93.153 225.713 0 87.783-44.74 161.305Q572.217 695 498.13 739.391H187.39Z"/>
                            </svg>
                            <p className="font-lgc text-black">Não esqueça de salvar as informações quando terminar a edição.</p>
                        </div>
                        
                        <div className="flex flex-col items-start xl:flex-row gap-5">
                            <BasicInput name="name" label="Nome Completo" type="text" placeholder={user?.name} defaultValue={user?.name} error={userUpdateErrors?.name} onChange={handleUserUpdateInputChange}></BasicInput>
                            <BasicInput name="cpf" label="CPF" type="text" placeholder={formatCPF(user?.cpf)} defaultValue={formatCPF(user?.cpf)} error={userUpdateErrors?.cpf} onChange={handleUserUpdateInputChange}></BasicInput>
                        </div>

                        <div className="flex flex-col items-start xl:flex-row gap-5">
                            <BasicInput name="email" label="E-mail" type="text" placeholder={user?.email} defaultValue={user?.email} error={userUpdateErrors?.email} onChange={handleUserUpdateInputChange}></BasicInput>
                            <BasicInput name="phone" label="Telefone" type="text" placeholder={formatPhone(user?.phone)} defaultValue={formatPhone(user?.phone)} error={userUpdateErrors?.phone} onChange={handleUserUpdateInputChange}></BasicInput>
                        </div>

                        <div className="flex flex-col items-start xl:flex-row gap-5">
                            <BasicInput name="birthdate" label="Data de Nascimento" type="text" placeholder={formatDate(user?.birthdate)} defaultValue={formatDate(user?.birthdate)} error={userUpdateErrors?.birthdate} onChange={handleUserUpdateInputChange}></BasicInput>

                            <BasicSelect name="gender" label="Sexo"
                                options={[ { label: "Masculino", value: Gender.MALE }, { label: "Feminino", value: Gender.FEMALE } ]}
                                defaultValue={user?.gender}
                            ></BasicSelect>
                        </div>

                        <div className="w-full flex flex-row justify-end items-center mt-2">
                            <button disabled={userUpdateLoading} className="w-full xl:w-56 flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                { userUpdateLoading ? (
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white fast-fade-in">
                                        <path d="M206.783 955.218q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153V302.783q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h437.391q21.087 0 40.392 7.978 19.304 7.978 34.261 22.935l109.478 109.478q14.957 14.957 22.935 34.261 7.978 19.305 7.978 40.392v437.391q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783ZM480 809.217q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM299.784 502.783h253.998q22.088 0 37.544-15.457 15.457-15.456 15.457-37.544v-53.998q0-22.088-15.457-37.544-15.456-15.457-37.544-15.457H299.784q-22.088 0-37.544 15.457-15.457 15.456-15.457 37.544v53.998q0 22.088 15.457 37.544 15.456 15.457 37.544 15.457Z"/>
                                    </svg>
                                ) }

                                { userUpdateLoading ? "Salvando..." : "Salvar Alterações" }
                            </button>
                        </div>
                        
                    </form>

                </div>

                <div className="w-full md:w-[40%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M246.783-62.477q-43.726 0-74.863-31.138-31.138-31.138-31.138-74.864v-386.434q0-43.725 31.138-74.863 31.137-31.138 74.863-31.138h24.738v-63.608q0-87.522 60.761-148.848Q393.043-934.696 480-934.696t147.718 61.326q60.761 61.326 60.761 148.848v63.608h24.738q43.726 0 74.863 31.138 31.138 31.138 31.138 74.863v386.434q0 43.726-31.138 74.864-31.137 31.138-74.863 31.138H246.783ZM480-281.696q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5ZM377.523-660.914h204.954v-63.608q0-43.405-29.63-73.789T480-828.695q-43.217 0-72.847 30.384-29.63 30.384-29.63 73.789v63.608Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Segurança</h1>
                    </div>

                    <form onSubmit={handlePasswordUpdateSubmit} className="w-full flex flex-col items-start justify-start px-4 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>
                        
                        <div className="flex flex-row justify-start items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                                <path d="M251.87 577.13q0 50.044 19.804 90.739 19.805 40.696 51.717 72v-39.912q0-18.696 12.914-31.327Q349.218 656 367.913 656q18.696 0 31.327 12.63 12.63 12.631 12.63 31.327v154.347q0 22.087-15.457 37.544-15.456 15.457-37.543 15.457H205.087q-18.696 0-31.326-12.913-12.631-12.913-12.631-31.609t12.914-31.326q12.913-12.631 31.608-12.631h46.391q-49.87-46.261-78.022-107.978-28.152-61.718-28.152-133.718 0-100.782 53.522-181.304t139.87-121.653q17.957-9.13 36 1.544 18.044 10.674 24.174 31.761 5.566 19.957-2.63 39.196-8.196 19.239-26.153 29.5-53.173 28.739-85.978 82.261-32.804 53.522-32.804 118.695ZM708.13 576q.565-46.478-18.239-87.869-18.804-41.391-53.282-76v39.912q0 18.696-12.631 31.327Q611.348 496 592.652 496q-18.696 0-31.609-12.913t-12.913-31.609V297.696q0-22.087 15.457-37.544 15.456-15.457 37.543-15.457h153.783q18.696 0 31.326 12.631 12.631 12.63 12.631 31.326 0 18.696-12.631 31.609-12.63 12.913-31.326 12.913h-46.956q55.609 53 80.674 114.065 25.065 61.065 25.5 128.761H708.13ZM640 976q-17 0-28.5-11.5T600 936V816q0-17 11.5-28.5T640 776v-40q0-33 23.5-56.5T720 656q33 0 56.5 23.5T800 736v40q17 0 28.5 11.5T840 816v120q0 17-11.5 28.5T800 976H640Zm40-200h80v-40q0-17-11.5-28.5T720 696q-17 0-28.5 11.5T680 736v40Z"/>
                            </svg>
                            <h1 className="font-lgc font-bold text-lg">Alterar Senha</h1>
                        </div>

                        <div className="w-full flex flex-col gap-6 my-6">
                            <AdvancedInput name="currentPassword" label="Senha Atual" type="password" onChange={handlePasswordUpdateInputChange} error={passwordUpdateErrors?.currentPassword} bgColor="bg-neutral-100"></AdvancedInput>
                            <AdvancedInput name="newPassword" label="Senha Nova" type="password" onChange={handlePasswordUpdateInputChange} error={passwordUpdateErrors?.newPassword} bgColor="bg-neutral-100"></AdvancedInput>
                            <AdvancedInput name="confirmNewPassword" label="Confirmar Senha Nova" type="password" onChange={handlePasswordUpdateInputChange} error={passwordUpdateErrors?.confirmNewPassword} bgColor="bg-neutral-100"></AdvancedInput>
                        </div>

                        <div className="w-full flex flex-row justify-center items-center mt-2">
                            <button disabled={passwordUpdateLoading} className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                {
                                    passwordUpdateLoading ? (
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white fast-fade-in">
                                            <path d="M520 955.218q-65.391 0-123.152-19.782-57.761-19.783-106.022-56.479-18.522-14.391-21.218-38.391-2.696-24.001 15.261-42.523 14.391-14.391 35.326-14.956 20.935-.566 39.023 12.391 35 26 75.587 39.87 40.586 13.869 85.195 13.869 113.739 0 193.478-79.739T793.217 576q0-113.739-79.739-193.478T520 302.783q-112.043 0-192.63 78.891-80.587 78.891-80.587 191.5v3.608l42.174-41.608q12.695-12.696 30.891-12.696 18.196 0 31.326 12.696 13.131 13.13 13.131 31.326 0 18.196-13.131 31.326L231.391 717.609q-8.261 8.261-17.804 11.609-9.544 3.348-19.805 3.348t-19.804-3.348q-9.544-3.348-17.805-11.609L36.521 596.826Q23.825 584.13 24.042 566q.218-18.13 12.913-30.826 12.696-13.131 31.11-13.131 18.412 0 31.108 13.131l41.609 42.608v-4.608q0-77.826 29.913-146.153 29.913-68.326 80.956-119.37 51.044-51.043 120.218-80.956Q441.043 196.782 520 196.782t147.848 29.913q68.892 29.913 120.218 81.239 51.326 51.326 81.239 120.218Q899.218 497.043 899.218 576q0 158.479-110.369 268.849Q678.479 955.218 520 955.218ZM440 736q-17 0-28.5-11.5T400 696V576q0-17 11.5-28.5T440 536v-40q0-33 23.5-56.5T520 416q33 0 56.5 23.5T600 496v40q17 0 28.5 11.5T640 576v120q0 17-11.5 28.5T600 736H440Zm40-200h80v-40q0-17-11.5-28.5T520 456q-17 0-28.5 11.5T480 496v40Z"/>
                                        </svg>
                                    )
                                }
                                
                                { passwordUpdateLoading ? "Alterando..." : "Alterar Senha" }
                            </button>
                        </div>
                        
                    </form>

                    <form className="w-full flex flex-col items-start justify-start px-4 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        
                        <div className="flex flex-row justify-start items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M697.523-539.784q-20.392 0-34.718-14.326-14.326-14.326-14.326-34.718 0-20.391 14.326-34.435 14.326-14.043 34.718-14.043h160q20.391 0 34.435 14.043 14.043 14.044 14.043 34.435 0 20.392-14.043 34.718-14.044 14.326-34.435 14.326h-160Zm-335.827 50.175q-74.479 0-126.849-52.37-52.37-52.37-52.37-126.849 0-74.478 52.37-126.565 52.37-52.088 126.849-52.088 74.478 0 126.848 52.088 52.37 52.087 52.37 126.565 0 74.479-52.37 126.849-52.37 52.37-126.848 52.37ZM75.478-131.172q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-79.348q0-39.088 20.327-72.109 20.326-33.022 54.413-50.283 63.696-31.566 129.957-47.631t134.522-16.065q69.391 0 135.652 15.782 66.261 15.783 128.826 47.348 34.088 17.261 54.414 50.001 20.326 32.739 20.326 72.957v79.348q0 22.087-15.457 37.544-15.456 15.457-37.544 15.457H75.478Z"/>
                            </svg>
                            <h1 className="font-lgc font-bold text-lg">Excluir Conta</h1>
                        </div>

                        <div className="w-full flex flex-col gap-4 my-4">
                            <p className="font-lgc text-[17px]">Deleta todos os seus dados e exclui a sua conta, esse ação não é reversível.</p>
                            <p className="font-lgc text-[17px]">Essa ação demorará até 30 dias para ser concluída, e será automaticamente cancelada caso:</p>
                            <div className="w-full flex flex-row items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10" className="fill-neutral-500">
                                    <path d="M480.083-180.782q-124.996 0-212.149-87.07-87.152-87.069-87.152-212.065t87.07-212.149q87.069-87.152 212.065-87.152t212.149 87.07q87.152 87.069 87.152 212.065t-87.07 212.149q-87.069 87.152-212.065 87.152Z"/>
                                </svg>
                                <p className="font-lgc text-[17px]">Você acesse a sua conta novamente.</p>
                            </div>
                            <div className="w-full flex flex-row items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10" className="fill-neutral-500">
                                    <path d="M480.083-180.782q-124.996 0-212.149-87.07-87.152-87.069-87.152-212.065t87.07-212.149q87.069-87.152 212.065-87.152t212.149 87.07q87.152 87.069 87.152 212.065t-87.07 212.149q-87.069 87.152-212.065 87.152Z"/>
                                </svg>
                                <p className="font-lgc text-[17px]">Você visite o restaurante novamente.</p>
                            </div>
                            <p className="font-lgc text-[17px]">Caso você visite o restaurante novamente após a exclusão da conta estiver concluída, uma nova conta será criada para você.</p>
                        </div>

                        <div className="w-full flex flex-row justify-center items-center mt-2">
                            <button className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white">
                                    <path d="m480-394.391 69.217 69.217q14.261 13.261 33.305 13.261 19.043 0 32.304-13.261 14.261-14.261 14.261-33.304 0-19.044-14.261-32.305L545.609-460l69.217-69.217q14.261-14.261 14.261-33.305 0-19.043-14.261-32.304-12.696-13.696-32.022-13.696t-33.022 13.696L480-525.609l-69.217-69.217q-13.261-14.261-32.305-14.261-19.043 0-33.304 14.261-12.696 12.696-12.696 32.022t12.696 33.022L414.391-460l-69.217 69.217q-13.261 13.261-13.261 32.305 0 19.043 13.261 33.304 14.261 13.261 33.304 13.261 19.044 0 32.305-13.261L480-394.391ZM273.782-100.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-506.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h179.784q0-22.087 15.456-37.544 15.457-15.456 37.544-15.456h158.87q22.087 0 37.544 15.456 15.456 15.457 15.456 37.544h179.784q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457v506.999q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H273.782Z"/>
                                </svg>
                                Excluir Conta
                            </button>
                        </div>
                        
                    </form>
                </div>

            </div>

        </>
    );

};

Conta.requiresUser = true;

Conta.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Minha Conta"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Conta;