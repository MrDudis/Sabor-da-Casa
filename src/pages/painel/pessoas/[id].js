import { useState, useEffect, useContext } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import { BasicInput, BasicSelect } from "@/components/elements/input/Input";
import { MessageModal } from "@/components/elements/modal/Modal";

import Card from "@/models/Card";
import User, { Gender, Role, roleNames } from "@/models/User";

import * as usersLib from "@/lib/users";
import * as cardsLib from "@/lib/cards";

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

function Pessoa({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { me } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [user, setUser] = useState(null);
    const [userLoadError, setUserLoadError] = useState(null);

    const fetchUser = async () => {

        const id = router.query?.id;

        let response = await usersLib.get(id);

        if (response.status === 200) {
            setUser(new User(response.user));
        } else {
            setUserLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchUser(); }, []);

    const [cards, setCards] = useState([]);
    const [cardsLoadError, setCardsLoadError] = useState(null);

    const fetchCards = async () => {

        const id = router.query?.id;

        let response = await usersLib.getCards(id);

        if (response.status === 200) {
            setCards(response.cards);
        } else {
            setCardsLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchCards(); }, []);

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
            email: formData.get("email"),
            cpf: parseInputCPF(formData.get("cpf")),
            phone: parseInputPhone(formData.get("phone")),
            role: formData.get("role"),
            birthdate: parseInputDate(formData.get("birthdate")),
            gender: formData.get("gender")
        };

        let response = await usersLib.update(user?.id, newUser);

        if (response.status === 200) {
            setUserUpdateErrors({});

            setUser(response.user);
            
            showModal(
                <MessageModal 
                    icon="success" title="Successo!" message="Suas alterações foram salvas no usuário com successo."
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

        setTimeout(() => setUserUpdateLoading(false), 500);
    };

    const [userDeleteLoading, setUserDeleteLoading] = useState(false);

    const handleUserDeleteSubmit = async (event) => {
        closeModal();

        setUserDeleteLoading(true);

        let response = await usersLib.deleteUser(user.id);

        if (response.status === 200) {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Usuário Excluído" message="O usuário foi excluído com successo."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                
                router.push("/painel/pessoas")
            }, 500);
            
        } else {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
            }, 500);
            
        };

        setTimeout(() => setUserDeleteLoading(false), 500);
    };

    const handleUserDeleteConfirmation = async (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Excluir Usuário?" message="Tem certeza que deseja excluir esse usuário? Essa ação não pode ser desfeita."
                buttons={[ { label: "Excluir", action: handleUserDeleteSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    const [readerActive, setReaderActive] = useState(false);

    useEffect(() => {

        if (!socket) { return; };
        if (!readerActive) { return; }

        const Action = async (data) => {
            if (!data?.cardId) { return; };

            const cardId = data.cardId;

            const response = await cardsLib.update(cardId, user?.id);

            if (response.status === 200) {

                let currentCards = cards.filter(card => card.id !== response.card.id);
                currentCards.push(response.card);

                currentCards.sort((a, b) => { return a.id - b.id; });

                setCards(currentCards);
    
            } else {

                showModal(
                    <MessageModal 
                        icon="error" title="Falha ao Vincular Cartão" message={response?.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                
            };
        };

        socket.on("ACTION", Action);

        return () => {
            socket.off("ACTION", Action);
        };

    }, [socket, readerActive, cards]);

    if (!user) {
        if (userLoadError) {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-black slide-up-fade-in opacity-0">
                        <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                    </svg>
                    <div className="flex flex-col text-center gap-1">
                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Usuário.</p>
                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{userLoadError}</p>
                    </div>
                    <div onClick={() => router.back()} className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                        </svg>
                        <p className="font-lgc text-lg">Voltar</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="w-full h-full flex justify-center items-center">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                    </svg>
                </div>
            );
        };
    };

    return (
        <>

            <Head>
                <title>Painel | {user?.name} | Sabor da Casa</title>
                <meta property="og:title" content={`Painel | ${user?.name} | Sabor da Casa`} key="title" />
                <meta name="og:description" content="Painel para gerenciamento de usúario do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start gap-6 border-b border-neutral-800 scale-right-to-left">
                <div onClick={() => router.back()} className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                    </svg>
                    <p className="font-lgc text-lg">Voltar</p>
                </div>
                
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{user?.name}</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/pessoas" className="hover:font-bold">Pessoas</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">{user?.name || router.query?.id}</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <div className="w-full md:w-[60%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="m620-283.609 191.782-191.782q12.435-12.435 31.348-12.435 18.913 0 31.348 12.435 12.435 12.434 12.316 31.228-.12 18.793-12.555 31.228L652.065-190.522q-13.761 13.674-32.108 13.674-18.348 0-32.022-13.674L477.522-300.935q-12.435-12.435-12.435-31.228 0-18.794 12.435-31.228 12.435-12.435 31.348-12.435 18.913 0 31.348 12.435L620-283.609Zm-417.13 171.74q-37.538 0-64.269-26.732-26.732-26.731-26.732-64.269v-554.26q0-37.538 26.732-64.269 26.731-26.732 64.269-26.732h157.912q12.435-35.717 45.936-58.456 33.5-22.739 73.282-22.739 41.196 0 74.37 22.739 33.174 22.739 45.848 58.456H757.13q37.538 0 64.269 26.732 26.732 26.731 26.732 64.269v151.63q0 19.152-13.174 32.326T802.63-560q-19.152 0-32.326-13.174T757.13-605.5v-151.63h-78.326v78.326q0 19.152-13.174 32.326t-32.326 13.174H326.696q-19.152 0-32.326-13.174t-13.174-32.326v-78.326H202.87v554.26H394.5q19.152 0 32.326 13.174T440-157.37q0 19.153-13.174 32.327T394.5-111.869H202.87ZM480-760.717q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Informações Pessoais</h1>
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
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M202.87-70.913q-37.783 0-64.392-26.609-26.609-26.608-26.609-64.391v-448.652q-17-11.643-28.5-29.637t-11.5-44.102V-797.13q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v112.826q0 26.108-11.5 44.102-11.5 17.994-28.5 29.637v448.652q0 37.783-26.609 64.391-26.609 26.61-64.392 26.61H202.87Zm594.26-613.391V-797.13H162.87v112.826h634.26ZM397.37-397.13h165.26q17.712 0 29.693-11.983 11.981-11.982 11.981-29.696 0-17.713-11.981-29.811-11.981-12.097-29.693-12.097H397.37q-17.712 0-29.693 12.05-11.981 12.05-11.981 29.863 0 17.711 11.981 29.692 11.981 11.982 29.693 11.982Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Cargo</p>
                                <p className="font-lgc text-lg">{roleNames[user?.role]}</p>
                            </div>
                        </div>

                    </div>

                    <form onSubmit={handleUserUpdateSubmit} className="w-full flex flex-col gap-5 px-6 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>

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
                                <p className="font-lgc text-black">{formatTimestamp(user?.updatedAt)}.</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 bg-yellow-200 rounded-md px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="w-[28px]">
                                <path d="m858.391 455.131-66.304-30.652 66.269-30.123 30.123-66.269 30.652 66.304 65.74 30.088-65.74 30.652-30.652 65.74-30.088-65.74ZM723.13 244.391l-99.522-45.914 99.522-45.348 45.349-99.522 45.913 99.522 99.523 45.348-99.382 46.055-46.054 99.381-45.349-99.522ZM342.477 1010.48q-35.798 0-61.29-27.174-25.493-27.174-25.493-66.392h174.132q0 39.218-25.659 66.392-25.659 27.174-61.69 27.174ZM221.912 872.392q-18.922 0-31.722-12.8t-12.8-31.722q0-18.681 12.8-31.319 12.8-12.638 31.722-12.638h241.696q18.922 0 31.722 12.641 12.8 12.64 12.8 31.326t-12.8 31.599q-12.8 12.913-31.722 12.913H221.912ZM187.39 739.391Q113.303 695 68.564 621.195q-44.74-73.804-44.74-161.022 0-132.772 92.97-225.713 92.969-92.94 225.783-92.94t225.966 92.94q93.153 92.941 93.153 225.713 0 87.783-44.74 161.305Q572.217 695 498.13 739.391H187.39Z"/>
                            </svg>
                            <p className="font-lgc text-black">Não esqueça de salvar as informações quando terminar a edição.</p>
                        </div>
                        
                        <div className="flex flex-col xl:flex-row gap-5">
                            <BasicInput name="name" label="Nome Completo" type="text" placeholder={user?.name} defaultValue={user?.name} onChange={handleUserUpdateInputChange} error={userUpdateErrors?.name} ></BasicInput>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-5">
                            <BasicInput name="cpf" label="CPF" type="text" placeholder={formatCPF(user?.cpf)} defaultValue={formatCPF(user?.cpf)} onChange={handleUserUpdateInputChange} error={userUpdateErrors?.cpf} ></BasicInput>
                            <BasicInput name="email" label="E-mail" type="text" placeholder={user?.email} defaultValue={user?.email} onChange={handleUserUpdateInputChange} error={userUpdateErrors?.email} ></BasicInput>
                        </div>

                        <div className="flex flex-col xl:flex-row items-start gap-5">
                            <BasicInput name="phone" label="Telefone" type="text" placeholder={formatPhone(user?.phone)} defaultValue={formatPhone(user?.phone)} onChange={handleUserUpdateInputChange} error={userUpdateErrors?.phone} ></BasicInput>
                            
                            <BasicSelect name="role" label="Cargo"
                                options={[
                                    { value: Role.CUSTOMER, label: "Cliente" },
                                    { value: Role.EMPLOYEE, label: "Funcionário" },
                                    { value: Role.CASHIER, label: "Caixa" },
                                    { value: Role.MANAGER, label: "Gerente" },
                                    { value: Role.ADMIN, label: "Administrador" }
                                ]}
                                defaultValue={user?.role}
                            ></BasicSelect>
                        </div>

                        <div className="flex flex-col xl:flex-row items-start gap-5">
                            <BasicInput name="birthdate" label="Data de Nascimento" type="text" placeholder={formatDate(user?.birthdate)} defaultValue={formatDate(user?.birthdate)} onChange={handleUserUpdateInputChange} error={userUpdateErrors?.birthdate} ></BasicInput>

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

                    <form onSubmit={handleUserDeleteConfirmation} className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        
                        <div className="w-full xl:w-[65%] flex flex-col justify-center items-start gap-2">
                            <div className="w-full flex flex-row justify-start items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M647.174-229q-17.813 0-29.863-12.05t-12.05-29.863q0-17.711 12.05-29.693 12.05-11.981 29.863-11.981h80q17.813 0 29.863 11.983 12.05 11.982 12.05 29.695 0 17.714-12.05 29.811Q744.987-229 727.174-229h-80Zm0-327.413q-17.813 0-29.863-11.982-12.05-11.983-12.05-29.696t12.05-29.811Q629.361-640 647.174-640h200q17.813 0 29.863 12.05t12.05 29.863q0 17.712-12.05 29.693-12.05 11.981-29.863 11.981h-200Zm0 163.826q-17.813 0-29.863-12.05t-12.05-29.863q0-17.813 12.05-29.863t29.863-12.05h160q17.813 0 29.863 12.05t12.05 29.863q0 17.813-12.05 29.863t-29.863 12.05h-160ZM201.913-191.869q-37.783 0-64.391-26.609-26.609-26.609-26.609-64.392v-358.326q-17.24-1.434-28.62-14.011-11.38-12.576-11.38-30.293 0-19.152 13.174-32.326T116.413-731h118.565v-16.413q.718-18.435 13.652-31.011Q261.565-791 280.239-791h77.848q18.674 0 31.609 12.576 12.934 12.576 13.652 31.011V-731h118.326q19.152 0 32.326 13.174t13.174 32.326q0 17.717-11.38 30.293-11.381 12.577-28.62 14.011v358.326q0 37.783-26.609 64.392-26.608 26.609-64.391 26.609H201.913Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-lg">Excluir Usuário</h1>
                            </div>

                            <p className="font-lgc text-[17px]">Deleta o usuário, essa ação é irreversível.</p>
                        </div>

                        <div className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                            <button disabled={userDeleteLoading} className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                { userDeleteLoading ? (
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                        <path d="m480-394.391 69.217 69.217q14.261 13.261 33.305 13.261 19.043 0 32.304-13.261 14.261-14.261 14.261-33.304 0-19.044-14.261-32.305L545.609-460l69.217-69.217q14.261-14.261 14.261-33.305 0-19.043-14.261-32.304-12.696-13.696-32.022-13.696t-33.022 13.696L480-525.609l-69.217-69.217q-13.261-14.261-32.305-14.261-19.043 0-33.304 14.261-12.696 12.696-12.696 32.022t12.696 33.022L414.391-460l-69.217 69.217q-13.261 13.261-13.261 32.305 0 19.043 13.261 33.304 14.261 13.261 33.304 13.261 19.044 0 32.305-13.261L480-394.391ZM273.782-100.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-506.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h179.784q0-22.087 15.456-37.544 15.457-15.456 37.544-15.456h158.87q22.087 0 37.544 15.456 15.456 15.457 15.456 37.544h179.784q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457v506.999q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H273.782Z"/>
                                    </svg>
                                ) }
                                { userDeleteLoading ? "Excluindo..." : "Excluir" }
                            </button>
                        </div>
                        
                    </form>

                </div>

                <div className="w-full md:w-[40%] md:max-w-md flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-466.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v466.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783Zm0-340.914h626.434v-160H166.783v160Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Cartões</h1>
                    </div>

                    <div className="w-full flex flex-col justify-start items-start p-4 gap-1 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>

                        <h1 className="font-lgc font-bold text-lg">Cartões Vinculados</h1>

                        {
                            cards.length > 0 ? (
                                <div className="w-full flex flex-wrap flex-row justify-start items-start gap-3 mt-1">
                                    { 
                                        cards.map((card, index) => (
                                            <Link href={`/painel/cartoes/${card?.id}`} className="w-fit flex px-3 py-1 bg-neutral-200 border border-neutral-400 cursor-pointer hover:bg-white hover:scale-[102%] hover:shadow-2xl rounded-md transition-all fast-fade-in">
                                                <p className="font-lgc font-bold text-lg">{card?.id}</p>
                                            </Link>
                                        ))
                                    }
                                </div>
                            ) : cards.length == 0 && !cardsLoadError ? (
                                <div className="w-full flex flex-row justify-start items-center gap-3 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M574.696-382.61q17 0 29.5-12.5t12.5-29.5q0-17-12.5-29.5t-29.5-12.5q-17 0-29.5 12.5t-12.5 29.5q0 17 12.5 29.5t29.5 12.5Zm0-118.391q11 0 20.5-7.717t13.196-20.717q3.131-10.305 9.631-19.739 6.5-9.435 18.978-21.913 29.434-29.435 39.717-48.5 10.283-19.065 10.283-42.935 0-46.13-31.218-74.065-31.217-27.935-82.782-27.935-33.566 0-60.283 15t-42.717 42.435q-5.435 10-.718 21 4.718 11 16.718 16 11 5 21.5 1t17.5-14q9-13 21.282-19.218 12.283-6.217 26.718-6.217 24.565 0 39.282 13.217 14.718 13.218 14.718 35.087 0 14-8 26.783-8 12.783-28 32.348-24.478 21.608-33.326 35.674-8.848 14.065-11.413 34.978-1.566 11.434 6.934 20.434 8.5 9 21.5 9ZM339.784-233.782q-44.305 0-75.154-30.848-30.848-30.849-30.848-75.154v-466.434q0-44.305 30.848-75.153 30.849-30.848 75.154-30.848h466.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v466.434q0 44.305-30.848 75.154-30.848 30.848-75.153 30.848H339.784ZM153.782-47.781q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-519.435q0-22.087 15.457-37.544 15.456-15.457 37.544-15.457 22.087 0 37.544 15.457 15.456 15.457 15.456 37.544v519.435h519.435q22.087 0 37.544 15.456 15.457 15.457 15.457 37.544 0 22.088-15.457 37.544-15.457 15.457-37.544 15.457H153.782Z"/>
                                    </svg>
                                    <p className="font-lgc">Nenhum cartão vinculado.</p>
                                </div>
                            ) : cards.length == 0 && cardsLoadError ? (
                                <div className="w-full flex flex-row justify-start items-center gap-3 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                                    </svg>
                                    <div>
                                        <p className="font-lgc font-bold">Não foi possível carregar os cartões.</p>
                                        <p className="font-lgc text-sm">{cardsLoadError}</p>
                                    </div>
                                </div>
                            ) : null
                        }

                    </div>

                    <div className="w-full flex flex-col xl:flex-row justify-start items-center p-4 gap-1 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        
                        <div className="w-full flex flex-col justify-center items-start gap-2">
                            <div className="w-full flex flex-row justify-start items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M280-260.782q-90.976 0-155.097-64.108-64.121-64.109-64.121-155.066 0-90.957 64.121-155.11Q189.024-699.218 280-699.218h98.521q22.087 0 37.544 15.456 15.456 15.457 15.456 37.544 0 22.088-15.456 37.544-15.457 15.457-37.544 15.457H280q-47.174 0-80.195 33.022-33.022 33.021-33.022 80.195 0 47.174 33.022 80.195 33.021 33.022 80.195 33.022h98.521q22.087 0 37.544 15.457 15.456 15.456 15.456 37.544 0 22.087-15.456 37.544-15.457 15.456-37.544 15.456H280Zm70.391-174.696q-18.922 0-31.722-12.8T305.869-480q0-18.922 12.8-31.722t31.722-12.8h259.218q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722t-31.722 12.8H350.391ZM899.218-480H793.217q0-47.174-33.022-80.195-33.021-33.022-80.195-33.022h-98.521q-22.087 0-37.544-15.457-15.456-15.456-15.456-37.544 0-22.087 15.456-37.544 15.457-15.456 37.544-15.456H680q90.976 0 155.097 64.121Q899.218-570.976 899.218-480ZM734.696-140.782q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722v-71.521h-70.956q-18.921 0-31.722-12.64-12.8-12.641-12.8-31.327 0-18.685 12.8-31.598 12.801-12.914 31.722-12.914h70.956v-71.521q0-18.682 12.8-31.319 12.801-12.638 31.722-12.638 18.922 0 31.722 12.638 12.8 12.637 12.8 31.319v71.521h70.956q18.922 0 31.722 12.8 12.8 12.801 12.8 31.722 0 18.682-12.8 31.32-12.8 12.637-31.722 12.637h-70.956v71.521q0 18.922-12.8 31.722t-31.722 12.8Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-lg">Vincular Cartão</h1>
                            </div>

                            <p className="font-lgc text-[17px] pr-6">{readerActive ? "Aproxime um cartão do leitor para vincula-lo a este usuário." : "Ativar o leitor de cartões para vincular um cartão a este usuário."}</p>
                        </div>

                        <div className={`w-full xl:w-40 ${!readerActive ? "flex" : "hidden"} flex-row justify-center items-center mt-2`}>
                            <button onClick={() => { setReaderActive(true); }} className="w-full flex flex-row justify-center items-center gap-2 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-all" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white">
                                    <path d="M410.826-114.781q-11.827-4.13-19.805-13.891t-7.978-24.153v-207.608h-27q-39.783 0-67.805-28.022-28.022-28.022-28.022-67.805v-334.696q0-44.305 30.849-75.153 30.848-30.848 75.153-30.848h230.608q42.74 0 70.153 33.196 27.414 33.196 14.327 72.805l-49.087 151.389h39.348q46.174 0 65.37 37.652 19.196 37.653-8.587 77.827L455.565-130.172q-8.261 11.826-20.587 15.674-12.326 3.848-24.152-.283Z"/>
                                </svg>
                                Ativar
                            </button>
                        </div>

                    </div>

                    <div className={`w-full h-72 ${readerActive ? "flex" : "hidden"} justify-center items-center bg-neutral-100 rounded-md slide-up-fade-in`}>

                        <div className="scanner w-full h-[96%] flex flex-col justify-center items-center text-center gap-2 m-2 rounded-md">

                            <h1 className="font-lgc text-lg font-bold px-6">PASSE UM CARTÃO NO LEITOR</h1>

                            <p className="font-lgc text-lg max-w-lg px-6">Certifique-se que o dispositivo está pareado com você.</p>

                            <div className="mt-4">  
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                                    <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                </svg>
                            </div>

                        </div>

                    </div>

                    <div className={`w-full ${readerActive ? "flex" : "hidden"} flex-col xl:flex-row justify-start items-center p-4 gap-1 bg-neutral-100 rounded-md slide-up-fade-in opacity-0`} style={{ animationDelay: "200ms" }}>
                        
                        <div className="w-full flex flex-col justify-center items-start gap-2">
                            <div className="w-full flex flex-row justify-start items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M663.914-430.435 260.216-834.133v-2.608q6.783-25.087 34.805-42.651 28.022-17.565 71.197-17.565h230.608q42.74 0 70.153 33.196 27.414 33.196 14.327 72.805l-49.087 151.389h39.348q46.174 0 65.37 37.652 19.196 37.653-8.587 77.827l-64.436 93.653ZM812.479-31.26 561.305-282.434l-105.74 152.262q-8.261 11.826-20.587 15.674-12.326 3.848-24.152-.283-11.827-4.13-19.805-13.891t-7.978-24.153v-207.608h-27q-39.783 0-67.805-28.022-28.022-28.022-28.022-67.805v-127.263L31.26-812.479l62.652-62.653 781.22 781.22-62.653 62.652Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-lg">Desativar Leitor</h1>
                            </div>

                            <p className="font-lgc text-[17px] pr-6">Desativa o leitor de cartões, para evitar de vincular outro cartão acidentalmente.</p>
                        </div>

                        <div className="w-full xl:w-48 flex flex-row justify-center items-center mt-2">
                            <button onClick={() => { setReaderActive(false); }} className="w-full flex flex-row justify-center items-center gap-2 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-all" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" className="fill-white">
                                    <path d="M663.914-430.435 260.216-834.133v-2.608q6.783-25.087 34.805-42.651 28.022-17.565 71.197-17.565h230.608q42.74 0 70.153 33.196 27.414 33.196 14.327 72.805l-49.087 151.389h39.348q46.174 0 65.37 37.652 19.196 37.653-8.587 77.827l-64.436 93.653ZM812.479-31.26 561.305-282.434l-105.74 152.262q-8.261 11.826-20.587 15.674-12.326 3.848-24.152-.283-11.827-4.13-19.805-13.891t-7.978-24.153v-207.608h-27q-39.783 0-67.805-28.022-28.022-28.022-28.022-67.805v-127.263L31.26-812.479l62.652-62.653 781.22 781.22-62.653 62.652Z"/>
                                </svg>
                                Desativar
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </>
    );

};

Pessoa.requiresUser = true;

Pessoa.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Pessoas"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Pessoa;