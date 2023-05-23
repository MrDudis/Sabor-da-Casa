import { useState, useEffect, useContext } from "react";
import Head from "next/head";

import UserContext from "@/components/painel/user/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";
import Link from "next/link";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {}
    };

};

function Produto() {

    const { user } = useContext(UserContext);

    return (
        <>

            <Head>
                <title>Painel | Produto | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Produtos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de produto do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start gap-4 border-b border-neutral-800 scale-right-to-left">
                <h1 className="font-lgc text-3xl sm:text-4xl pr-4 pb-3 text-left slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>Nome do Produto</h1>
            </div>

            <div className="w-full mt-6">
                <Link href="/painel/produtos" className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "0.6s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                    </svg>
                    <p className="font-lgc text-lg">Voltar</p>
                </Link>
            </div>   

        </>
    );

};

Produto.requiresUser = true;

Produto.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Produtos"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Produto;