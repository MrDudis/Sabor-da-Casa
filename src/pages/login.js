import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import styles from "@/styles/Login.module.css";

import login from "@/lib/auth/login";

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

    const errorBox = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    
    const handleSubmit = async (event) => {
        event.preventDefault();
      
        const formData = new FormData(event.target);
      
        let response = await login(formData.get("userinfo"), formData.get("password"));

        if (response.status === 200) {
            window.location.href = "/painel";
        } else {
            setErrorMessage(response?.message ?? "Erro desconhecido.");

            if (errorBox.current.classList.contains("hidden")) {
                errorBox.current.classList.remove("hidden");
                errorBox.current.classList.add("flex");
                errorBox.current.classList.add("login-error-box-slide-in");
                setTimeout(() => { errorBox.current.classList.remove("login-error-box-slide-in") }, 400);
            } else {
                errorBox.current.classList.add("login-error-box-shake");
                setTimeout(() => { errorBox.current.classList.remove("login-error-box-shake") }, 400);
            };
            
        };

    };

    return (
        <>

            <Head>
                <title>Login | Sabor da Casa</title>
                <meta property="og:title" content="Login | Sabor da Casa" key="title" />
                <meta name="og:description" content="Acesso a Área restrita do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className={styles.loginBackground}>

                <div className="w-full h-full flex flex-col justify-center items-center" style={{ background: "rgba(255, 255, 255, 0.6)" }}>
                
                    <div className="w-full md:w-[443px] lg:w-[986px] h-screen md:h-[548px] flex flex-row bg-white md:rounded-md transition-all md:fade-in-zoom-out border-2 lg:border-0 lg:login-shadow">

                        <div className="w-0 lg:w-[45%] h-full">
                            <div className={styles.loginImage}></div>
                        </div>

                        <form className="w-full lg:w-[55%] h-full flex flex-col justify-center items-start gap-4 px-10 py-12 max-md:fade-in" onSubmit={handleSubmit}>

                            <div className="w-full flex items-center justify-center mb-4">
                                <h1 className="font-august text-black text-5xl text-center cursor-pointer" onClick={() => { window.location.href = "/" }}>Sabor da Casa</h1>
                            </div>

                            <div className="w-full flex flex-col justify-center items-start gap-0">

                                <div className="flex flex-col justify-center items-start">
                                    <h2 className="font-lgc text-neutral-900 text-2xl">Área Restrita</h2>
                                    <p className="font-lgc text-neutral-900 text-md">Acesse a Área Restrita do Restaurante Sabor da Casa.</p>
                                </div>

                                <div ref={errorBox} className={`bg-red-500 hidden flex-row justify-start items-center gap-2 w-full px-3 py-2 mt-6 rounded-lg`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                                        <path d="M480 776q17 0 28.5-11.5T520 736q0-17-11.5-28.5T480 696q-17 0-28.5 11.5T440 736q0 17 11.5 28.5T480 776Zm0-160q17 0 28.5-11.5T520 576V416q0-17-11.5-28.5T480 376q-17 0-28.5 11.5T440 416v160q0 17 11.5 28.5T480 616Zm0 360q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Z"/>
                                    </svg>
                                    <p className="font-lgc text-white text-lg">{errorMessage}</p>
                                </div>

                                <div className={styles.formDiv}>
                                    <input className={styles.formInput} id="cpf" name="userinfo" type="text" placeholder=" "></input>
                                    <label className={styles.formLabel} htmlFor="cpf"><span className={styles.formInputSpan}>E-mail ou CPF</span></label>
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <div className={styles.formDiv}>
                                        <input className={styles.formInput} id="password" name="password" type="password" placeholder=" "></input>
                                        <label className={styles.formLabel} htmlFor="password"><span className={styles.formInputSpan}>Senha</span></label>
                                    </div>

                                    <div className="w-full flex flex-row justify-end items-center">
                                        <a className="font-lgc text-neutral-900 text-md hover:text-red-600 hover:underline" href="#">Esqueceu a senha?</a>
                                    </div>
                                </div>

                            </div>

                            <div className="w-full flex flex-row justify-center items-center mt-2">
                                <button className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all" type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                                        <path d="M361.761 754.652q-12.674-14.434-12.674-33.087 0-18.652 12.674-31.326L430.5 621.5H154.022q-19.153 0-32.327-13.174T108.521 576q0-19.152 13.174-32.326t32.327-13.174H430.5l-68.979-68.978q-13.434-13.435-13.315-32.087.12-18.653 13.555-32.087 12.674-13.435 31.445-13.435 18.772 0 31.446 12.674l147.826 147.587q6.718 6.717 9.576 14.793 2.859 8.076 2.859 17.033t-2.859 17.033q-2.858 8.076-9.576 14.793L424.413 755.652q-13.435 13.435-31.707 12.555-18.271-.881-30.945-13.555Zm161.826 189.479q-19.152 0-32.326-13.174t-13.174-32.327q0-19.152 13.174-32.326t32.326-13.174h236.891V298.87H523.587q-19.152 0-32.326-13.174t-13.174-32.326q0-19.153 13.174-32.327t32.326-13.174h236.891q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v554.26q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H523.587Z"/>
                                    </svg>
                                    Entrar
                                </button>
                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </>
    );

};