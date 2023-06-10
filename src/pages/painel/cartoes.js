import { useState, useEffect, useContext, useRef } from "react";

import Head from "next/head";
import Link from "next/link";

import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import CardBox from "@/components/painel/cartoes/CardBox";
import CardSortDropdown from "@/components/painel/cartoes/CardSortDropdown";

import { FilterRadioInput } from "@/components/elements/input/Input";
import { MessageModal } from "@/components/elements/modal/Modal";

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

function Cartoes({ token }) {

    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [baseAnimationDelay, setBaseAnimationDelay] = useState(400);
    const animationDelay = 50;

    const [cards, setCards] = useState(Array(18).fill(null));

    const fetchCards = async () => {
            
        let response = await cardsLib.getAll();

        if (response.status === 200) {
            setTimeout(() => { setCards(response.cards); setBaseAnimationDelay(0); }, 1600);
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

    useEffect(() => { fetchCards(); }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);

    const [sortOption, setSortOption] = useState(sortOptions.DATE.ASC);

    const handleSearch = async () => {
        let query = searchQuery.trim();
        
        // does the search
        setCards([])

    };

    const handleSearchChange = async (event) => {
        if (searchTimeout) { clearTimeout(searchTimeout); };

        let query = event.currentTarget.value;

        setSearchQuery(query);
        if (cards && (cards.length == 0 || cards[0] != null)) { setCards(Array(18).fill(null)); };
        
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
                <title>Painel | Cartões | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Cartões | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de cartões do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl text-left slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Cartões</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Cartões</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">

                <div className="w-full flex flex-col-reverse sm:flex-row gap-6">

                    <div className="flex w-full sm:w-[70%] gap-6">

                        <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-neutral-800">
                                <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                            </svg>
                            <input onChange={handleSearchChange} id="query" name="query" type="text" placeholder="Pesquisar" className="w-full font-lgc text-xl outline-none px-1 py-2 xl:py-0"></input>
                        </div>

                    </div>

                    <Link href="/painel/cartoes/registrar" className="w-full min-w-[190px] sm:w-[30%] flex flex-row justify-start items-center gap-3 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-4 py-3 transition-all smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M565.5-405.5q17 0 28.5-11.5t11.5-28.5v-80h80q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5h-80v-80q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5v80h-80q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5h80v80q0 17 11.5 28.5t28.5 11.5ZM328.37-237.37q-37.783 0-64.392-26.608-26.608-26.609-26.608-64.392v-474.26q0-37.783 26.608-64.392 26.609-26.609 64.392-26.609h474.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v474.26q0 37.783-26.609 64.392-26.609 26.608-64.392 26.608H328.37Zm-171 171q-37.783 0-64.392-26.608-26.609-26.609-26.609-64.392v-519.76q0-19.153 13.174-32.327 13.174-13.173 32.326-13.173 19.153 0 32.327 13.173 13.174 13.174 13.174 32.327v519.76h519.76q19.153 0 32.327 13.174 13.173 13.174 13.173 32.327 0 19.152-13.173 32.326Q696.283-66.37 677.13-66.37H157.37Z"/>
                        </svg>
                        <p className="text-black font-lgc font-bold text-xl">Registrar Cartões</p>
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

                                <CardSortDropdown 
                                    selectedSortOption={sortOption} setSortOption={setSortOption} 
                                    sortOptions={sortOptions} sortOptionsLabels={sortOptionsLabels}
                                    showDropdown={showSortDropdown}
                                ></CardSortDropdown>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4">

                            {
                                cards.map((cardData, index) => {
                                    return <CardBox card={cardData} animationDelay={baseAnimationDelay + (animationDelay * index)} key={index}></CardBox>;
                                })
                            }

                        </div>

                        {
                            cards.length == 0 ? (
                                <div className="w-full flex flex-col justify-center items-center gap-6 mt-16 fast-fade-in">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
                                        <path d="M246.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-437.391q0-21.225 7.978-40.461 7.978-19.235 22.935-34.192l189.478-189.478q14.957-14.957 34.192-22.935 19.236-7.978 40.461-7.978h277.391q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v626.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H246.783ZM480-268.13q20.603 0 34.541-13.937 13.938-13.938 13.938-34.542 0-20.603-13.938-34.541-13.938-13.937-34.541-13.937-20.603 0-34.541 13.937-13.938 13.938-13.938 34.541 0 20.604 13.938 34.542Q459.397-268.13 480-268.13Zm0-163.957q18.922 0 31.722-12.8t12.8-31.722v-123.956q0-18.922-12.8-31.722T480-645.087q-18.922 0-31.722 12.8t-12.8 31.722v123.956q0 18.922 12.8 31.722t31.722 12.8Z"/>
                                    </svg>
                                    <div className="flex flex-col text-center gap-1">
                                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Nenhuma cartão encontrado.</p>
                                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Tente novamente com outra pesquisa ou registre um novo cartão com o botão "Registrar" acima.</p>
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
                                <p className="font-lgc text-lg">Vinculado?</p>
                                <p className="font-lgc text-neutral-600 text-xs cursor-pointer hover:underline">Limpar</p>
                            </div>
                            
                            <FilterRadioInput
                                name="linked"
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

Cartoes.requiresUser = true;

Cartoes.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Cartões"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Cartoes;