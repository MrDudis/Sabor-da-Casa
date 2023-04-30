import Head from "next/head";

import Dashboard from "@/components/painel/Dashboard";

export default function Configuracoes() {

    return (
        <>

            <Head>
                <title>Painel | Configurações | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Configurações | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento e configurações do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

        </>
    );

};

Configuracoes.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Configurações"}>
            {page}
        </Dashboard>
    );

};