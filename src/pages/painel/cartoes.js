import { useEffect, useContext } from "react";

import Head from "next/head";
import Link from "next/link";

import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {
            token: req.cookies.token
        }
    };

};

function Cartoes({ token }) {

    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    return (
        <>

            <Head>
                <title>Painel | Cartões | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Cartões | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de cartões do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl text-left slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Cartões</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Cartões</p>
                    </p>
                </div>
            </div>

        </>
    );

};

Cartoes.requiresUser = true;

Cartoes.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Cartões"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Cartoes;