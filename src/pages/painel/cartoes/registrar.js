import { useState, useEffect, useContext, useRef } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import { MessageModal } from "@/components/elements/modal/Modal";

import Card from "@/models/Card";
import { Role } from "@/models/User";

import * as cardsLib from "@/lib/cards";

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

function RegistrarCartao({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    useEffect(() => {
        if (user && user.role > Role.CASHIER) {
            showModal(
                <MessageModal 
                    icon="error" title="Erro" message={"Você não tem permissão para registrar um cartão."}
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
    
            router.push("/painel");
        };
    }, [user]);

    const tips = [
        "Certifique-se de que o dispositivo está pareado com você.",
        "Você pode passar multiplos cartões, e eles serão registrados em sequência.",
        "Se o cartão já estiver registrado, ele será ignorado.",
        "Quando você passar um cartão, as informações acima serão atualizadas automaticamente.",
        "Um ícone de sucesso aparecerá no lugar do de carregamento quando um cartão for registrado.",
        "Você pode clicar na seta do ID do último cartão registrado para ir para a página dele.",
    ];

    const tipBox = useRef(null);
    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        if (!tipBox.current) { return; };

        const interval = setInterval(() => {
            tipBox.current.classList.add("fast-fade-out");

            setTimeout(() => { 
                setCurrentTip((currentTip + 1) % tips.length);

                if (!tipBox.current) { return; }

                tipBox.current.classList.remove("fast-fade-out");
                tipBox.current.classList.add("fast-fade-in");
            }, 600);
        }, 10000);

        return () => clearInterval(interval);

    }, [currentTip]);

    const [registeredCardsCount, setRegisteredCardsCount] = useState(0);
    const incrementRegisteredCards = () => setRegisteredCardsCount(registeredCardsCount + 1);

    const [lastCardId, setLastCardId] = useState(null);

    const boxTitleRef = useRef(null);
    const boxIconRef = useRef(null);

    const [boxIcon, setBoxIcon] = useState("loading");

    const changeBoxIcon = (target) => {

        boxIconRef.current.classList.remove("slide-up-fade-in");
        boxIconRef.current.classList.add("fast-fade-out");

        boxTitleRef.current.classList.remove("smooth-slide-down-fade-in");
        boxTitleRef.current.classList.add("fast-fade-out");

        setTimeout(() => {
            setBoxIcon(target);

            if (!boxIconRef.current || !boxTitleRef.current) { return; };

            boxIconRef.current.classList.remove("fast-fade-out");
            boxIconRef.current.classList.add("slide-up-fade-in");

            boxTitleRef.current.classList.remove("fast-fade-out");
            boxTitleRef.current.classList.add("smooth-slide-down-fade-in");
        }, 400);

    };

    useEffect(() => {
        if (boxIcon != "success") { return; }

        let timeout = setTimeout(() => {
            changeBoxIcon("loading");
        }, 5000);

        return () => { clearTimeout(timeout); };

    }, [boxIcon]);

    useEffect(() => {
        if (!socket) { return; }

        const Action = async (data) => {
            if (!data?.cardId) { return; };

            const cardId = data.cardId;

            const response = await cardsLib.register(new Card({ cardId }));

            if (response.status === 200) {

                changeBoxIcon("success");
                incrementRegisteredCards();
                setLastCardId(cardId);
    
            } else {

                if (response.code != "ALREADY_REGISTERED") {
                    showModal(
                        <MessageModal 
                            icon="error" title="Falha ao Registrar Cartão" message={response?.message ?? "Erro desconhecido."}
                            buttons={[ { label: "Fechar", action: closeModal } ]}
                        ></MessageModal>
                    );
                }
                
            };

        };

        socket.on("ACTION", Action);

        return () => {
            socket.off("ACTION", Action);
        };

    }, [socket, registeredCardsCount]);

    return (
        <>

            <Head>
                <title>Painel | Registrar Cartão | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Registrar Cartão | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel para registrar cartões no Restaurante Sabor da Casa." />
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
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Registrar Cartões</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/cartoes" className="hover:font-bold">Cartões</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Registrar Cartões</p>
                    </p>
                </div>
            </div>

            <div className="w-full xl:w-[886px] flex flex-col justify-start items-start gap-6 py-6">

                <div className="w-full max-w-2xl flex flex-row items-center gap-3 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M280-302.477v26.999q0 20.391 14.326 34.435 14.326 14.044 34.718 14.044 20.391 0 34.435-14.327 14.044-14.326 14.044-34.717v-26.434h26.999q20.391 0 34.435-14.327 14.044-14.326 14.044-34.717 0-20.392-14.044-34.435Q424.913-400 404.522-400h-26.999v-26.999q0-20.392-14.044-34.435-14.044-14.044-34.435-14.044-20.392 0-34.718 14.044Q280-447.391 280-426.999V-400h-26.999q-20.392 0-34.435 14.044-14.044 14.043-14.044 34.435 0 20.391 14.326 34.717 14.326 14.327 34.718 14.327H280Zm275.087-67.349h159.086q17.522 0 29.414-12.174 11.891-12.174 11.891-29.696 0-17.522-11.891-29.413-11.892-11.892-29.414-11.892H554.522q-17.522 0-29.413 11.892-11.892 11.891-11.892 29.413T525.391-382q12.174 12.174 29.696 12.174Zm-.565 131.305h79.651q17.522 0 29.414-11.891 11.891-11.892 11.891-29.414 0-17.522-11.891-29.413-11.892-11.891-29.414-11.891h-79.651q-17.522 0-29.413 11.891-11.892 11.891-11.892 29.413t11.892 29.414q11.891 11.891 29.413 11.891ZM166.783-60.781q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-426.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h173.999v-106.434q0-40.914 26.326-67.24 26.326-26.326 67.24-26.326h91.304q40.914 0 67.24 26.326 26.326 26.326 26.326 67.24v106.434h173.999q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v426.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783ZM441.13-613.567h77.74V-798.87h-77.74v185.304Z"/>
                    </svg>
                    <h1 className="font-lgc text-2xl font-bold">Informações dos Cartões</h1>
                </div>

                <div className="w-full flex flex-col xl:flex-row items-center gap-6">

                    <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                            <path d="M290-146.999q-25.218 0-41.174-19.805-15.957-19.805-9.261-44.022l24.043-96.173h-72.043q-26.217 0-42.174-20.305t-9.261-45.522q4.13-17.957 18.522-29.066 14.391-11.109 32.913-11.109h98.261l33.782-133.998h-92.043q-26.217 0-42.174-20.305t-9.261-45.522q4.13-17.957 18.522-29.066 14.391-11.109 32.913-11.109h118.261l30.739-120.825q4.13-16.957 17.804-28.066 13.674-11.109 31.631-11.109 25.218 0 41.174 19.805 15.957 19.805 9.261 44.022l-24.043 96.173h133.434l30.739-120.825q4.13-16.957 17.804-28.066 13.674-11.109 31.631-11.109 25.218 0 41.174 19.805 15.957 19.805 9.261 44.022l-24.043 96.173h72.043q26.217 0 42.174 20.305t9.261 45.522q-4.13 17.957-18.522 29.066-14.391 11.109-32.913 11.109h-98.261l-33.782 133.998h92.043q26.217 0 42.174 20.305t9.261 45.522q-4.13 17.957-18.522 29.066-14.391 11.109-32.913 11.109H610.174l-30.739 120.825q-4.13 16.957-17.804 28.066-13.674 11.109-31.631 11.109-25.218 0-41.174-19.805-15.957-19.805-9.261-44.022l24.043-96.173H370.174l-30.739 120.825q-4.13 16.957-17.804 28.066-13.674 11.109-31.631 11.109Zm106.392-266.002h133.434l33.782-133.998H430.174l-33.782 133.998Z"/>
                        </svg>
                        <div className="w-full flex flex-col items-start justify-center">
                            <p className="font-lgc text-lg font-bold">Cartões Registrados (Agora)</p>
                            <p className="font-lgc text-lg">{registeredCardsCount}</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                            <path d="M706.999-253.001v-453.998H640q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h66.999q43.74 0 74.871 31.131 31.131 31.131 31.131 74.871v453.998q0 43.74-31.131 74.871-31.131 31.131-74.871 31.131H640q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h66.999Zm-453.998 0H320q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-66.999q-43.74 0-74.871-31.131-31.131-31.131-31.131-74.871v-453.998q0-43.74 31.131-74.871 31.131-31.131 74.871-31.131H320q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-66.999v453.998Z"/>
                        </svg>
                        <div className="w-full flex flex-col items-start justify-center">
                            <p className="font-lgc text-lg font-bold">ID do Último Cartão Registrado</p>
                            <p className="font-lgc text-lg">{lastCardId ?? "--"}</p>
                        </div>

                        { lastCardId != null ? (
                            <Link href={`/painel/cartoes/${lastCardId}`} className="bg-neutral-100 hover:bg-neutral-200 cursor-pointer p-2 rounded-md transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M178.956-178.956Q163.999-193.913 163.999-216q0-22.087 14.957-37.044l413.955-413.955H400q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h320q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v320q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-192.911l-413.39 413.955q-14.957 14.957-37.326 14.957-22.37 0-37.327-14.957Z"/>
                                </svg>
                            </Link>
                        ) : null
                        }

                    </div>

                </div>

                <div className="w-full h-96 flex justify-center items-center bg-neutral-100 rounded-md slide-up-fade-in opacity-0" style={{ animationDelay: "600ms" }}>

                    <div className="scanner w-full h-[96%] flex flex-col justify-center items-center text-center gap-2 m-2 rounded-md">

                        <h1 ref={boxTitleRef} className="font-lgc text-lg font-bold px-6">{ boxIcon == "loading" ? "PASSE UM CARTÃO NO LEITOR" : "CARTÃO REGISTRADO" }</h1>

                        <p ref={tipBox} className="font-lgc text-lg max-w-lg px-6">{tips[currentTip]}</p>

                        <div ref={boxIconRef} className="mt-4">  
                            {
                                boxIcon == "loading" ? (
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                ) : boxIcon == "success" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36">
                                        <path d="M379.333-246.927q-8.551 0-16.384-3.109t-14.485-9.761l-178.001-178q-12.869-12.87-12.703-31.703.167-18.833 13.037-31.703 12.869-12.87 31.246-12.87t31.624 12.87l145.666 145.666L726.044-701.87q12.869-12.87 31.369-13.152 18.5-.283 31.558 13.152 12.87 12.87 12.87 31.652 0 18.783-12.87 31.653L410.203-259.797q-6.652 6.652-14.486 9.761-7.833 3.109-16.384 3.109Z"/>
                                    </svg>
                                ) : null
                            }
                        </div>

                    </div>

                </div>

            </div>   

        </>
    );

};

RegistrarCartao.requiresUser = true;

RegistrarCartao.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Cartões"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default RegistrarCartao;