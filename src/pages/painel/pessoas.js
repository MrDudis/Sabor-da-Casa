import Head from "next/head";

import Sidebar from "@/components/painel/Sidebar";

export function getStaticProps() {

    const people = [
        {
            "nome": "João",
            "sobrenome": "Silva",
            "email": "joao.silva@gmail.com",
            "telefone": "(11) 99999-9999",
            "cargo": "Gerente",
            "cpf": "123.456.789-00",
        },
        {
            "nome": "Maria",
            "sobrenome": "Silva",
            "email": "maria.silva@gmail.com",
            "telefone": "(11) 99999-9999",
            "cargo": "Funcionario",
            "cpf": "123.456.789-00"
        },
        {
            "nome": "José",
            "sobrenome": "Silva",
            "email": "jose.silva@gmail.com",
            "telefone": "(11) 99999-9999",
            "cargo": "Cliente",
            "cpf": "123.456.789-00"
        }
    ];

    return {
        props: {
            people
        }
    };

}

export default function Pessoas({ people }) {

    return (
        <>

            <Head>
                <title>Painel | Pessoas | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Pessoas | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de pessoas do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="flex">

                <Sidebar activePage={"Pessoas"}></Sidebar>

                <div className="w-full min-h-screen p-6 sm:p-10">

                    <div className="w-[90%] flex flex-col justify-center items-start border-b border-neutral-800">
                        <h1 className="font-lgc text-4xl pr-4 pb-3 text-center">Pessoas</h1>
                    </div>

                    <div className="flex flex-row justify-between gap-6 py-4">

                        <input className="w-[70%] h-12 px-4 font-lgc rounded-lg bg-neutral-100 outline-none" placeholder="Pesquisar"></input>

                        <button className="w-[30%] h-12 px-4 font-lgc rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-all">Adicionar</button>

                    </div>

                    <div className="flex flex-col items-start justify-start gap-6 mt-2">

                        {
                            people.map((person, index) => (
                                <div key={index} className="flex flex-row justify-between w-full h-20 px-4 py-2 bg-neutral-100 rounded-lg">
                                    <div className="flex flex-col justify-center items-start gap-1">
                                        <h1 className="font-lgc text-lg">{person.nome} {person.sobrenome}</h1>
                                        <h1 className="font-lgc text-sm">{person.cargo}</h1>
                                    </div>
                                    <div className="flex flex-col justify-center items-start gap-1">
                                        <h1 className="font-lgc text-sm">{person.email}</h1>
                                        <h1 className="font-lgc text-sm">{person.telefone}</h1>
                                    </div>
                                    <div className="flex flex-col justify-center items-start gap-1">
                                        <h1 className="font-lgc text-sm">{person.cpf}</h1>
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                </div>

            </div>

        </>
    );

};