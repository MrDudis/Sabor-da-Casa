import { useState, useEffect, useContext } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import MiniEditProductBox from "@/components/painel/comandas/MiniEditProductBox";

import { MessageModal } from "@/components/elements/modal/Modal";

import Ticket from "@/models/Ticket";

import * as ticketsLib from "@/lib/tickets";

import { formatTimestamp } from "@/utils/formatting/timestamp";
import { formatPrice } from "@/utils/formatting/price";

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

function Comanda({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [ticket, setTicket] = useState(null);
    const [ticketLoadError, setTicketLoadError] = useState(null);

    const fetchTicket = async () => {

        const id = router.query?.id;

        let response = await ticketsLib.get(id);

        if (response.status === 200) {
            setTicket(new Ticket(response.ticket));
        } else {
            setTicketLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchTicket(); }, []);

    const [ticketProductsCache, setTicketProductsCache] = useState([]);
    useEffect(() => { setTicketProductsCache(ticket?.products ?? []); }, [ticket]);

    const updateProduct = async (productId, quantity) => {

        let response = await ticketsLib.updateProduct(ticket?.id, productId, quantity);

        if (response.status === 200) {

            let newTicketProductsCache = ticketProductsCache.map(product => {
                if (product.id === productId) { product.quantity = quantity; };
                return product;
            });

            setTicketProductsCache(newTicketProductsCache);

        } else {

            showModal(
                <MessageModal
                    icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );

        };

    };

    const redirectToAddProducts = () => {
        router.push(`/painel/comandas/${ticket?.id}/adicionar`);
    };

    const [ticketPayLoading, setTicketPayLoading] = useState(false);

    const handlePayTicketSubmit = async () => {
        closeModal();

        setTicketPayLoading(true);

        let response = await ticketsLib.deleteTicket(ticket.id);

        if (response.status === 200) {

            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Comanda Paga" message="A comanda foi paga com sucesso."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
    
                router.push("/painel/comandas");
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

        setTimeout(() => { setTicketPayLoading(false); }, 500);
    };

    const payTicketConfirmation = (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Pagar Comanda?" message="Tem certeza que deseja pagar esta comanda? Essa ação não pode ser desfeita."
                buttons={[ { label: "Pagar", action: handlePayTicketSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    if (!ticket) {
        if (ticketLoadError) {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-black slide-up-fade-in opacity-0">
                        <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                    </svg>
                    <div className="flex flex-col text-center gap-1">
                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Comanda.</p>
                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{ticketLoadError}</p>
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
                <title>Painel | Comanda | Sabor da Casa</title>
                <meta property="og:title" content={`Painel | Comanda | Sabor da Casa`} key="title" />
                <meta name="og:description" content="Painel para gerenciamento de comanda do Restaurante Sabor da Casa." />
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
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Comanda {ticket?.id ?? router?.query?.id}</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/comandas" className="hover:font-bold">Comandas</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Comanda {ticket?.id ?? router?.query?.id}</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <div className="w-full xl:w-[886px] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="m480-392.695 50.956 39.217q14.957 11.826 31.631.5t10.543-29.848l-20.608-65.261 57.956-45.217q14.957-11.826 8.544-29.565-6.413-17.74-25.501-17.74h-66.695l-21.608-66.26q-6.131-18.522-25.218-18.522t-25.218 18.522l-21.608 66.26h-67.695q-19.088 0-25.001 17.74-5.913 17.739 8.479 29.565l56.521 45.217-20.608 66.826q-6.131 18.522 9.826 29.566 15.956 11.043 31.348-.783L480-392.695ZM166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-138.391q0-11 6.717-18.718 6.717-7.717 17.717-9.717 23.435-6.87 39.5-24.761 16.066-17.891 16.066-41.63 0-24.304-16.066-42.195-16.065-17.892-39.5-24.196-11-2-17.717-9.717-6.717-7.718-6.717-18.718v-138.391q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v138.957q0 11-6.717 18.434-6.717 7.435-17.717 9.435-23.435 6.304-39.5 24.196-16.066 17.891-16.066 42.195 0 23.739 16.066 41.63 16.065 17.891 39.5 24.761 11 2 17.717 9.435 6.717 7.434 6.717 18.434v138.957q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Informações da Comanda</h1>
                    </div>

                    {
                        ticket?.userId ? (
                            <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M480-489.609q-74.479 0-126.849-52.37-52.369-52.37-52.369-126.849 0-74.478 52.369-126.565 52.37-52.088 126.849-52.088 74.479 0 126.849 52.088 52.369 52.087 52.369 126.565 0 74.479-52.369 126.849-52.37 52.37-126.849 52.37ZM246.783-131.172q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-26.347q0-39.088 20.326-72.109 20.326-33.022 54.413-50.283 63.696-31.566 129.957-47.631T480-449.609q69.391 0 135.652 15.782 66.261 15.783 128.827 47.348 34.087 17.261 54.413 50.001 20.326 32.739 20.326 72.957v26.347q0 44.305-30.848 75.153-30.848 30.849-75.153 30.849H246.783Z"/>
                                </svg>
                                <p className="w-full font-lgc text-lg">Pertence a <span className="font-bold">{ticket.user?.name}</span></p>

                                <Link href={`/painel/pessoas/${ticket.user?.id}`} className="bg-neutral-100 hover:bg-neutral-200 cursor-pointer p-2 rounded-md transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M178.956-178.956Q163.999-193.913 163.999-216q0-22.087 14.957-37.044l413.955-413.955H400q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h320q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v320q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-192.911l-413.39 413.955q-14.957 14.957-37.326 14.957-22.37 0-37.327-14.957Z"/>
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M480-271.521q20.603 0 34.541-13.938 13.938-13.938 13.938-34.541v-151.521q0-20.604-13.938-34.541Q500.603-520 480-520q-20.603 0-34.541 13.938-13.938 13.937-13.938 34.541V-320q0 20.603 13.938 34.541 13.938 13.938 34.541 13.938Zm0-317.174q21.805 0 36.555-14.75T531.305-640q0-21.805-14.75-36.555T480-691.305q-21.805 0-36.555 14.75T428.695-640q0 21.805 14.75 36.555T480-588.695Zm0 527.913q-87.522 0-163.906-32.96-76.385-32.96-132.888-89.464-56.504-56.503-89.464-132.888Q60.782-392.478 60.782-480t32.96-163.906q32.96-76.385 89.464-132.888 56.503-56.504 132.888-89.464 76.384-32.96 163.906-32.96t163.906 32.96q76.385 32.96 132.888 89.464 56.504 56.503 89.464 132.888 32.96 76.384 32.96 163.906t-32.96 163.906q-32.96 76.385-89.464 132.888-56.503 56.504-132.888 89.464Q567.522-60.782 480-60.782Z"/>
                                </svg>
                                <p className="font-lgc text-lg">Esta comanda não pertence a ninguém.</p>
                            </div>
                        )
                    }

                    <div className="w-full flex flex-col xl:flex-row items-center gap-6">

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                <path d="M206.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-546.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848H240v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.739 13.478q13.479 13.478 13.479 32.739v33.783h293.998v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.74 13.478Q720-872.262 720-853.001v33.783h33.217q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v546.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-106.001h546.434V-560H206.783v393.217ZM480-395.478q-18.922 0-31.722-12.8T435.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T480-395.478Zm-160 0q-18.922 0-31.722-12.8T275.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T320-395.478Zm320 0q-18.13 0-31.326-12.8-13.196-12.8-13.196-31.722t13.196-31.722q13.196-12.8 31.609-12.8 18.413 0 31.326 12.8T684.522-440q0 18.922-12.8 31.722T640-395.478Zm-160 160q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T480-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm-160 0q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T320-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm320 0q-18.13 0-31.326-13.196-13.196-13.196-13.196-31.609 0-18.413 13.196-31.326t31.609-12.913q18.413 0 31.326 12.8T684.522-280q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Registrada em</p>
                                <p className="font-lgc text-lg">{formatTimestamp(ticket?.createdAt)}</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                <path d="M681.13-280q25 0 42.5-17.5t17.5-42.5q0-25-17.5-42.5t-42.5-17.5q-25 0-42.5 17.5t-17.5 42.5q0 25 17.5 42.5t42.5 17.5Zm0 120q31.566 0 57-14.217 25.435-14.218 42-38.218Q757.565-226 732.848-233q-24.718-7-51.718-7-27 0-52 7t-47.565 20.565q16.565 24 42.283 38.218Q649.565-160 681.13-160ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-60.216Q332.521-96.912 236.651-227.065 140.782-357.217 140.782-516v-183.913q0-33.478 19.022-60.261t49.935-38.61l233.217-87.173q17.957-6.696 37.044-6.696 19.087 0 37.044 6.696l233.217 87.173q30.913 11.827 49.935 38.61 19.022 26.783 19.022 60.261v178.218q-30.522-18.653-66.978-28.479Q715.783-560 680-560q-116 0-198 82t-82 198q0 65.391 27.457 120.761 27.456 55.37 73.631 92.935-5.522 2.261-10.544 3.61-5.022 1.347-10.544 2.478Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Funcionário Responsável</p>
                                <p className="font-lgc text-lg">{ticket.employee?.name ?? "Ninguém"}</p>
                            </div>

                            <Link href={`/painel/pessoas/${ticket.employee?.id}`} className="bg-neutral-100 hover:bg-neutral-200 cursor-pointer p-2 rounded-md transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M178.956-178.956Q163.999-193.913 163.999-216q0-22.087 14.957-37.044l413.955-413.955H400q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h320q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v320q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-192.911l-413.39 413.955q-14.957 14.957-37.326 14.957-22.37 0-37.327-14.957Z"/>
                                </svg>
                            </Link>
                        </div>

                    </div>

                    <div className="w-full flex flex-col gap-5 px-6 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>

                        <div className="flex flex-col xs:flex-row justify-between items-center gap-6 xs:gap-2 py-1">
                            <div className="w-full flex flex-row items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M206.783-58.52q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-444.087q-17-12.519-28.5-31.868-11.5-19.349-11.5-49.697v-103.043q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v103.043q0 30.348-11.5 49.697-11.5 19.349-28.5 31.868v444.087q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-525.653v419.651h546.434v-419.651H206.783Zm586.434-106.001v-103.043H166.783v103.043h626.434ZM393.782-393.217h172.436q18.681 0 31.319-12.64 12.637-12.641 12.637-31.327t-12.637-31.599q-12.638-12.913-31.319-12.913H393.782q-18.681 0-31.319 12.8-12.637 12.8-12.637 31.722 0 18.682 12.637 31.319 12.638 12.638 31.319 12.638ZM206.783-164.522v-419.651 419.651Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-xl">Produtos</h1>
                            </div>

                            <button onClick={redirectToAddProducts} disabled={!ticket.active} className="w-full md:w-fit flex flex-row justify-center items-center gap-1.5 font-lgc font-bold text-lg px-4 py-1 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white">
                                    <path d="M480-186.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-186.999H240q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h186.999V-720q0-22.087 15.457-37.544 15.457-15.457 37.544-15.457 22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v186.999H720q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H533.001V-240q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457Z"/>
                                </svg>
                                Adicionar
                            </button>
                        </div>

                        <div className="flex flex-row items-center gap-3 bg-neutral-200 rounded-md px-3 py-2">
                            {
                                ticket?.active ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M202.87-71.87q-37.783 0-64.392-26.608-26.609-26.609-26.609-64.392v-554.26q0-37.783 26.609-64.392 26.609-26.609 64.392-26.609H240V-845.5q0-17.957 12.457-30.294 12.456-12.337 30.413-12.337 17.956 0 30.293 12.337T325.5-845.5v37.369h309V-845.5q0-17.957 12.456-30.294 12.457-12.337 30.414-12.337 17.956 0 30.293 12.337T720-845.5v37.369h37.13q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v196.652q0 19.152-13.174 32.326t-32.327 13.174q-19.152 0-32.326-13.174t-13.174-32.326V-560H202.87v397.13H434.5q19.152 0 32.326 13.174T480-117.37q0 19.153-13.174 32.327T434.5-71.87H202.87Zm691.456-195.934-92.652-92.652 29-29q12.435-12.435 31.707-12.555 19.271-.119 31.945 12.555l29 29q12.674 12.674 12.555 31.945-.12 19.272-12.555 31.707l-29 29ZM633.5-26.13h-50.87q-9.195 0-15.913-6.717Q560-39.566 560-48.761v-50.87q0-9.195 3.359-17.532 3.358-8.337 10.076-15.054l200.239-200.239 92.652 92.652-200.239 200.24q-6.717 6.717-15.054 10.075-8.337 3.359-17.533 3.359Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M568.479-457.523q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM306.001-320q-43.725 0-74.863-31.138Q200-382.276 200-426.001v-302.478q0-43.725 31.138-74.863 31.138-31.138 74.863-31.138h525.52q43.726 0 74.864 31.138 31.138 31.138 31.138 74.863v302.478q0 43.725-31.138 74.863Q875.247-320 831.521-320h-525.52ZM128.479-142.477q-43.726 0-74.864-31.138-31.138-31.138-31.138-74.864v-378.52q0-22.088 15.457-37.544Q53.391-680 75.478-680q22.087 0 37.544 15.457 15.457 15.456 15.457 37.544v378.52h618.52q22.088 0 37.544 15.457Q800-217.565 800-195.478q0 22.087-15.457 37.544-15.456 15.457-37.544 15.457h-618.52Zm169.044-515.046q33 0 56.5-23.5t23.5-56.5h-80v80Zm542.477 0v-80h-80q0 33 23.5 56.5t56.5 23.5Zm-542.477 240h80q0-33-23.5-56.5t-56.5-23.5v80Zm462.477 0h80v-80q-33 0-56.5 23.5t-23.5 56.5Z"/>
                                    </svg>
                                )
                            }
                            <div className="flex flex-col lg:flex-row gap-0 lg:gap-1">
                                <p className="font-lgc text-black font-bold">{ticket?.active ? "Última Edição" : "Pago"} em</p>
                                <p className="font-lgc text-black">{formatTimestamp(ticket?.updatedAt)}</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col justify-center items-start gap-6">

                            <div className="w-full h-96 bg-neutral-200 rounded-md overflow-y-scroll">

                                {
                                    ticket.products.length > 0 ? (
                                        <div className="w-full grid grid-cols-1 gap-4 p-4">
                                            {
                                                ticket.products.map((product, index) => {
                                                    return <MiniEditProductBox key={index} active={ticket?.active} product={product} updateProduct={updateProduct}/>
                                                })
                                            }
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col justify-center items-center gap-2 p-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" className="mb-4">
                                                <path d="M339.784-233.782q-44.305 0-75.154-30.848-30.848-30.849-30.848-75.154v-466.434q0-44.305 30.848-75.153 30.849-30.848 75.154-30.848h466.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v466.434q0 44.305-30.848 75.154-30.848 30.848-75.153 30.848H339.784ZM153.782-47.781q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-519.435q0-22.087 15.457-37.544 15.456-15.457 37.544-15.457 22.087 0 37.544 15.457 15.456 15.457 15.456 37.544v519.435h519.435q22.087 0 37.544 15.456 15.457 15.457 15.457 37.544 0 22.088-15.457 37.544-15.457 15.457-37.544 15.457H153.782Z"/>
                                            </svg>
                                            <h1 className="font-lgc text-2xl font-bold">Esta comanda está vazia.</h1>
                                            <h2 className="font-lgc text-neutral-800">Adicione produtos nesta comanda clicando em "Adicionar" acima.</h2>
                                        </div>
                                    )
                                }

                            </div>

                        </div>

                        <div className="w-full flex flex-row justify-between items-center gap-2 px-2">
                            <h1 className="font-lgc font-bold text-xl">Total</h1>
                            <p className="font-lgc font-bold text-xl">
                                { formatPrice(ticketProductsCache.map(product => {
                                    return ticket.products.find(p => p.id === product.id).price * product.quantity
                                }).reduce((a, b) => a + b, 0)) }
                            </p>
                        </div>

                    </div>

                    <form onSubmit={payTicketConfirmation} className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        
                        <div className="w-full xl:w-[65%] flex flex-col justify-center items-start gap-2">
                            <div className="w-full flex flex-row justify-start items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M568.479-457.523q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM306.001-320q-43.725 0-74.863-31.138Q200-382.276 200-426.001v-302.478q0-43.725 31.138-74.863 31.138-31.138 74.863-31.138h525.52q43.726 0 74.864 31.138 31.138 31.138 31.138 74.863v302.478q0 43.725-31.138 74.863Q875.247-320 831.521-320h-525.52ZM128.479-142.477q-43.726 0-74.864-31.138-31.138-31.138-31.138-74.864v-378.52q0-22.088 15.457-37.544Q53.391-680 75.478-680q22.087 0 37.544 15.457 15.457 15.456 15.457 37.544v378.52h618.52q22.088 0 37.544 15.457Q800-217.565 800-195.478q0 22.087-15.457 37.544-15.456 15.457-37.544 15.457h-618.52Zm169.044-515.046q33 0 56.5-23.5t23.5-56.5h-80v80Zm542.477 0v-80h-80q0 33 23.5 56.5t56.5 23.5Zm-542.477 240h80q0-33-23.5-56.5t-56.5-23.5v80Zm462.477 0h80v-80q-33 0-56.5 23.5t-23.5 56.5Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-lg">Pagar Comanda</h1>
                            </div>

                            <p className="font-lgc text-[17px]">Realiza o pagamento da comanda, torna ela inativa e ineditável, apenas para visualização no histórico.</p>
                        </div>

                        <div className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                            <button disabled={ticketPayLoading || !ticket.active} className={`w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 ${!ticket.active ? "disabled:bg-neutral-300 disabled:cursor-not-allowed" : "disabled:bg-red-600 disabled:cursor-default"} transition-all`} type="submit">
                                { ticketPayLoading ? (
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                        <path d="M482.13-111.521q-18.695 0-31.608-12.631-12.913-12.63-12.913-31.326v-43.739q-46.696-10.565-81.544-36.978-34.848-26.414-56.413-71.979-8.131-17.391.348-36.283 8.478-18.891 28.87-26.456 16.826-7.131 34.369.782 17.544 7.913 28.935 26.305 16.435 26.608 40.739 40.13 24.305 13.522 57.217 13.522 39.305 0 64.131-15.957 24.826-15.956 24.826-49.869 0-31.043-22.566-51.261-22.565-20.217-101.434-44.521-83.739-25.87-116.87-65.913-33.13-40.044-33.13-96.305 0-62.739 40.586-101.565 40.587-38.826 91.936-47.218v-41.739q0-18.696 12.913-31.326 12.913-12.631 31.608-12.631 18.696 0 31.327 12.631 12.63 12.63 12.63 31.326v41.739q38 7.696 66.848 26.196t47.978 46.63q11.261 15.827 4.066 35.501-7.196 19.674-28.153 28.369-15.13 6.566-32.391.783-17.261-5.783-35.914-22.044-11.869-11.739-28.239-18.108-16.369-6.37-38.978-6.37-40.043 0-59.369 16.109-19.326 16.108-19.326 40.021 0 29.044 25.761 46.348 25.76 17.304 102.021 39.435 71.261 21.13 108.74 66.043 37.478 44.913 37.478 105.87 0 73.261-43.13 111.957-43.131 38.695-107.392 48.826v41.739q0 18.696-12.63 31.326-12.631 12.631-31.327 12.631Z"/>
                                    </svg>
                                ) }
                                { ticketPayLoading ? "Pagando..." : "Pagar" }
                            </button>
                        </div>
                        
                    </form>

                </div>

            </div>

        </>
    );

};

Comanda.requiresUser = true;

Comanda.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Comandas"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Comanda;