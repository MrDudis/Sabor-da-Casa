import { useState, useEffect, useContext, useRef } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import TicketBox from "@/components/painel/comandas/TicketBox";
import TicketSortDropdown from "@/components/painel/comandas/TicketSortDropdown";

import { MessageModal } from "@/components/elements/modal/Modal";
import { FilterRadioInput } from "@/components/elements/input/Input";

import * as ticketsLib from "@/lib/tickets";
import * as usersLib from "@/lib/users";

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

const sortOptions = {
    DATE: {
        ASC: "date_asc",
        DESC: "date_desc"
    }
};

const sortOptionsLabels = {
    [sortOptions.DATE.ASC]: "Data de Registro (Crescente)",
    [sortOptions.DATE.DESC]: "Data de Registro (Decrecente)"
};

function Comandas({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [baseAnimationDelay, setBaseAnimationDelay] = useState(400);
    const animationDelay = 50;

    const [tickets, setTickets] = useState(Array(18).fill(null));

    const fetchTickets = async () => {
            
        let response = await ticketsLib.getAll();

        if (response.status === 200) {
            setTimeout(() => { setTickets(response.tickets); setBaseAnimationDelay(0); }, 1600);
        } else {
            showModal(
                <MessageModal 
                    icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
    
            router.push("/painel");
        };

    };

    useEffect(() => { fetchTickets(); }, []);

    const [ticketByCardLoading, setTicketByCardLoading] = useState(false);

    useEffect(() => {
        if (!socket) { return; }

        const Action = async (data) => {
            setTicketByCardLoading(true);

            if (data?.userId == null) { 
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message="Este cartão não está vinculado a nenhum usuário."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );

                setTicketByCardLoading(false);
                return;
            };

            const userId = data.userId;
            
            let response = await usersLib.getTickets(userId);

            if (response.status === 200) {

                if (response.tickets.length === 0) {
                    showModal(
                        <MessageModal
                            icon="error" title="Erro" message="Este usuário não possui nenhuma comanda."
                            buttons={[ { label: "Fechar", action: closeModal } ]}
                        ></MessageModal>
                    );

                    setTicketByCardLoading(false);
                    return;
                };

                router.push("/painel/comandas/" + response.tickets[0].id);

            } else {

                showModal(
                    <MessageModal 
                        icon="error" title="Erro ao Pegar Comanda pelo Cartão" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
        
            };

            setTicketByCardLoading(false);
        };

        socket.on("ACTION", Action);

        return () => { socket.off("ACTION", Action); };

    }, [socket]);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);

    const [sortOption, setSortOption] = useState(sortOptions.DATE.ASC);

    const handleSearch = async () => {
        let query = searchQuery.trim();
        
        setTickets([])

    };

    const handleSearchChange = async (event) => {
        if (searchTimeout) { clearTimeout(searchTimeout); };

        let query = event.currentTarget.value;

        setSearchQuery(query);
        if (tickets && (tickets.length == 0 || tickets[0] != null)) { setTickets(Array(18).fill(null)); };
        
        let timeout = setTimeout(() => { handleSearch(); }, 500);
        setSearchTimeout(timeout); 
        
    };

    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortDropdown = useRef(null);

    useEffect(() => {
        
        if (!showSortDropdown) { return; };

        function handleClick(event) {
            if (sortDropdown.current && !sortDropdown.current.contains(event.target)) { setShowSortDropdown(false); };
        };

        window.addEventListener("click", handleClick);
        
        return () => { window.removeEventListener("click", handleClick) };

    }, [showSortDropdown]);

    const [showFilters, setShowFilters] = useState(false);

    return (
        <>

            <Head>
                <title>Painel | Comandas | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Comandas | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de comandas do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl text-left slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Comandas</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Comandas</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">

                <div className="w-full p-1.5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
                    
                    <div className="scanner w-full flex flex-row justify-start items-center gap-3 p-4 rounded-md">
                        
                        { ticketByCardLoading ? (
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                                <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" className="fill-neutral-900 fast-fade-in">
                                <path d="M761.13-621.782q-7.26 0-14.174-3.566-6.913-3.565-10.608-11.826l-30.87-67.739-67.174-30.869q-8.261-3.696-12.109-10.327-3.847-6.63-3.847-13.891t3.847-14.174q3.848-6.913 12.109-10.609l67.174-30.304 30.87-67.739q3.695-8.261 10.608-12.109 6.914-3.848 14.174-3.848 7.261 0 13.892 3.848 6.63 3.848 10.326 12.109l30.87 67.739 67.173 30.304q8.261 3.696 12.109 10.609 3.848 6.913 3.848 14.174 0 7.261-3.848 13.891-3.848 6.631-12.109 10.327l-67.173 30.869-30.87 67.739q-3.696 8.261-10.326 11.826-6.631 3.566-13.892 3.566Zm0 560q-7.26 0-14.174-3.566-6.913-3.565-10.608-11.826l-30.87-67.739-67.174-30.869q-8.261-3.696-12.109-10.327-3.847-6.63-3.847-13.891t3.847-14.174q3.848-6.913 12.109-10.609l67.174-30.304 30.87-67.739q3.695-8.261 10.608-12.109 6.914-3.848 14.174-3.848 7.261 0 13.892 3.848 6.63 3.848 10.326 12.109l30.87 67.739 67.173 30.304q8.261 3.696 12.109 10.609 3.848 6.913 3.848 14.174 0 7.261-3.848 13.891-3.848 6.631-12.109 10.327l-67.173 30.869-30.87 67.74q-3.696 8.26-10.326 11.826-6.631 3.565-13.892 3.565ZM363.391-213.61q-14.391 0-27.5-7.978t-20.37-22.935l-58.912-128.695-128.696-58.913q-14.956-7.261-22.935-20.37Q97-465.609 97-480t7.978-27.5q7.979-13.109 22.935-20.37l128.696-58.913 58.912-128.695q7.261-14.957 20.37-22.935 13.109-7.978 27.5-7.978 14.392 0 27.783 7.978 13.392 7.978 20.653 22.935l58.347 128.695L598.87-527.87q14.956 7.261 22.935 20.37 7.978 13.109 7.978 27.5t-7.978 27.5q-7.979 13.109-22.935 20.37l-128.696 58.913-58.347 128.695q-7.261 14.957-20.653 22.935-13.391 7.978-27.783 7.978Z"/>
                            </svg>
                        )}

                        <p className="font-lgc">Você pode passar uma comanda no seu leitor para abrir a página dessa comanda imediatamente.</p>
                    </div>
                    
                </div>

                <div className="w-full flex flex-col-reverse sm:flex-row gap-6">

                    <div className="flex w-full gap-6">

                        <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-neutral-800">
                                <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                            </svg>
                            <input onChange={handleSearchChange} id="query" name="query" type="text" placeholder="Pesquisar" className="w-full font-lgc text-xl outline-none px-1 py-2 xl:py-0"></input>
                        </div>

                    </div>

                    <Link href="/painel/comandas/registrar" className="w-full min-w-[190px] sm:w-[30%] sm:max-w-xs flex flex-row justify-start items-center gap-3 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-4 py-3 transition-all smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-138.391q0-11 6.717-18.718 6.717-7.717 17.717-9.717 23.435-6.87 39.5-24.761 16.066-17.891 16.066-41.63 0-24.304-16.066-42.195-16.065-17.892-39.5-24.196-11-2-17.717-9.717-6.717-7.718-6.717-18.718v-138.391q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v138.957q0 11-6.717 18.434-6.717 7.435-17.717 9.435-23.435 6.304-39.5 24.196-16.066 17.891-16.066 42.195 0 23.739 16.066 41.63 16.065 17.891 39.5 24.761 11 2 17.717 9.435 6.717 7.434 6.717 18.434v138.957q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783ZM480-284.522q18.696 0 31.609-12.913t12.913-31.044q0-18.695-12.913-31.609-12.913-12.913-31.609-12.913-18.13 0-31.326 12.913-13.196 12.914-13.196 31.609 0 18.131 13.196 31.044T480-284.522Zm0-150.956q18.696 0 31.609-13.196T524.522-480q0-18.696-12.913-31.609T480-524.522q-18.13 0-31.326 12.913-13.196 12.913-13.196 31.609 0 18.13 13.196 31.326Q461.87-435.478 480-435.478Zm0-151.521q18.696 0 31.609-13.196t12.913-31.326q0-18.696-12.913-31.327-12.913-12.63-31.609-12.63-18.13 0-31.326 12.63-13.196 12.631-13.196 31.327 0 18.13 13.196 31.326Q461.87-586.999 480-586.999Z"/>
                        </svg>
                        <p className="text-black font-lgc font-bold text-xl">Registrar</p>
                    </Link>

                </div>

                <p className={`${searchQuery == "" ? "hidden" : "block"} font-lgc text-lg`}>Mostrando resultados para "<span className="font-bold">{searchQuery}</span>":</p>

                <div className="flex flex-col-reverse lg:flex-row items-start justify-start gap-2">

                    <div className="w-full flex flex-col justify-start items-start gap-4">

                        <div className="relative w-full flex justify-start items-center z-40 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                            <div ref={sortDropdown}  onClick={() => { setShowSortDropdown(!showSortDropdown) }} className={`flex flex-row justify-start items-center gap-2 select-none cursor-pointer px-2 py-1.5 ${showSortDropdown ? "bg-neutral-100" : ""} hover:bg-neutral-100 rounded-md transition-all`}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                                    <path d="M320-202H160q-26 0-44.5-18.5T97-265q0-26 18.5-44.5T160-328h160q26 0 44.5 18.5T383-265q0 26-18.5 44.5T320-202Zm480-430H160q-26 0-44.5-18.5T97-695q0-26 18.5-44.5T160-758h640q26 0 44.5 18.5T863-695q0 26-18.5 44.5T800-632ZM560-417H160q-26 0-44.5-18.5T97-480q0-26 18.5-44.5T160-543h400q26 0 44.5 18.5T623-480q0 26-18.5 44.5T560-417Z"/>
                                </svg>
                                <div className="flex flex-row items-baseline justify-start gap-1">
                                    <h2 className="font-lgc font-bold">Ordenar por:</h2>
                                    <p className="font-lgc text-sm">{sortOptionsLabels[sortOption]}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className={`fill-neutral-700 ${showSortDropdown ? "rotate-180" : ""} transition-all`}>
                                    <path d="m436-374-98-98q-31-31-14.5-71t60.5-40h197q43 0 59.5 40T626-472l-98 98q-9 9-21.5 14t-24.5 5q-12 0-24.5-5T436-374Z"/>
                                </svg>

                                <TicketSortDropdown 
                                    selectedSortOption={sortOption} setSortOption={setSortOption} 
                                    sortOptions={sortOptions} sortOptionsLabels={sortOptionsLabels}
                                    showDropdown={showSortDropdown}
                                ></TicketSortDropdown>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4">

                            {
                                tickets.map((ticketData, index) => {
                                    return <TicketBox ticket={ticketData} animationDelay={baseAnimationDelay + (animationDelay * index)} key={index}></TicketBox>;
                                })
                            }

                        </div>

                        {
                            tickets.length == 0 ? (
                                <div className="w-full flex flex-col justify-center items-center gap-6 mt-16 fast-fade-in">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
                                        <path d="M283.391-323.391q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm0-116.609q17 0 28.5-11.5t11.5-28.5v-116.609q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5V-480q0 17 11.5 28.5t28.5 11.5ZM440-360h236.609q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5H440q-17 0-28.5 11.5T400-400q0 17 11.5 28.5T440-360Zm0-156.609h236.609q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5H440q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5ZM166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-466.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v466.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783Z"/>
                                    </svg>
                                    <div className="flex flex-col text-center gap-1">
                                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Nenhuma comanda encontrada.</p>
                                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Tente novamente com outra pesquisa ou registre uma nova comanda com o botão "Registrar" acima.</p>
                                    </div>
                                </div>
                            ) : null
                        }

                    </div>

                    <div className={`${showFilters ? "flex" : "hidden lg:flex"} w-full lg:w-96 flex-col items-start justify-start gap-4 my-2 lg:px-4 lg:py-2`}>

                        <div className="hidden lg:flex flex-row justify-start items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "100ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M456.175-158Q433-158 415.5-175.4 398-192.8 398-216v-215L171-709q-23-29-7.245-61 15.756-32 52.245-32h528q36.489 0 52.245 32Q812-738 789-709L562-431v226q0 20.2-13.383 33.6-13.383 13.4-33.559 13.4h-58.883Z"/>
                            </svg>
                            <h2 className="font-lgc font-bold">Filtros</h2>
                        </div>

                        <div className="w-full flex flex-col items-start justify-start p-4 gap-3 rounded-md border border-neutral-400 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
                            
                            <div className="w-full flex flex-row justify-between items-center">
                                <p className="font-lgc text-lg">Ativo?</p>
                                <p className="font-lgc text-neutral-600 text-xs cursor-pointer hover:underline">Limpar</p>
                            </div>
                            
                            <FilterRadioInput
                                name="active"
                                options={[
                                    { label: "Sim", value: true },
                                    { label: "Não", value: false }
                                ]}
                                onChange={(newValue) => {  }}
                            ></FilterRadioInput>

                        </div>

                    </div>

                    <div className="w-full flex lg:hidden justify-start items-center z-40 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                        <div onClick={() => { setShowFilters(!showFilters) }} className={`flex flex-row justify-start items-center select-none gap-2 cursor-pointer px-2 py-1.5 ${showFilters ? "bg-neutral-100" : ""} hover:bg-neutral-100 rounded-md transition-all`}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                                <path d="M456.175-158Q433-158 415.5-175.4 398-192.8 398-216v-215L171-709q-23-29-7.245-61 15.756-32 52.245-32h528q36.489 0 52.245 32Q812-738 789-709L562-431v226q0 20.2-13.383 33.6-13.383 13.4-33.559 13.4h-58.883Z"/>
                            </svg>

                            <h2 className="font-lgc font-bold">Filtros</h2>

                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className={`fill-neutral-700 ${showFilters ? "rotate-180" : ""} transition-all`}>
                                <path d="m436-374-98-98q-31-31-14.5-71t60.5-40h197q43 0 59.5 40T626-472l-98 98q-9 9-21.5 14t-24.5 5q-12 0-24.5-5T436-374Z"/>
                            </svg>
                        </div>
                    </div>

                </div>

            </div>

        </>
    );

};

Comandas.requiresUser = true;

Comandas.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Comandas"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Comandas;