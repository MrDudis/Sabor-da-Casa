import { useState, useEffect, useContext } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import MiniPersonBox from "@/components/painel/cartoes/MiniPersonBox";

import { MessageModal } from "@/components/elements/modal/Modal";

import Card from "@/models/Card";

import * as usersLib from "@/lib/users";
import * as cardsLib from "@/lib/cards";

import { formatTimestamp } from "@/utils/formatting/timestamp";

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

function Cartao({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [card, setCard] = useState(null);
    const [cardLoadError, setCardLoadError] = useState(null);

    const fetchCard = async () => {

        const id = router.query?.id;

        let response = await cardsLib.get(id);

        if (response.status === 200) {
            setCard(new Card(response.card));
        } else {
            setCardLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchCard(); }, []);

    const [users, setUsers] = useState([]);
    const [usersLoadError, setUsersLoadError] = useState(null);

    const fetchUsers = async () => {

        let response = await usersLib.getAll();

        if (response.status === 200) {
            setTimeout(() => { setUsers(response.users); }, 2000);
        } else {
            setUsersLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { 
        if (!card?.userId) { fetchUsers(); };
    }, [card]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [cardUpdateLoading, setCardUpdateLoading] = useState(false);

    const handleCardUpdateSubmit = async (event) => {
        event.preventDefault();

        closeModal();

        setCardUpdateLoading(true);

        let response = await cardsLib.update(card?.id, selectedUser);

        if (response.status === 200) {

            setTimeout(() => {

                setCard(new Card(response.card));

                if (selectedUser == null) {
                    showModal(
                        <MessageModal
                            icon="success" title="Usuário Desvinculado" message="O usuário foi desvinculado com successo."
                            buttons={[ { label: "Fechar", action: closeModal } ]}
                        ></MessageModal>
                    );
                } else {
                    showModal(
                        <MessageModal
                            icon="success" title="Usuário Vinculado" message="O usuário foi vinculado com successo."
                            buttons={[ { label: "Fechar", action: closeModal } ]}
                        ></MessageModal>
                    );
                }

                setSelectedUser(null);

            }, 800);
            
        } else {
                
            setTimeout(() => {

                showModal(
                    <MessageModal
                        icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );

            }, 800);
                
        };

        setTimeout(() => setCardUpdateLoading(false), 800);
    };

    const handleCardUnlinkConfirmation = (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Desvincular Cartão?" message="Essa ação irá desvincular este cartão com o usuário que ele está vinculado. Deseja continuar?"
                buttons={[ { label: "Desvincular", action: handleCardUpdateSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    const [cardDeleteLoading, setCardDeleteLoading] = useState(false);

    const handleCardDeleteSubmit = async (event) => {
        closeModal();

        setCardDeleteLoading(true);

        let response = await cardsLib.deleteCard(card?.id);

        if (response.status === 200) {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Cartão Apagado" message="O cartão foi apagado com successo."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                
                router.push("/painel/cartoes")
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

        setTimeout(() => setCardDeleteLoading(false), 500);
    };

    const handleCardDeleteConfirmation = async (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Apagar Cartão?" message="Tem certeza que deseja apagar este cartão? Essa ação não pode ser desfeita."
                buttons={[ { label: "Apagar", action: handleCardDeleteSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    if (!card) {
        if (cardLoadError) {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-black slide-up-fade-in opacity-0">
                        <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                    </svg>
                    <div className="flex flex-col text-center gap-1">
                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Cartão.</p>
                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{cardLoadError}</p>
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
                <title>Painel | Cartão | Sabor da Casa</title>
                <meta property="og:title" content={`Painel | Cartão | Sabor da Casa`} key="title" />
                <meta name="og:description" content="Painel para gerenciamento de cartão do Restaurante Sabor da Casa." />
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
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Cartão {card?.id ?? router?.query?.id}</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/cartoes" className="hover:font-bold">Cartões</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Cartão {card?.id ?? router?.query?.id}</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <div className="w-full xl:w-[886px] flex flex-col gap-6">

                    <div className="w-full xl:w-[886px] flex flex-col gap-6">

                        <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-466.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v253.261q-38.522-26.479-85.37-22.892-46.848 3.587-80.935 37.674L606.479-318.305l-14.739-14.304Q553.349-371 499.827-371.065q-53.522-.065-91.914 38.326-39.391 38.826-39.391 92.631 0 53.804 38.391 92.196l7.131 7.13H166.783Zm0-500.914v160h626.434v-160H166.783Zm439.696 436.391 182.869-182.869q14.826-14.826 36.13-14.609 21.305.218 36.131 15.044 14.392 14.826 14.609 35.913.217 21.088-14.609 35.914L644.088-98.391q-15.957 15.957-37.609 15.957-21.653 0-37.609-15.957L463.913-203.912q-14.391-14.392-14.608-35.696-.218-21.305 14.608-36.131 14.392-14.391 35.697-14.109 21.304.283 36.13 14.674l70.739 69.869Z"/>
                            </svg>
                            <h1 className="font-lgc text-2xl font-bold">Informações do Cartão</h1>
                        </div>

                        {
                            card?.userId ? (
                                <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M480-489.609q-74.479 0-126.849-52.37-52.369-52.37-52.369-126.849 0-74.478 52.369-126.565 52.37-52.088 126.849-52.088 74.479 0 126.849 52.088 52.369 52.087 52.369 126.565 0 74.479-52.369 126.849-52.37 52.37-126.849 52.37ZM246.783-131.172q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-26.347q0-39.088 20.326-72.109 20.326-33.022 54.413-50.283 63.696-31.566 129.957-47.631T480-449.609q69.391 0 135.652 15.782 66.261 15.783 128.827 47.348 34.087 17.261 54.413 50.001 20.326 32.739 20.326 72.957v26.347q0 44.305-30.848 75.153-30.848 30.849-75.153 30.849H246.783Z"/>
                                    </svg>
                                    <p className="font-lgc text-lg">Vinculado com <span className="font-bold">{card.user?.name}</span>.</p>
                                </div>
                            ) : (
                                <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M480-271.521q20.603 0 34.541-13.938 13.938-13.938 13.938-34.541v-151.521q0-20.604-13.938-34.541Q500.603-520 480-520q-20.603 0-34.541 13.938-13.938 13.937-13.938 34.541V-320q0 20.603 13.938 34.541 13.938 13.938 34.541 13.938Zm0-317.174q21.805 0 36.555-14.75T531.305-640q0-21.805-14.75-36.555T480-691.305q-21.805 0-36.555 14.75T428.695-640q0 21.805 14.75 36.555T480-588.695Zm0 527.913q-87.522 0-163.906-32.96-76.385-32.96-132.888-89.464-56.504-56.503-89.464-132.888Q60.782-392.478 60.782-480t32.96-163.906q32.96-76.385 89.464-132.888 56.503-56.504 132.888-89.464 76.384-32.96 163.906-32.96t163.906 32.96q76.385 32.96 132.888 89.464 56.504 56.503 89.464 132.888 32.96 76.384 32.96 163.906t-32.96 163.906q-32.96 76.385-89.464 132.888-56.503 56.504-132.888 89.464Q567.522-60.782 480-60.782Z"/>
                                    </svg>
                                    <p className="font-lgc text-lg">Este cartão não está vinculado com ninguém.</p>
                                </div>
                            )
                        }

                        <div className="w-full flex flex-col xl:flex-row items-center gap-6">

                            <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                    <path d="M206.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-546.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848H240v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.739 13.478q13.479 13.478 13.479 32.739v33.783h293.998v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.74 13.478Q720-872.262 720-853.001v33.783h33.217q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v546.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-106.001h546.434V-560H206.783v393.217ZM480-395.478q-18.922 0-31.722-12.8T435.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T480-395.478Zm-160 0q-18.922 0-31.722-12.8T275.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T320-395.478Zm320 0q-18.13 0-31.326-12.8-13.196-12.8-13.196-31.722t13.196-31.722q13.196-12.8 31.609-12.8 18.413 0 31.326 12.8T684.522-440q0 18.922-12.8 31.722T640-395.478Zm-160 160q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T480-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm-160 0q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T320-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm320 0q-18.13 0-31.326-13.196-13.196-13.196-13.196-31.609 0-18.413 13.196-31.326t31.609-12.913q18.413 0 31.326 12.8T684.522-280q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Z"/>
                                </svg>
                                <div className="w-full flex flex-col items-start justify-center">
                                    <p className="font-lgc text-lg font-bold">Registrado em</p>
                                    <p className="font-lgc text-lg">{formatTimestamp(card?.createdAt)}</p>
                                </div>
                            </div>

                            <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                    <path d="M206.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-546.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848H240v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.739 13.478q13.479 13.478 13.479 32.739v33.783h293.998v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.74 13.478Q720-872.262 720-853.001v33.783h33.217q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v546.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-106.001h546.434V-560H206.783v393.217ZM480-395.478q-18.922 0-31.722-12.8T435.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T480-395.478Zm-160 0q-18.922 0-31.722-12.8T275.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T320-395.478Zm320 0q-18.13 0-31.326-12.8-13.196-12.8-13.196-31.722t13.196-31.722q13.196-12.8 31.609-12.8 18.413 0 31.326 12.8T684.522-440q0 18.922-12.8 31.722T640-395.478Zm-160 160q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T480-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm-160 0q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T320-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm320 0q-18.13 0-31.326-13.196-13.196-13.196-13.196-31.609 0-18.413 13.196-31.326t31.609-12.913q18.413 0 31.326 12.8T684.522-280q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Z"/>
                                </svg>
                                <div className="w-full flex flex-col items-start justify-center">
                                    <p className="font-lgc text-lg font-bold">Última Edição em</p>
                                    <p className="font-lgc text-lg">{formatTimestamp(card?.updatedAt)}</p>
                                </div>
                            </div>

                        </div>

                        {
                            card?.userId ? (
                                <div className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>
                            
                                    <div className="w-full xl:w-[65%] flex flex-col justify-center items-start gap-2">
                                        <div className="w-full flex flex-row justify-start items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                                <path d="m638.087-435.478-88.478-89.044h88.478q18.696 0 31.326 12.913 12.631 12.913 12.631 31.609t-12.631 31.609q-12.63 12.913-31.326 12.913ZM781.87-291.26l-78.653-79.523q37.87-10.435 61.391-40.522Q788.13-441.391 788.13-480q0-47.174-33.022-80.195-33.021-33.022-79.63-33.022h-99.086q-22.087 0-37.544-15.457-15.457-15.456-15.457-37.544 0-22.087 15.457-37.544 15.457-15.456 37.544-15.456h98.521q90.913 0 155.066 63.717Q894.131-571.783 894.131-480q0 59.826-30.848 111.718-30.848 51.891-81.413 77.022ZM748.738-87.392 80.608-754.956q-12.695-12.696-12.695-30.826 0-18.131 12.696-30.827 12.695-12.695 31.108-12.695t31.109 12.695l668.13 667.565q12.696 12.696 12.696 30.826 0 18.131-12.696 30.827-12.696 12.695-31.109 12.695-18.413 0-31.109-12.695Zm-365.13-173.39h-98.521q-90.913 0-155.066-64.152Q65.869-389.087 65.869-480q0-71.13 41.087-127.457 41.087-56.326 104.956-78.978l93.218 93.218h-20.043q-47.174 0-80.195 33.022Q171.87-527.174 171.87-480q0 47.174 33.022 80.195 33.021 33.022 80.195 33.022h98.521q22.087 0 37.544 15.457 15.457 15.456 15.457 37.544 0 22.087-15.457 37.544-15.457 15.456-37.544 15.456Zm79.262-174.696H322.478q-18.696 0-31.609-12.913T277.956-480q0-18.696 12.913-31.609t31.609-12.913h52.348l88.044 89.044Z"/>
                                            </svg>
                                            <h1 className="font-lgc font-bold text-lg">Desvincular Cartão</h1>
                                        </div>

                                        <p className="font-lgc text-[17px]">Desvincula o cartão do usuário vinculado atualmente ({card?.user?.name}), você poderá vincular com outra pessoa por aqui.</p>
                                    </div>

                                    <div className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                                        <button onClick={handleCardUnlinkConfirmation} disabled={cardUpdateLoading} className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                            { cardUpdateLoading ? (
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                                    <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                                    <path d="m638.087-435.478-88.478-89.044h88.478q18.696 0 31.326 12.913 12.631 12.913 12.631 31.609t-12.631 31.609q-12.63 12.913-31.326 12.913ZM781.87-291.26l-78.653-79.523q37.87-10.435 61.391-40.522Q788.13-441.391 788.13-480q0-47.174-33.022-80.195-33.021-33.022-79.63-33.022h-99.086q-22.087 0-37.544-15.457-15.457-15.456-15.457-37.544 0-22.087 15.457-37.544 15.457-15.456 37.544-15.456h98.521q90.913 0 155.066 63.717Q894.131-571.783 894.131-480q0 59.826-30.848 111.718-30.848 51.891-81.413 77.022ZM748.738-87.392 80.608-754.956q-12.695-12.696-12.695-30.826 0-18.131 12.696-30.827 12.695-12.695 31.108-12.695t31.109 12.695l668.13 667.565q12.696 12.696 12.696 30.826 0 18.131-12.696 30.827-12.696 12.695-31.109 12.695-18.413 0-31.109-12.695Zm-365.13-173.39h-98.521q-90.913 0-155.066-64.152Q65.869-389.087 65.869-480q0-71.13 41.087-127.457 41.087-56.326 104.956-78.978l93.218 93.218h-20.043q-47.174 0-80.195 33.022Q171.87-527.174 171.87-480q0 47.174 33.022 80.195 33.021 33.022 80.195 33.022h98.521q22.087 0 37.544 15.457 15.457 15.456 15.457 37.544 0 22.087-15.457 37.544-15.457 15.456-37.544 15.456Zm79.262-174.696H322.478q-18.696 0-31.609-12.913T277.956-480q0-18.696 12.913-31.609t31.609-12.913h52.348l88.044 89.044Z"/>
                                                </svg>
                                            ) }
                                            { cardUpdateLoading ? "Desvinculando..." : "Desvincular" }
                                        </button>
                                    </div>
                                    
                                </div>
                            ) : (
                                <div className="w-full flex flex-col gap-5 px-6 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>

                                    <div className="w-full flex flex-row items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                            <path d="M280-260.782q-90.976 0-155.097-64.108-64.121-64.109-64.121-155.066 0-90.957 64.121-155.11Q189.024-699.218 280-699.218h98.521q22.087 0 37.544 15.456 15.456 15.457 15.456 37.544 0 22.088-15.456 37.544-15.457 15.457-37.544 15.457H280q-47.174 0-80.195 33.022-33.022 33.021-33.022 80.195 0 47.174 33.022 80.195 33.021 33.022 80.195 33.022h98.521q22.087 0 37.544 15.457 15.456 15.456 15.456 37.544 0 22.087-15.456 37.544-15.457 15.456-37.544 15.456H280Zm70.391-174.696q-18.922 0-31.722-12.8T305.869-480q0-18.922 12.8-31.722t31.722-12.8h259.218q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722t-31.722 12.8H350.391ZM899.218-480H793.217q0-47.174-33.022-80.195-33.021-33.022-80.195-33.022h-98.521q-22.087 0-37.544-15.457-15.456-15.456-15.456-37.544 0-22.087 15.456-37.544 15.457-15.456 37.544-15.456H680q90.976 0 155.097 64.121Q899.218-570.976 899.218-480ZM734.696-140.782q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722v-71.521h-70.956q-18.921 0-31.722-12.64-12.8-12.641-12.8-31.327 0-18.685 12.8-31.598 12.801-12.914 31.722-12.914h70.956v-71.521q0-18.682 12.8-31.319 12.801-12.638 31.722-12.638 18.922 0 31.722 12.638 12.8 12.637 12.8 31.319v71.521h70.956q18.922 0 31.722 12.8 12.8 12.801 12.8 31.722 0 18.682-12.8 31.32-12.8 12.637-31.722 12.637h-70.956v71.521q0 18.922-12.8 31.722t-31.722 12.8Z"/>
                                        </svg>
                                        <h1 className="font-lgc font-bold text-xl">Vincular Usuário</h1>
                                    </div>

                                    <div className="w-full flex flex-col justify-center items-start gap-6">

                                        <div className="w-full flex flex-row items-center gap-2 bg-yellow-200 rounded-md px-3 py-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="w-[28px]">
                                                <path d="m858.391 455.131-66.304-30.652 66.269-30.123 30.123-66.269 30.652 66.304 65.74 30.088-65.74 30.652-30.652 65.74-30.088-65.74ZM723.13 244.391l-99.522-45.914 99.522-45.348 45.349-99.522 45.913 99.522 99.523 45.348-99.382 46.055-46.054 99.381-45.349-99.522ZM342.477 1010.48q-35.798 0-61.29-27.174-25.493-27.174-25.493-66.392h174.132q0 39.218-25.659 66.392-25.659 27.174-61.69 27.174ZM221.912 872.392q-18.922 0-31.722-12.8t-12.8-31.722q0-18.681 12.8-31.319 12.8-12.638 31.722-12.638h241.696q18.922 0 31.722 12.641 12.8 12.64 12.8 31.326t-12.8 31.599q-12.8 12.913-31.722 12.913H221.912ZM187.39 739.391Q113.303 695 68.564 621.195q-44.74-73.804-44.74-161.022 0-132.772 92.97-225.713 92.969-92.94 225.783-92.94t225.966 92.94q93.153 92.941 93.153 225.713 0 87.783-44.74 161.305Q572.217 695 498.13 739.391H187.39Z"/>
                                            </svg>
                                            <p className="font-lgc text-black">Você também pode vincular um usuário a um cartão pela página do usuário.</p>
                                        </div>

                                        <div className="w-full h-96 bg-neutral-200 rounded-md overflow-y-scroll">

                                            {
                                                users.length > 0 ? (

                                                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                                                        {
                                                            users.map((user, index) => {
                                                                return <MiniPersonBox key={index} user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                                                            })
                                                        }
                                                    </div>

                                                ) : users.length == 0 && usersLoadError == null ? (

                                                    <div className="w-full h-full flex justify-center items-center">
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                                                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                                        </svg>
                                                    </div>

                                                ) : users.length == 0 && usersLoadError != null ? (

                                                    <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" className="fill-black slide-up-fade-in opacity-0">
                                                            <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                                                        </svg>
                                                        <div className="flex flex-col text-center gap-1">
                                                            <p className="text-black font-lgc font-bold text-xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Usuários.</p>
                                                            <p className="text-black font-lgc slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{usersLoadError}</p>
                                                        </div>
                                                    </div>

                                                ) : null
                                            }

                                        </div>

                                        <div className="w-full flex flex-row justify-end items-center mt-2">
                                            <button onClick={handleCardUpdateSubmit} disabled={cardUpdateLoading || !selectedUser} className={`w-full xl:w-56 flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 ${!selectedUser ? "disabled:bg-neutral-300 disabled:cursor-not-allowed" : "disabled:bg-red-600 disabled:cursor-default"} transition-all`} type="submit">
                                                { cardUpdateLoading ? (
                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white fast-fade-in">
                                                        <path d="M206.783 955.218q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153V302.783q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h437.391q21.087 0 40.392 7.978 19.304 7.978 34.261 22.935l109.478 109.478q14.957 14.957 22.935 34.261 7.978 19.305 7.978 40.392v437.391q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783ZM480 809.217q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM299.784 502.783h253.998q22.088 0 37.544-15.457 15.457-15.456 15.457-37.544v-53.998q0-22.088-15.457-37.544-15.456-15.457-37.544-15.457H299.784q-22.088 0-37.544 15.457-15.457 15.456-15.457 37.544v53.998q0 22.088 15.457 37.544 15.456 15.457 37.544 15.457Z"/>
                                                    </svg>
                                                ) }
                                                { cardUpdateLoading ? "Salvando..." : "Salvar Alterações" }
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            )
                        }

                        <form onSubmit={handleCardDeleteConfirmation} className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                            
                            <div className="w-full xl:w-[65%] flex flex-col justify-center items-start gap-2">
                                <div className="w-full flex flex-row justify-start items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="m890.218-204.13-278.13-277.566h181.129v-160H452.088L275.13-819.218h518.087q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v466.434q0 11.696-2 22.326-2 10.631-7 20.327ZM166.783-481.696h194.695l-160-160h-34.695v160Zm630 433.74-93.826-92.826H166.783q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-466.434q0-39.783 26.043-69.218 26.044-29.435 64.131-35.088l104.306 104.306H129.957L54-789.174q-13.13-13.13-12.848-31.326.283-18.196 13.413-31.326 13.13-13.131 31.326-13.131 18.196 0 31.327 13.131l742.217 742.217q13.131 13.131 13.131 30.827 0 17.695-13.131 30.826-13.13 13.13-31.326 13.13-18.196 0-31.326-13.13Z"/>
                                    </svg>
                                    <h1 className="font-lgc font-bold text-lg">Apagar Cartão</h1>
                                </div>

                                <p className="font-lgc text-[17px]">Apaga o cartão, desvincula ele de quem está usando, você pode registra-lo novamento a qualquer momento.</p>
                            </div>

                            <div className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                                <button disabled={cardDeleteLoading} className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                    { cardDeleteLoading ? (
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                            <path d="m480-394.391 69.217 69.217q14.261 13.261 33.305 13.261 19.043 0 32.304-13.261 14.261-14.261 14.261-33.304 0-19.044-14.261-32.305L545.609-460l69.217-69.217q14.261-14.261 14.261-33.305 0-19.043-14.261-32.304-12.696-13.696-32.022-13.696t-33.022 13.696L480-525.609l-69.217-69.217q-13.261-14.261-32.305-14.261-19.043 0-33.304 14.261-12.696 12.696-12.696 32.022t12.696 33.022L414.391-460l-69.217 69.217q-13.261 13.261-13.261 32.305 0 19.043 13.261 33.304 14.261 13.261 33.304 13.261 19.044 0 32.305-13.261L480-394.391ZM273.782-100.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-506.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h179.784q0-22.087 15.456-37.544 15.457-15.456 37.544-15.456h158.87q22.087 0 37.544 15.456 15.456 15.457 15.456 37.544h179.784q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457v506.999q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H273.782Z"/>
                                        </svg>
                                    ) }
                                    { cardDeleteLoading ? "Apagando..." : "Apagar" }
                                </button>
                            </div>
                            
                        </form>

                    </div>

                </div>

            </div>   

        </>
    );

};

Cartao.requiresUser = true;

Cartao.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Cartões"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Cartao;