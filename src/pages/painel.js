import Head from "next/head";

import Sidebar from "@/components/painel/Sidebar";

export default function Painel() {

    return (
        <>

            <Head>
                <title>Painel | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento e Área Restrita do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="flex">

                <Sidebar activePage={"Início"}></Sidebar>

                <div className="w-full min-h-screen flex flex-col items-start justify-start p-6 sm:p-10">

                    <div className="w-[90%] flex flex-col justify-center items-start border-b border-neutral-800">
                        <h1 className="font-lgc text-4xl pr-4 pb-3 text-center">Início</h1>
                    </div>

                    <p className="font-lgc text-xl pt-4 pr-4 pb-3 text-start">
                        Bem-vindo ao painel de gerenciamento do Restaurante Sabor da Casa. <br></br>
                        Aqui você pode gerenciar os cartões, pessoas e produtos do restaurante. <br></br> <br></br>
                        Atualmente essa é apenas uma versão de demonstração, não funcional. <br></br>
                        Use o painel a esquerda (ou abaixo em dispositivos móveis) para navegar entre as páginas. <br></br> <br></br>
                        O design e funções do painel podem (e serão) ser alterados a qualquer momento. <br></br> <br></br>
                        A princípio, em cada categoria do painel, você verá uma lista de itens, com a opção de pesquisar e adicionar novos itens. <br></br>
                        Ao clicar em um item, você será redirecionado para uma página com mais informações sobre ele e a opção de editar ele. <br></br>
                        Ao clicar em "Adicionar novo item", um modal será aberto para que você possa adicionar um novo item. <br></br> <br></br>
                        Nessa área de Início, o usuário poderá ver informações gerais sobre o restaurante, botões para fácil acesso das outras áreas do painel, etc <br></br> <br></br>
                    </p>

                </div>

            </div>

        </>
    );

};