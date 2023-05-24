import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";

import UserContext from "@/components/painel/user/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import input from "@/styles/Input.module.css";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {}
    };

};

function AdicionarProduto() {

    const { user } = useContext(UserContext);

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
    };

    return (
        <>

            <Head>
                <title>Painel | Adicionar Produto | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Produtos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel para adicionar produtos no Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start gap-6 border-b border-neutral-800 scale-right-to-left">
                <Link href="/painel/produtos" className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                    </svg>
                    <p className="font-lgc text-lg">Voltar</p>
                </Link>
                <h1 className="font-lgc text-3xl sm:text-4xl pr-4 pb-3 text-left slide-up-fade-in opacity-0" style={{ animationDelay: "0.6s" }}>Adicionar um Produto</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <div className="w-full md:w-[60%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="m620-283.609 191.782-191.782q12.435-12.435 31.348-12.435 18.913 0 31.348 12.435 12.435 12.434 12.316 31.228-.12 18.793-12.555 31.228L652.065-190.522q-13.761 13.674-32.108 13.674-18.348 0-32.022-13.674L477.522-300.935q-12.435-12.435-12.435-31.228 0-18.794 12.435-31.228 12.435-12.435 31.348-12.435 18.913 0 31.348 12.435L620-283.609Zm-417.13 171.74q-37.538 0-64.269-26.732-26.732-26.731-26.732-64.269v-554.26q0-37.538 26.732-64.269 26.731-26.732 64.269-26.732h157.912q12.435-35.717 45.936-58.456 33.5-22.739 73.282-22.739 41.196 0 74.37 22.739 33.174 22.739 45.848 58.456H757.13q37.538 0 64.269 26.732 26.732 26.731 26.732 64.269v151.63q0 19.152-13.174 32.326T802.63-560q-19.152 0-32.326-13.174T757.13-605.5v-151.63h-78.326v78.326q0 19.152-13.174 32.326t-32.326 13.174H326.696q-19.152 0-32.326-13.174t-13.174-32.326v-78.326H202.87v554.26H394.5q19.152 0 32.326 13.174T440-157.37q0 19.153-13.174 32.327T394.5-111.869H202.87ZM480-760.717q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Informações do Produto</h1>
                    </div>

                    <form onSubmit={handleUpdateSubmit} className="w-full flex flex-col gap-8 px-4 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "1000ms" }}>

                        <div className="w-full flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                                <path d="M774.261 459.218 601.435 287.826l52.608-53.174q25.261-25.261 61.587-25.826 36.327-.565 63.849 25.826l48.086 47.522q27.522 26.391 26.826 62-.695 35.609-25.956 60.87l-54.174 54.174ZM169.044 945.044q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-97.738q0-10.826 3.848-20.305 3.848-9.478 12.109-17.739l411.435-411.435 173.391 172.826-411.435 411.435q-8.261 8.261-18.021 12.109-9.761 3.848-20.588 3.848h-97.738Z"/>
                            </svg>
                            <h1 className="font-lgc font-bold text-xl">Adicionar Informações</h1>
                        </div>
                        
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col xl:flex-row gap-5">
                                <div className={input.advancedInputDiv}>
                                    <input className={input.advancedInput} id="name" name="name" type="text" placeholder=" "></input>
                                    <label className={input.advancedInputLabel} htmlFor="name"><span className="px-1 bg-neutral-100">Nome</span></label>
                                </div>

                                <div className={input.advancedInputDiv}>
                                    <input className={input.advancedInput} id="price" name="price" type="text" placeholder=" "></input>
                                    <label className={input.advancedInputLabel} htmlFor="price"><span className="px-1 bg-neutral-100">Preço</span></label>
                                </div>
                            </div>

                            <div className={input.advancedInputDiv}>
                                <input className={input.advancedInput} id="description" name="description" type="text" placeholder=" "></input>
                                <label className={input.advancedInputLabel} htmlFor="description"><span className="px-1 bg-neutral-100">Descrição</span></label>
                            </div>
                        </div>

                        <div className="w-full flex flex-row justify-end items-center mt-2">
                            <button className="w-full xl:w-[35%] lg::max-w-sm flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white">
                                    <path d="M480-194.5q-19.152 0-32.326-13.174T434.5-240v-194.5H240q-19.152 0-32.326-13.174T194.5-480q0-19.152 13.174-32.326T240-525.5h194.5V-720q0-19.152 13.174-32.326T480-765.5q19.152 0 32.326 13.174T525.5-720v194.5H720q19.152 0 32.326 13.174T765.5-480q0 19.152-13.174 32.326T720-434.5H525.5V-240q0 19.152-13.174 32.326T480-194.5Z"/>
                                </svg>
                                Adicionar
                            </button>
                        </div>
                        
                    </form>

                </div>

                <div className="w-full md:w-[40%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "1000ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M577.652-96.348Q551.304-70 513-70t-64.652-26.348l-352-352q-12.674-12.674-20.011-29.587T69-514v-286q0-37.544 26.728-64.272Q122.456-891 160-891h286q19.152 0 36.065 7.337 16.913 7.337 29.587 20.011l352 352.761Q890-484.544 890-446.62t-26.348 64.272l-286 286ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Cartão do Produto</h1>
                    </div>

                    <div className="w-full xl:max-w-sm flex flex-col items-start justify-start h-96 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "1400ms" }}>

                    <div className="w-full h-[45%] bg-center bg-cover bg-neutral-200 rounded-t-md"
                        style={{ backgroundImage: `url('')` }}
                    ></div>

                    <div className="w-full h-[55%] flex flex-col items-start justify-start px-6 py-5 gap-4">
                        <div className="w-full truncate-4-line">
                            <h2 className="font-lgc font-bold">NOME</h2>
                            <p className="font-lgc text-[16px] text-neutral-800">Nome do Produto</p>
                        </div>

                        <div className="w-full truncate-4-line">
                            <h2 className="font-lgc font-bold">DESCRIÇÃO</h2>
                            <p className="font-lgc text-[16px] text-neutral-800">Descrição do Produto</p>
                        </div>

                        <div className="w-full truncate-4-line">
                            <h2 className="font-lgc font-bold">PREÇO</h2>
                            <p className="font-lgc text-[16px] text-neutral-800">Preço do Produto</p>
                        </div>
                    </div>

                    </div>

                </div>

            </div>   

        </>
    );

};

AdicionarProduto.requiresUser = true;

AdicionarProduto.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Produtos"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default AdicionarProduto;