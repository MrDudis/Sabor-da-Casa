import Head from "next/head";

import Dashboard from "@/components/painel/Dashboard";

export default function Pessoas() {

    return (
        <>

            <Head>
                <title>Painel | Pessoas | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Pessoas | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de pessoas do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

        </>
    );

};

Pessoas.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Pessoas"}>
            {page}
        </Dashboard>
    );

};