import Head from "next/head";

import Dashboard from "@/components/painel/Dashboard";

export default function Produtos() {

    return (
        <>

            <Head>
                <title>Painel | Produtos | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Produtos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de produtos do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

        </>
    );

};

Produtos.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Produtos"}>
            {page}
        </Dashboard>
    );

};