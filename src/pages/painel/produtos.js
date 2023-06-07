import { useState, useEffect, useContext, useRef } from "react";

import Head from "next/head";
import Link from "next/link";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import ProductBox from "@/components/painel/produtos/ProductBox";
import ProductSortDropdown from "@/components/painel/produtos/ProductSortDropdown";

import { FilterInput, FilterRadioInput } from "@/components/elements/input/Input";
import { MessageModal } from "@/components/elements/modal/Modal";

import { Role } from "@/models/User";

import * as productsLib from "@/lib/products";

import { validateInputPriceChange, validateInputPriceBlur, parseInputPrice } from "@/utils/validation/client/price";
import { validateInputNumbersChange } from "@/utils/validation/client/numbers";

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
    NAME: {
        ASC: "name_asc",
        DESC: "name_desc"
    },
    PRICE: {
        ASC: "price_asc",
        DESC: "price_desc"
    },
    STOCK: {
        ASC: "stock_asc",
        DESC: "stock_desc"
    }
};

const sortOptionsLabels = {
    [sortOptions.NAME.ASC]: "Nome (A-Z)",
    [sortOptions.NAME.DESC]: "Nome (Z-A)",
    [sortOptions.PRICE.ASC]: "Preço (Crescente)",
    [sortOptions.PRICE.DESC]: "Preço (Decrecente)",
    [sortOptions.STOCK.ASC]: "Estoque (Crescente)",
    [sortOptions.STOCK.DESC]: "Estoque (Decrecente)"
};

function Produtos({ token }) {

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [baseAnimationDelay, setBaseAnimationDelay] = useState(600);
    const animationDelay = 50;

    const [products, setProducts] = useState(Array(15).fill(null));

    const fetchProducts = async () => {
            
        let response = await productsLib.getAll();

        if (response.status === 200) {
            setTimeout(() => { setProducts(response.products); setBaseAnimationDelay(0); }, 1600);
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

    useEffect(() => { fetchProducts(); }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);

    const [sortOption, setSortOption] = useState(sortOptions.NAME.ASC);

    const [filterPrice, setFilterPrice] = useState({ min: null, max: null });
    
    const [filterPriceMin, setFilterPriceMin] = useState("");
    const [filterPriceMax, setFilterPriceMax] = useState("");

    const handleSearch = async () => {
        let query = searchQuery.trim();
        
        // does the search
        setProducts([]);
    };

    const handleSearchChange = async (event) => {
        if (searchTimeout) { clearTimeout(searchTimeout); };

        let query = event.currentTarget.value;
        setSearchQuery(query);

        if (products && (products.length == 0 || products[0] != null)) { setProducts(Array(18).fill(null)); };
        
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
                <title>Painel | Produtos | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Produtos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de produtos do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl text-left slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Produtos</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Produtos</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">

                <div className="w-full flex flex-col-reverse xl:flex-row gap-4">

                    <div className={`flex w-full gap-6`}>

                        <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-neutral-800">
                                <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                            </svg>
                            <input onChange={handleSearchChange} id="query" name="query" type="text" placeholder="Pesquisar" className={`w-full font-lgc text-xl outline-none px-1 py-3 ${user?.role <= Role.MANAGER ? "xl:py-0" : ""}`}></input>
                        </div>

                    </div>

                    {
                        user?.role <= Role.MANAGER ? (
                            <div className="flex flex-col sm:flex-row justify-end items-center gap-6">
                                <Link href="/painel/produtos/adicionar" className="w-full xl:w-56 flex flex-row justify-start items-center gap-3 bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded-md px-4 py-3 transition-all smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>        
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M565.5-405.5q17 0 28.5-11.5t11.5-28.5v-80h80q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5h-80v-80q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5v80h-80q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5h80v80q0 17 11.5 28.5t28.5 11.5ZM328.37-237.37q-37.783 0-64.392-26.608-26.608-26.609-26.608-64.392v-474.26q0-37.783 26.608-64.392 26.609-26.609 64.392-26.609h474.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v474.26q0 37.783-26.609 64.392-26.609 26.608-64.392 26.608H328.37Zm-171 171q-37.783 0-64.392-26.608-26.609-26.609-26.609-64.392v-519.76q0-19.153 13.174-32.327 13.174-13.173 32.326-13.173 19.153 0 32.327 13.173 13.174 13.174 13.174 32.327v519.76h519.76q19.153 0 32.327 13.174 13.173 13.174 13.173 32.327 0 19.152-13.173 32.326Q696.283-66.37 677.13-66.37H157.37Z"/>
                                    </svg>
                                    <p className="text-black font-lgc font-bold text-xl">Adicionar</p>
                                </Link>

                                <Link href="/painel/produtos/estoque" className="w-full xl:w-64 flex flex-row justify-start items-center gap-3 bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded-md px-4 py-3 transition-all smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>        
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path d="M484.522-608.479q-17 0-28.5-11.5t-11.5-28.5v-80h-80q-17 0-28.5-11.5t-11.5-28.5q0-17 11.5-28.5t28.5-11.5h80v-80q0-17 11.5-28.5t28.5-11.5q17 0 28.5 11.5t11.5 28.5v80h80q17 0 28.5 11.5t11.5 28.5q0 17-11.5 28.5t-28.5 11.5h-80v80q0 17-11.5 28.5t-28.5 11.5ZM280-71.521q-33 0-56.5-23.5t-23.5-56.5q0-33 23.5-56.5t56.5-23.5q33 0 56.5 23.5t23.5 56.5q0 33-23.5 56.5t-56.5 23.5Zm400 0q-33 0-56.5-23.5t-23.5-56.5q0-33 23.5-56.5t56.5-23.5q33 0 56.5 23.5t23.5 56.5q0 33-23.5 56.5t-56.5 23.5Zm-400-200q-51.033 0-77.103-43.457-26.071-43.457-.81-87.544L254.391-496 114.913-791.521H80q-20.603 0-34.541-13.938Q31.52-819.397 31.52-840q0-20.603 13.938-34.541Q59.397-888.479 80-888.479h62.739q14.957 0 28.122 7.917 13.166 7.917 19.748 22.432L343.13-537.523h277.74l136.217-245.999q6.13-12.261 17.891-18.326 11.761-6.065 25.052-6.631 27.789-.565 41.967 23.674 14.177 24.24.351 49.327L703.87-486.522q-12.13 21.696-32.109 34.109Q651.783-440 626.522-440H333.609l-38.913 71.521H720q20.603 0 34.541 13.938 13.938 13.938 13.938 34.541 0 20.603-13.938 34.541-13.938 13.938-34.541 13.938H280Z"/>
                                    </svg>
                                    <p className="text-black font-lgc font-bold text-xl">Editar Estoques</p>
                                </Link>
                            </div>
                        ) : null
                    }

                </div>

                <p className={`${searchQuery == "" ? "hidden" : "block"} font-lgc text-lg fast-fade-in`}>Mostrando resultados para "<span className="font-bold">{searchQuery}</span>":</p>

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

                                <ProductSortDropdown 
                                    selectedSortOption={sortOption} setSortOption={setSortOption} 
                                    sortOptions={sortOptions} sortOptionsLabels={sortOptionsLabels}
                                    showDropdown={showSortDropdown}
                                />
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-6">

                            {
                                products.map((product, index) => {
                                    return <ProductBox product={product} animationDelay={baseAnimationDelay + (animationDelay * index)} key={index}/>
                                })
                            }

                        </div>

                        {
                            products.length == 0 ? (
                                <div className="w-full flex flex-col justify-center items-center gap-6 mt-16 fast-fade-in">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="slide-up-fade-in opacity-0">
                                        <path d="M286.525-73.029q-30.858 0-52.691-21.975Q212-116.978 212-147.837q0-30.858 21.975-52.691 21.975-21.834 52.833-21.834 30.859 0 52.692 21.975t21.833 52.833q0 30.859-21.975 52.692-21.974 21.833-52.833 21.833Zm402.667 0q-30.858 0-52.692-21.975-21.833-21.974-21.833-52.833 0-30.858 21.975-52.691 21.975-21.834 52.833-21.834 30.859 0 52.692 21.975T764-147.554q0 30.859-21.975 52.692t-52.833 21.833ZM480-589.638q-18.527 0-30.749-12.611-12.222-12.611-12.222-30.853t12.222-30.831q12.222-12.59 30.749-12.59t30.749 12.484q12.222 12.483 12.222 30.937 0 18.242-12.222 30.853T480-589.638Zm-37.101-144.87V-930.74h74.202v196.232h-74.202ZM286.667-277.695q-46.33 0-69.998-39.225-23.669-39.225-.408-79.515l56.971-102.898L129-806.362H88q-17.13 0-28.717-11.599-11.587-11.598-11.587-28.743 0-17.146 11.587-28.707 11.588-11.56 28.717-11.56h64.073q12.869 0 23.791 6.496 10.922 6.497 15.818 18.344l155.449 330.29h286.116l139.927-251.884q4.877-9.717 14.597-15.054 9.721-5.337 21.071-5.526 23.323-.188 34.907 19.819 11.585 20.008.135 40.631L703.986-491.768q-10.731 19.114-28.311 30.108-17.581 10.993-41.906 10.993h-295l-51.667 92.363h443.565q17.129 0 28.717 11.598 11.587 11.598 11.587 28.744 0 17.145-11.587 28.706-11.588 11.561-28.717 11.561h-444Z"/>
                                    </svg>
                                    <div className="flex flex-col text-center gap-1">
                                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Nenhum produto encontrado.</p>
                                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Tente novamente com outra pesquisa{user?.role <= Role.MANAGER ? ' ou começe adicionando produtos com o botão "Adicionar" acima' : ""}.</p>
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
                                <p className="font-lgc text-lg">Preço</p>
                                <p className="font-lgc text-neutral-600 text-xs cursor-pointer hover:underline">Limpar</p>
                            </div>
                            
                            <FilterRadioInput
                                name="price"
                                options={[
                                    { label: "Até R$ 8,00", value: { min: null, max: 8 } },
                                    { label: "Entre R$ 8,00 e R$ 16,00", value: { min: 8, max: 16 } },
                                    { label: "Entre R$ 16,00 e R$ 24,00", value: { min: 16, max: 24 } },
                                    { label: "Entre R$ 24,00 e R$ 32,00", value: { min: 24, max: 32 } },
                                    { label: "Acima de R$ 32,00", value: { min: 32, max: null } },
                                    { label: "Outro:", value: { min: filterPriceMin ?? null, max: filterPriceMax ?? null } },
                                ]}
                                onChange={(newValue) => { setFilterPrice(newValue); }}
                            />

                            <div className="w-full flex flex-row justify-between items-center gap-3 mt-2">
                                <FilterInput name="priceMin" label="Min" defaultValue="R$ " bgColor="bg-white" 
                                    onChange={({ target }) => { target.value = validateInputPriceChange(target.value); document.getElementsByName("price")[5].checked = true; }}
                                    onBlur={({ target }) => { target.value = validateInputPriceBlur(target.value); setFilterPriceMin(parseInputPrice(target.value)); }}
                                />

                                <div className="w-[20%] mb-1 border-b border-neutral-800"></div>

                                <FilterInput name="priceMax" label="Max" defaultValue="R$ " bgColor="bg-white" 
                                    onChange={({ target }) => { target.value = validateInputPriceChange(target.value); document.getElementsByName("price")[5].checked = true; }}
                                    onBlur={({ target }) => { target.value = validateInputPriceBlur(target.value); setFilterPriceMax(parseInputPrice(target.value)); }}
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col items-start justify-start p-4 gap-3 rounded-md border border-neutral-400 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                            
                            <div className="w-full flex flex-row justify-between items-center">
                                <p className="font-lgc text-lg">Estoque</p>
                                <p className="font-lgc text-neutral-600 text-xs cursor-pointer hover:underline">Limpar</p>
                            </div>
                            
                            <FilterRadioInput
                                name="stock"
                                options={[
                                    { label: "Fora de Estoque", value: "0" },
                                    { label: "Entre 1 a 10", value: "1" },
                                    { label: "Entre 11 a 30", value: "2" },
                                    { label: "Entre 30 a 50", value: "3" },
                                    { label: "Acima de 50", value: "4" },
                                    { label: "Outro:", value: "5" },
                                ]}
                            />

                            <div className="w-full flex flex-row justify-between items-center gap-3 mt-2">
                                <FilterInput name="stockMin" label="Min" bgColor="bg-white" 
                                    onChange={({ target }) => { target.value = validateInputNumbersChange(target.value); }}
                                    onBlur={({ target }) => { target.value = validateInputNumbersChange(target.value); }}
                                />

                                <div className="w-[20%] mb-1 border-b border-neutral-800"></div>

                                <FilterInput name="stockMax" label="Max" bgColor="bg-white" 
                                    onChange={({ target }) => { target.value = validateInputNumbersChange(target.value); }}
                                    onBlur={({ target }) => { target.value = validateInputNumbersChange(target.value); }}
                                />
                            </div>
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

Produtos.requiresUser = true;

Produtos.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Produtos"}>
            <Account/>
            {page}
        </Dashboard>
    );

};

export default Produtos;