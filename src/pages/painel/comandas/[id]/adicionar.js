import { useState, useEffect, useContext } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import MiniAddProductBox from "@/components/painel/comandas/MiniAddProductBox";

import { MessageModal } from "@/components/elements/modal/Modal";

import Ticket from "@/models/Ticket";

import * as ticketsLib from "@/lib/tickets";
import * as productsLib from "@/lib/products";
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

function ComandaAdicionar({ token }) {

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

    const [products, setProducts] = useState([]);
    const [productsLoadError, setProductsLoadError] = useState(null);

    const fetchProducts = async () => {

        let response = await productsLib.getAll();

        if (response.status === 200) {
            setTimeout(() => { setProducts(response.products); }, 1200);
        } else {
            setProductsLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchProducts(); }, []);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [addProductsLoading, setAddProductsLoading] = useState(false);

    const addProductsSubmit = async () => {
        setAddProductsLoading(true);

        let response = await ticketsLib.insertProducts(ticket.id, selectedProducts);

        if (response.status === 200) {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Produtos Registrados" message="Os produtos foram registrados na comanda com sucesso."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                
                router.push(`/painel/comandas/${response?.ticket?.id}`);
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

        setTimeout(() => { setAddProductsLoading(false); }, 500);
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
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Adicionar Produtos</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/comandas" className="hover:font-bold">Comandas</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href={`/painel/comandas/${ticket?.id ?? router?.query?.id}`} className="hover:font-bold">Comanda {ticket?.id ?? router?.query?.id}</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Adicionar Produtos</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-start items-start gap-6 py-6">

                <div className="w-full xl:w-[886px] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M484.522-608.479q-17 0-28.5-11.5t-11.5-28.5v-80h-80q-17 0-28.5-11.5t-11.5-28.5q0-17 11.5-28.5t28.5-11.5h80v-80q0-17 11.5-28.5t28.5-11.5q17 0 28.5 11.5t11.5 28.5v80h80q17 0 28.5 11.5t11.5 28.5q0 17-11.5 28.5t-28.5 11.5h-80v80q0 17-11.5 28.5t-28.5 11.5ZM280-71.521q-33 0-56.5-23.5t-23.5-56.5q0-33 23.5-56.5t56.5-23.5q33 0 56.5 23.5t23.5 56.5q0 33-23.5 56.5t-56.5 23.5Zm400 0q-33 0-56.5-23.5t-23.5-56.5q0-33 23.5-56.5t56.5-23.5q33 0 56.5 23.5t23.5 56.5q0 33-23.5 56.5t-56.5 23.5Zm-400-200q-51.033 0-77.103-43.457-26.071-43.457-.81-87.544L254.391-496 114.913-791.521H80q-20.603 0-34.541-13.938Q31.52-819.397 31.52-840q0-20.603 13.938-34.541Q59.397-888.479 80-888.479h62.739q14.957 0 28.122 7.917 13.166 7.917 19.748 22.432L343.13-537.523h277.74l136.217-245.999q6.13-12.261 17.891-18.326 11.761-6.065 25.052-6.631 27.789-.565 41.967 23.674 14.177 24.24.351 49.327L703.87-486.522q-12.13 21.696-32.109 34.109Q651.783-440 626.522-440H333.609l-38.913 71.521H720q20.603 0 34.541 13.938 13.938 13.938 13.938 34.541 0 20.603-13.938 34.541-13.938 13.938-34.541 13.938H280Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Adicionando Produtos na Comanda {ticket?.id ?? router?.query?.id}</h1>
                    </div>

                </div>

                <div className="w-full flex flex-col md:flex-row justify-start items-start gap-6 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>

                    <div className="w-full h-[90vh] flex flex-col p-4 gap-4 bg-neutral-100 rounded-md">

                        <div className="w-full flex flex-row items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M206.783-58.52q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-444.087q-17-12.519-28.5-31.868-11.5-19.349-11.5-49.697v-103.043q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v103.043q0 30.348-11.5 49.697-11.5 19.349-28.5 31.868v444.087q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-525.653v419.651h546.434v-419.651H206.783Zm586.434-106.001v-103.043H166.783v103.043h626.434ZM393.782-393.217h172.436q18.681 0 31.319-12.64 12.637-12.641 12.637-31.327t-12.637-31.599q-12.638-12.913-31.319-12.913H393.782q-18.681 0-31.319 12.8-12.637 12.8-12.637 31.722 0 18.682 12.637 31.319 12.638 12.638 31.319 12.638ZM206.783-164.522v-419.651 419.651Z"/>
                            </svg>
                            <h1 className="font-lgc font-bold text-xl">Selecionar Produtos</h1>
                        </div>

                        <div className="flex w-full gap-6 mx-2 my-1">

                            <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800">
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-neutral-800">
                                    <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                                </svg>
                                <input id="query" name="query" type="text" placeholder="Pesquisar" className="w-full bg-neutral-100 font-lgc text-xl outline-none px-1 py-2"></input>
                            </div>

                        </div>

                        <div className="w-full h-full bg-neutral-200 rounded-md overflow-y-scroll">

                            {
                                products.length > 0 ? (

                                    <div className="w-full grid grid-cols-1 gap-4 p-4">
                                        {
                                            products.map((product, index) => {
                                                return <MiniAddProductBox key={index} product={product} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}/>
                                            })
                                        }
                                    </div>

                                ) : products.length == 0 && productsLoadError == null ? (

                                    <div className="w-full h-full flex justify-center items-center">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                        </svg>
                                    </div>

                                ) : products.length == 0 && productsLoadError != null ? (

                                    <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" className="fill-black slide-up-fade-in opacity-0">
                                            <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                                        </svg>
                                        <div className="flex flex-col text-center gap-1">
                                            <p className="text-black font-lgc font-bold text-xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Produtos.</p>
                                            <p className="text-black font-lgc slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{productsLoadError}</p>
                                        </div>
                                    </div>

                                ) : null
                            }

                        </div>

                    </div>

                    <div className="w-full md:w-2/5 flex flex-col md:flex-row justify-start items-start gap-6 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>

                        <div className="w-full flex flex-col p-4 gap-4 bg-neutral-100 rounded-md">

                            <div className="w-full flex flex-row items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22">
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm.1-83.87q-40.013 0-68.121-28.009-28.109-28.009-28.109-68.021 0-40.013 28.009-68.121 28.009-28.109 68.021-28.109 40.013 0 68.121 28.009 28.109 28.009 28.109 68.021 0 40.013-28.009 68.121-28.009 28.109-68.021 28.109Zm-.1 221.393q-142.957 0-261.631-76.609-118.674-76.609-180.5-205.001-4.018-6.554-5.357-16.386-1.339-9.831-1.339-19.527 0-9.696 1.34-19.527 1.338-9.832 5.356-16.386 61.826-128.392 180.5-205.001Q337.043-817.523 480-817.523q142.957 0 261.631 76.609 118.674 76.609 180.5 205.001 4.018 6.554 5.357 16.386 1.339 9.831 1.339 19.527 0 9.696-1.339 19.527-1.339 9.832-5.357 16.386-61.826 128.392-180.5 205.001Q622.957-182.477 480-182.477Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-xl">Visão Geral</h1>
                            </div>

                            {
                                selectedProducts.length > 0 ? (
                                    <div className="flex flex-col items-start justify-start gap-2">
                                        <h1 className="font-lgc font-bold">Produtos</h1>

                                        {
                                            selectedProducts.map((product, index) => {
                                                return (
                                                    <div className="w-full flex flex-row justify-between items-center" key={index}>
                                                        <p className="font-lgc text-lg">{products.find(p => p.id === product.id).name} <span className="text-sm font-bold">({product.quantity}x)</span></p>
                                                        <p className="font-lgc">{formatPrice(products.find(p => p.id === product.id).price * product.quantity)}</p>
                                                    </div>
                                                )
                                            })
                                        }

                                        <div className="w-full flex flex-row justify-between items-center">
                                            <p className="font-lgc font-bold text-lg">Total</p>
                                            <p className="font-lgc font-bold">
                                                {
                                                    formatPrice(selectedProducts.map(product => {
                                                        return products.find(p => p.id === product.id).price * product.quantity
                                                    }).reduce((a, b) => a + b, 0))
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <h1 className="font-lgc font-bold">Produtos</h1>
                                        <p className="font-lgc">Nenhum produto selecionado.</p>
                                    </div>
                                )
                            }

                            <div className="w-full flex flex-row justify-center items-center mt-2">
                                <button onClick={addProductsSubmit} disabled={addProductsLoading || selectedProducts.length == 0} className={`w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 ${selectedProducts.length == 0 ? "disabled:bg-neutral-300 disabled:cursor-not-allowed" : "disabled:bg-red-600 disabled:cursor-default"} transition-all`} type="submit">
                                    { addProductsLoading ? (
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                            <path d="M480-186.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-186.999H240q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h186.999V-720q0-22.087 15.457-37.544 15.457-15.457 37.544-15.457 22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v186.999H720q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H533.001V-240q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457Z"/>
                                        </svg>
                                    ) }
                                    { addProductsLoading ? "Adicionando..." : "Adicionar" }
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );

};

ComandaAdicionar.requiresUser = true;

ComandaAdicionar.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Comandas"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default ComandaAdicionar;