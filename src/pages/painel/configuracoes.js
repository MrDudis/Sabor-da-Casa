import Head from "next/head";

import Sidebar from "@/components/painel/Sidebar";

export default function Configuracoes() {

    return (
        <>

            <Head>
                <title>Painel | Configurações | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Configurações | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento e configurações do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="flex">

                <Sidebar activePage={"Configurações"}></Sidebar>

                <div className="w-full min-h-screen p-6 sm:p-10">

                    <div className="w-[90%] flex flex-col justify-center items-start border-b border-neutral-800">
                        <h1 className="font-lgc text-4xl pr-4 pb-3 text-center">Configurações</h1>
                    </div>

                </div>

            </div>

        </>
    );

};