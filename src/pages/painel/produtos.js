import { useState, useEffect, useContext } from "react";
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

    const baseAnimationDelay = 400;
    const animationDelay = 50;

    const fetchProduts = async () => {
            
        let response = await getAll();

        if (response.status === 200) {console.log(response)
            setTimeout(() => { setProducts(response.products); }, 1800);
        } else {
            alert(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchProduts(); }, [])

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

            <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6 gap-6">

                {
                    products.map((product, index) => {
                        return <ProductBox product={product} animationDelay={baseAnimationDelay + (animationDelay * index)} key={index}></ProductBox>
                    })
                }

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