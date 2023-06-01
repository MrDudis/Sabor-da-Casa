import Head from "next/head";
import { useRef, useState } from "react";

import { AdvancedInput } from "@/components/elements/input/Input";

import * as authLib from "@/lib/auth";

export function getServerSideProps({ req, res }) {

    if (req.cookies.token) {
        res.writeHead(302, { Location: "/painel" });
        res.end();
    };

    return {
        props: {}
    };

};

export default function Login() {

    const loginErrorBox = useRef(null);
    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    
    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        setLoginLoading(true);
      
        const formData = new FormData(event.target);

        const loginData = {
            userinfo: formData.get("userinfo"),
            password: formData.get("password")
        };
        
        let response = await authLib.login(loginData.userinfo, loginData.password);

        if (response.status === 200) {

            let urlParams = new URLSearchParams(window.location.search);

            if (urlParams.get("r")) {
                window.location.href = urlParams.get("r");
            } else {
                window.location.href = "/painel";
            };

        } else {
            setLoginErrorMessage(response?.message ?? "Erro desconhecido.");

            let errorBoxClassList = loginErrorBox.current.classList;

            if (errorBoxClassList.contains("hidden")) {
                errorBoxClassList.remove("hidden"); errorBoxClassList.add("flex");

                errorBoxClassList.add("login-error-box-slide-in");
                setTimeout(() => { errorBoxClassList.remove("login-error-box-slide-in") }, 400);
            } else {
                errorBoxClassList.add("login-error-box-shake");
                setTimeout(() => { errorBoxClassList.remove("login-error-box-shake") }, 400);
            };
            
        };

        setTimeout(() => { setLoginLoading(false) }, 500);
    };

    return (
        <>

            <Head>
                <title>Login | Sabor da Casa</title>
                <meta property="og:title" content="Login | Sabor da Casa" key="title" />
                <meta name="og:description" content="Acesso a Área restrita do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full h-screen flex justify-center items-center login-background-move bg-white bg-500 bg-center bg-repeat" style={{ backgroundImage: `url("/images/seamless-pattern-with-kitchen-tools-doodles.jpg")` }}>

                <div className="w-full h-full flex flex-col justify-center items-center" style={{ background: "rgba(255, 255, 255, 0.6)" }}>
                
                    <div className="w-full md:w-[443px] lg:w-[986px] h-screen md:h-[548px] flex flex-row bg-white md:rounded-md transition-all md:fade-in-zoom-out border-2 lg:border-0 lg:login-shadow">

                        <div className="w-0 lg:w-[45%] h-full">
                            <div className="w-full h-full bg-white bg-cover bg-center bg-no-repeat rounded-l-md" style={{ backgroundImage: `url("/images/culinaria-mineira-cpt.jpg")` }}></div>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="w-full lg:w-[55%] h-full flex flex-col justify-center items-start gap-4 px-10 py-12 max-md:fade-in">

                            <div className="w-full flex items-center justify-center mb-4">
                                <h1 className="font-august text-black text-5xl text-center cursor-pointer" onClick={() => { window.location.href = "/" }}>Sabor da Casa</h1>
                            </div>

                            <div className="w-full flex flex-col justify-center items-start gap-0">

                                <div className="flex flex-col justify-center items-start">
                                    <h2 className="font-lgc text-neutral-900 text-2xl">Área Restrita</h2>
                                    <p className="font-lgc text-neutral-900 text-md">Acesse a Área Restrita do Restaurante Sabor da Casa.</p>
                                </div>

                                <div ref={loginErrorBox} className={`bg-red-500 hidden flex-row justify-start items-center gap-2 w-full px-3 py-2 mt-6 rounded-lg`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                                        <path d="M480 776q17 0 28.5-11.5T520 736q0-17-11.5-28.5T480 696q-17 0-28.5 11.5T440 736q0 17 11.5 28.5T480 776Zm0-160q17 0 28.5-11.5T520 576V416q0-17-11.5-28.5T480 376q-17 0-28.5 11.5T440 416v160q0 17 11.5 28.5T480 616Zm0 360q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Z"/>
                                    </svg>
                                    <p className="font-lgc text-white text-lg">{loginErrorMessage}</p>
                                </div>

                                <div className="w-full flex flex-col gap-2 mt-7">
                                    <AdvancedInput name="userinfo" label="E-mail ou CPF" type="text" bgColor="bg-white"></AdvancedInput>
                                </div>

                                <div className="w-full flex flex-col gap-2 mt-7">
                                    <AdvancedInput name="password" label="Senha" type="password" bgColor="bg-white"></AdvancedInput>

                                    <div className="w-full flex flex-row justify-end items-center">
                                        <a className="font-lgc text-neutral-900 text-md hover:text-red-600 hover:underline" href="#">Esqueceu a senha?</a>
                                    </div>
                                </div>

                            </div>

                            <div className="w-full flex flex-row justify-center items-center mt-2">
                                <button disabled={loginLoading} className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                    { loginLoading ? (
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white fast-fade-in">
                                            <path d="M361.761 754.652q-12.674-14.434-12.674-33.087 0-18.652 12.674-31.326L430.5 621.5H154.022q-19.153 0-32.327-13.174T108.521 576q0-19.152 13.174-32.326t32.327-13.174H430.5l-68.979-68.978q-13.434-13.435-13.315-32.087.12-18.653 13.555-32.087 12.674-13.435 31.445-13.435 18.772 0 31.446 12.674l147.826 147.587q6.718 6.717 9.576 14.793 2.859 8.076 2.859 17.033t-2.859 17.033q-2.858 8.076-9.576 14.793L424.413 755.652q-13.435 13.435-31.707 12.555-18.271-.881-30.945-13.555Zm161.826 189.479q-19.152 0-32.326-13.174t-13.174-32.327q0-19.152 13.174-32.326t32.326-13.174h236.891V298.87H523.587q-19.152 0-32.326-13.174t-13.174-32.326q0-19.153 13.174-32.327t32.326-13.174h236.891q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v554.26q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H523.587Z"/>
                                        </svg>
                                    ) }
                                    { loginLoading ? "Entrando..." : "Entrar" }
                                </button>
                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </>
    );

};