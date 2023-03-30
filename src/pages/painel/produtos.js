import Head from "next/head";

import Sidebar from "@/components/painel/Sidebar";

export function getStaticProps() {

    const products = [
        {
            "nome": "Café",
            "descricao": "Café com leite",
            "preco": 5.00,
            "categoria": "Bebidas"
        },
        {
            "nome": "Achocolatado",
            "descricao": "Achocolatado com leite",
            "preco": 5.00,
            "categoria": "Bebidas"
        },
        {
            "nome": "Suco de Laranja",
            "descricao": "Suco de laranja natural",
            "preco": 5.00,
            "categoria": "Bebidas"
        },
        {
            "nome": "Suco de Uva",
            "descricao": "Suco de uva natural",
            "preco": 5.00,
            "categoria": "Bebidas"
        },
        {
            "nome": "Torrada",
            "descricao": "Torrada com manteiga",
            "preco": 5.00,
            "categoria": "Salgados"
        },
        {
            "nome": "Pão de Queijo",
            "descricao": "Pão de queijo com manteiga",
            "preco": 5.00,
            "categoria": "Salgados"
        }
    ];

    return {
        props: {
            products
        }
    };

}

export default function Produtos({ products }) {

    return (
        <>

            <Head>
                <title>Painel | Produtos | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Produtos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de produtos do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="flex">

                <Sidebar activePage={"Produtos"}></Sidebar>

                <div className="w-full min-h-screen p-6 sm:p-10 overflow-auto max-h-screen">

                    <div className="w-[90%] flex flex-col justify-center items-start border-b border-neutral-800">
                        <h1 className="font-lgc text-4xl pr-4 pb-3 text-center">Produtos</h1>
                    </div>

                    <div className="flex flex-row justify-between gap-6 py-4">

                        <input className="w-[70%] h-12 px-4 font-lgc rounded-lg bg-neutral-100 outline-none" placeholder="Pesquisar"></input>

                        <button className="w-[30%] h-12 px-4 font-lgc rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-all">Adicionar</button>

                    </div>

                    <div className="flex flex-col items-start justify-start gap-6 mt-2">

                        {
                            products.map((product, index) => (
                                <div key={index} className="flex flex-col items-start justify-start rounded-lg bg-neutral-200 p-4 w-full">
                                    <h1 className="font-lgc text-2xl">{product.nome}</h1>
                                    <p className="font-lgc text-lg">{product.descricao}</p>
                                    <p className="font-lgc text-lg">R$ {product.preco}</p>
                                    <p className="font-lgc text-lg">{product.categoria}</p>
                                </div>
                            ))
                        }

                    </div>

                </div>

            </div>

        </>
    );

};