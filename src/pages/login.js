import Head from "next/head";

import styles from "@/styles/Login.module.css";

export default function Login() {

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
                
                    <div className="w-full md:w-[443px] lg:w-[986px] h-screen md:h-[512px] flex flex-row bg-white md:rounded-md transition-all md:fade-in-zoom-out border-2 lg:border-0 lg:login-shadow">

                        <div className="w-0 lg:w-[45%] h-full">
                            <div className={styles.loginImage}></div>
                        </div>

                        <div className="w-full lg:w-[55%] h-full flex flex-col justify-center items-start gap-8 px-10 py-12 max-md:fade-in">

                            <div className="w-full flex items-center justify-center">
                                <h1 className="font-august text-black text-5xl text-center cursor-pointer" onClick={() => { window.location.href = "/" }}>Sabor da Casa</h1>
                            </div>

                            <div className="w-full flex flex-col justify-center items-start gap-5">

                                <div className="flex flex-col justify-center items-start mb-1">
                                    <h2 className="font-lgc text-neutral-900 text-2xl">Área Restrita</h2>
                                    <p className="font-lgc text-neutral-900 text-md">Acesse a Área Restrita do Restaurante Sabor da Casa.</p>
                                </div>

                                <div className={styles.formDiv}>
                                    <input className={styles.formInput} id="cpf" type="text" placeholder=" "></input>
                                    <label className={styles.formLabel} htmlFor="cpf"><span className={styles.formInputSpan}>E-mail ou CPF</span></label>
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <div className={styles.formDiv}>
                                        <input className={styles.formInput} id="password" type="password" placeholder=" "></input>
                                        <label className={styles.formLabel} htmlFor="password"><span className={styles.formInputSpan}>Senha</span></label>
                                    </div>

                                    <div className="w-full flex flex-row justify-end items-center">
                                        <a className="font-lgc text-neutral-900 text-md hover:text-red-600 hover:underline" href="#">Esqueceu a senha?</a>
                                    </div>
                                </div>

                            </div>

                            <div className="w-full flex flex-row justify-center items-center mt-2">
                                <button className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-all" onClick={() => { window.location.href = "/painel"; }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                                        <path d="M361.761 754.652q-12.674-14.434-12.674-33.087 0-18.652 12.674-31.326L430.5 621.5H154.022q-19.153 0-32.327-13.174T108.521 576q0-19.152 13.174-32.326t32.327-13.174H430.5l-68.979-68.978q-13.434-13.435-13.315-32.087.12-18.653 13.555-32.087 12.674-13.435 31.445-13.435 18.772 0 31.446 12.674l147.826 147.587q6.718 6.717 9.576 14.793 2.859 8.076 2.859 17.033t-2.859 17.033q-2.858 8.076-9.576 14.793L424.413 755.652q-13.435 13.435-31.707 12.555-18.271-.881-30.945-13.555Zm161.826 189.479q-19.152 0-32.326-13.174t-13.174-32.327q0-19.152 13.174-32.326t32.326-13.174h236.891V298.87H523.587q-19.152 0-32.326-13.174t-13.174-32.326q0-19.153 13.174-32.327t32.326-13.174h236.891q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v554.26q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H523.587Z"/>
                                    </svg>
                                    Entrar
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );

};