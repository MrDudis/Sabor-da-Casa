import styles from "@/styles/Index.module.css";

import { useEffect } from "react";

export default function HeroSection() {

    function scrollToElement(elementId) {

        const element = document.getElementById(elementId);
        const topPos = element.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
            top: topPos,
            behavior: "smooth"
        });

    };

    return (
        <div className={styles.heroBackground}>

            <div className="w-full h-full flex flex-col justify-between items-center background-fade-in" style={{ background: "rgba(0, 0, 0, 0.8)" }}>

                <div className="w-full px-6 sm:px-8 xl:px-16 py-10 flex flex-row justify-between items-center slide-down">

                    <div className="cursor-pointer">
                        <h1 className="font-august text-white text-4xl px-4">Sabor da Casa</h1>
                    </div>

                    <div className="hidden lg:flex flex-row justify-center items-center gap-4 xl:gap-10">

                        <a className="font-lgc text-white text-xl cursor-pointer hover:text-neutral-200 transition-all" onClick={() => { scrollToElement("cardapio") }}>Cardápio</a>
                        <p className="text-white">•</p>
                        <a className="font-lgc text-white text-xl cursor-pointer hover:text-neutral-200 transition-all" onClick={() => { scrollToElement("avaliacoes") }}>Avaliações</a>
                        <p className="text-white">•</p>
                        <a className="font-lgc text-white text-xl cursor-pointer hover:text-neutral-200 transition-all" onClick={() => { scrollToElement("localizacao") }}>Localização</a>
                        <p className="text-white">•</p>
                        <a className="font-lgc text-white text-xl cursor-pointer hover:text-neutral-200 transition-all" onClick={() => { scrollToElement("contato") }}>Contato</a>
                    
                    </div>

                    <div className="hidden lg:block pl-8">

                        <button className="flex flex-row gap-2 justify-center items-center bg-white px-4 py-2 font-lgc text-black shadow-lg rounded-md hover:bg-neutral-200 hover:scale-[102%] transition-all" onClick={() => { window.location.href = "/login" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20">
                                <path d="M478.087 920.131V837.13h266.391V314.87H478.087v-83.001h266.391q34.483 0 58.742 24.259t24.259 58.742v522.26q0 34.483-24.259 58.742t-58.742 24.259H478.087Zm-77.261-164.652-58.892-58.414L421.5 617.5H132.521v-83H421.5l-79.566-79.565 58.892-58.414L580.304 576 400.826 755.479Z"/>
                            </svg>
                            Área Restrita
                        </button>

                    </div>

                    <div className="block lg:hidden">
                        
                        <button className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40" className="fill-white hover:fill-neutral-200 transition-all">
                                <path d="M153.333 816q-14.166 0-23.75-9.617Q120 796.766 120 782.55q0-14.216 9.583-23.716 9.584-9.5 23.75-9.5h653.334q14.166 0 23.75 9.617Q840 768.568 840 782.784q0 14.216-9.583 23.716-9.584 9.5-23.75 9.5H153.333Zm0-206.667q-14.166 0-23.75-9.617Q120 590.099 120 575.883q0-14.216 9.583-23.716 9.584-9.5 23.75-9.5h653.334q14.166 0 23.75 9.617Q840 561.901 840 576.117q0 14.216-9.583 23.716-9.584 9.5-23.75 9.5H153.333Zm0-206.667q-14.166 0-23.75-9.617Q120 383.432 120 369.216q0-14.216 9.583-23.716 9.584-9.5 23.75-9.5h653.334q14.166 0 23.75 9.617Q840 355.234 840 369.45q0 14.216-9.583 23.716-9.584 9.5-23.75 9.5H153.333Z"/>
                            </svg>
                        </button>

                    </div>
                    
                </div>

                <div className="flex flex-col justify-center items-center gap-2 px-4 md:px-10">

                    <h1 className="font-sinoreta text-white text-center text-6xl fade-in">Descubra a sua próxima refeição.</h1>
                    <p className="font-lgc text-white text-center text-2xl fade-in">Aqui você encontra o melhor da culinária brasileira.</p>

                </div>

                <div className="flex flex-row justify-center items-center pb-24 md:pb-28 gap-4 animate-bounce">

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                        <path d="M480 899.587 156.413 576l63.891-64.891L434.5 725.304V252.413h91v472.891l214.196-214.195L803.587 576 480 899.587Z"/>
                    </svg>

                </div>

            </div>

        </div>
    );

};