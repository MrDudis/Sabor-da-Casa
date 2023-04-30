import Head from "next/head";

import Dashboard from "@/components/painel/Dashboard";

export default function Painel() {

    return (
        <>

            <Head>
                <title>Painel | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento e Área Restrita do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

        </>
    );

};

Painel.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Início"}>
            {page}
        </Dashboard>
    );

};