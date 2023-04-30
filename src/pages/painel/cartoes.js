import Head from "next/head";

import Dashboard from "@/components/painel/Dashboard";

export default function Cartoes() {

    return (
        <>

            <Head>
                <title>Painel | Cartões | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Cartões | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de cartões do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

        </>
    );

};

Cartoes.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Cartões"}>
            {page}
        </Dashboard>
    );

}