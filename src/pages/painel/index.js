import { useContext } from "react";
import Head from "next/head";

import UserContext from "@/components/painel/user/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {}
    };

};

function Painel() {

    const { user } = useContext(UserContext);

    return (
        <>

            <Head>
                <title>Painel | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento e Área Restrita do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <h1 className="font-lgc text-3xl sm:text-4xl pr-4 pb-3 text-left slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>Início</h1>
            </div>

        </>
    );

};

Painel.requiresUser = true;

Painel.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Início"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Painel;