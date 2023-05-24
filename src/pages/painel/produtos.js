import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";

import UserContext from "@/components/painel/user/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import ProductBox from "@/components/painel/produtos/ProductBox";

import getAll from "@/lib/products/all";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {}
    };

};

function Produtos() {

    const { user } = useContext(UserContext);

    const [products, setProducts] = useState(Array(15).fill(null));
    useEffect(() => { if (!products || products.length == 0) { setProducts(Array(18).fill(null)); }; }, [products]);

    const baseAnimationDelay = 800;
    const animationDelay = 50;

    const fetchProduts = async () => {
            
        let response = await getAll();

        if (response.status === 200) {
            setTimeout(() => { setProducts(response.products); }, 2000);
        } else {
            alert(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchProduts(); }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);

    const handleSearch = async (query) => {

        setSearchQuery(query);
        if (query == "") { return fetchProduts(); };
        
        // does the search

    };

    const handleSearchChange = async (event) => {
        if (searchTimeout) { clearTimeout(searchTimeout); };

        let query = event.currentTarget.value;

        if (products && products[0] != null) { setProducts([]); };
        
        let timeout = setTimeout(() => { handleSearch(query); }, 500);
        setSearchTimeout(timeout); 
        
    };

    return (
        <>

            <Head>
                <title>Painel | Produtos | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Produtos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de produtos do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <h1 className="font-lgc text-3xl sm:text-4xl pr-4 pb-3 text-left slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>Produtos</h1>
            </div>

            <div className="flex flex-col gap-6 mt-6">

                <div className="w-full flex flex-col sm:flex-row gap-6">

                    <div className="flex w-full sm:w-[70%] gap-6">

                        <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-neutral-800">
                                <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                            </svg>
                            <input onChange={handleSearchChange} id="query" name="query" type="text" placeholder="Pesquisar" className="w-full font-lgc text-xl outline-none px-1"></input>
                        </div>

                    </div>

                    <Link href="/painel/produtos/adicionar" className="w-full min-w-[190px] sm:w-[30%] flex flex-row justify-start items-center gap-3 bg-neutral-100 border border-neutral-400 cursor-pointer hover:bg-neutral-50 hover:shadow-xl rounded-md px-4 py-3 transition-all smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>        
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M565.5-405.5q17 0 28.5-11.5t11.5-28.5v-80h80q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5h-80v-80q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5v80h-80q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5h80v80q0 17 11.5 28.5t28.5 11.5ZM328.37-237.37q-37.783 0-64.392-26.608-26.608-26.609-26.608-64.392v-474.26q0-37.783 26.608-64.392 26.609-26.609 64.392-26.609h474.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v474.26q0 37.783-26.609 64.392-26.609 26.608-64.392 26.608H328.37Zm-171 171q-37.783 0-64.392-26.608-26.609-26.609-26.609-64.392v-519.76q0-19.153 13.174-32.327 13.174-13.173 32.326-13.173 19.153 0 32.327 13.173 13.174 13.174 13.174 32.327v519.76h519.76q19.153 0 32.327 13.174 13.173 13.174 13.173 32.327 0 19.152-13.173 32.326Q696.283-66.37 677.13-66.37H157.37Z"/>
                        </svg>
                        <p className="text-black font-lgc font-bold text-xl">Adicionar</p>
                    </Link>

                </div>

                <p className={`${searchQuery == "" ? "hidden" : "block"} font-lgc text-lg`}>Mostrando resultados para "<span className="font-bold">{searchQuery}</span>":</p>


                <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">

                    {
                        products.map((product, index) => {
                            return <ProductBox product={product} animationDelay={baseAnimationDelay + (animationDelay * index)} key={index}></ProductBox>
                        })
                    }

                </div>
                
            </div>

        </>
    );

};

Produtos.requiresUser = true;

Produtos.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Produtos"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Produtos;