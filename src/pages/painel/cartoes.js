import Head from "next/head";

import Sidebar from "@/components/painel/Sidebar";

export default function Cartoes() {

    return (
        <>

            <Head>
                <title>Painel | Cartões | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Cartões | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de cartões do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="flex">

                <Sidebar activePage={"Cartões"}></Sidebar>

                <div className="w-full min-h-screen p-6 sm:p-10">

                    <div className="w-[90%] flex flex-col justify-center items-start border-b border-neutral-800">
                        <h1 className="font-lgc text-4xl pr-4 pb-3 text-center">Cartões</h1>
                    </div>

                    <div className="flex flex-row justify-between gap-6 py-4">

                        <input className="w-[70%] h-12 px-4 font-lgc rounded-lg bg-neutral-100 outline-none" placeholder="Pesquisar"></input>

                        <button className="w-[30%] h-12 px-4 font-lgc rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-all">Adicionar</button>

                    </div>

                </div>

            </div>

        </>
    );

};