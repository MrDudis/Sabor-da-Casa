import { useContext } from "react";
import Head from "next/head";

import UserContext from "@/components/painel/user/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import styles from "@/styles/painel/Conta.module.css";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {}
    };

};

function Conta() {

    const { user } = useContext(UserContext);

    return (
        <>

            <Head>
                <title>Painel | Minha Conta | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Minha Conta | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de configurações da sua conta no Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>
            
            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <h1 className="font-lgc text-3xl sm:text-4xl pr-4 pb-3 text-left slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>Minha Conta</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <form className="w-full md:w-[60%] flex flex-col gap-5 px-4 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>

                    <div className="w-full flex flex-row items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                            <path d="M774.261 459.218 601.435 287.826l52.608-53.174q25.261-25.261 61.587-25.826 36.327-.565 63.849 25.826l48.086 47.522q27.522 26.391 26.826 62-.695 35.609-25.956 60.87l-54.174 54.174ZM169.044 945.044q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-97.738q0-10.826 3.848-20.305 3.848-9.478 12.109-17.739l411.435-411.435 173.391 172.826-411.435 411.435q-8.261 8.261-18.021 12.109-9.761 3.848-20.588 3.848h-97.738Z"/>
                        </svg>
                        <h1 className="font-lgc font-bold text-xl">Editar Informações</h1>
                    </div>

                    <div className="flex flex-row items-center gap-3 bg-yellow-200 rounded-md px-3 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="w-[28px]">
                            <path d="m858.391 455.131-66.304-30.652 66.269-30.123 30.123-66.269 30.652 66.304 65.74 30.088-65.74 30.652-30.652 65.74-30.088-65.74ZM723.13 244.391l-99.522-45.914 99.522-45.348 45.349-99.522 45.913 99.522 99.523 45.348-99.382 46.055-46.054 99.381-45.349-99.522ZM342.477 1010.48q-35.798 0-61.29-27.174-25.493-27.174-25.493-66.392h174.132q0 39.218-25.659 66.392-25.659 27.174-61.69 27.174ZM221.912 872.392q-18.922 0-31.722-12.8t-12.8-31.722q0-18.681 12.8-31.319 12.8-12.638 31.722-12.638h241.696q18.922 0 31.722 12.641 12.8 12.64 12.8 31.326t-12.8 31.599q-12.8 12.913-31.722 12.913H221.912ZM187.39 739.391Q113.303 695 68.564 621.195q-44.74-73.804-44.74-161.022 0-132.772 92.97-225.713 92.969-92.94 225.783-92.94t225.966 92.94q93.153 92.941 93.153 225.713 0 87.783-44.74 161.305Q572.217 695 498.13 739.391H187.39Z"/>
                        </svg>
                        <p className="font-lgc text-black">Não esqueça de salvar as informações quando terminar a edição.</p>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-5">
                        <div className="w-full flex flex-col gap-1.5">
                            <label className="font-lgc font-bold text-md" htmlFor="name">Nome Completo</label>
                            <input className={styles.basicInput} id="name" name="name" type="text" placeholder={user?.name} value={user?.name}></input>
                        </div>

                        <div className="w-full flex flex-col gap-1.5">
                            <label className="font-lgc font-bold text-md" htmlFor="cpf">CPF</label>
                            <input className={styles.basicInput} id="cpf" name="cpf" type="text" placeholder={user?.cpf} value={user?.cpf}></input>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5">
                        <div className="w-full flex flex-col gap-1.5">
                            <label className="font-lgc font-bold text-md" htmlFor="email">E-mail</label>
                            <input className={styles.basicInput} id="email" name="email" type="text" placeholder={user?.email} value={user?.email}></input>
                        </div>

                        <div className="w-full flex flex-col gap-1.5">
                            <label className="font-lgc font-bold text-md" htmlFor="phone">Telefone</label>
                            <input className={styles.basicInput} id="phone" name="phone" type="text" placeholder={user?.phone} value={user?.phone}></input>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5">
                        <div className="w-full flex flex-col gap-1.5">
                            <label className="font-lgc font-bold text-md" htmlFor="birthdate">Data de Nascimento</label>
                            <input className={styles.basicInput} id="birthdate" name="birthdate" type="text" placeholder={user?.birthdate} value={user?.birthdate}></input>
                        </div>

                        <div className="w-full flex flex-col gap-1.5">
                            <label className="font-lgc font-bold text-md" htmlFor="gender">Sexo</label>
                            <select className={styles.basicSelect}>
                                <option className={styles.basicOption}>Masculino</option>
                                <option className={styles.basicOption}>Feminino</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full flex flex-row justify-end items-center mt-2">
                        <button className="w-full xl:w-[42%] max-w-sm flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                                <path d="M206.783 955.218q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153V302.783q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h437.391q21.087 0 40.392 7.978 19.304 7.978 34.261 22.935l109.478 109.478q14.957 14.957 22.935 34.261 7.978 19.305 7.978 40.392v437.391q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783ZM480 809.217q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM299.784 502.783h253.998q22.088 0 37.544-15.457 15.457-15.456 15.457-37.544v-53.998q0-22.088-15.457-37.544-15.456-15.457-37.544-15.457H299.784q-22.088 0-37.544 15.457-15.457 15.456-15.457 37.544v53.998q0 22.088 15.457 37.544 15.456 15.457 37.544 15.457Z"/>
                            </svg>
                            Salvar Alterações
                        </button>
                    </div>
                    
                </form>

                <form className="w-full md:w-[40%] flex flex-col items-start justify-start px-4 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                    
                    <div className="flex flex-row justify-start items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                            <path d="M251.87 577.13q0 50.044 19.804 90.739 19.805 40.696 51.717 72v-39.912q0-18.696 12.914-31.327Q349.218 656 367.913 656q18.696 0 31.327 12.63 12.63 12.631 12.63 31.327v154.347q0 22.087-15.457 37.544-15.456 15.457-37.543 15.457H205.087q-18.696 0-31.326-12.913-12.631-12.913-12.631-31.609t12.914-31.326q12.913-12.631 31.608-12.631h46.391q-49.87-46.261-78.022-107.978-28.152-61.718-28.152-133.718 0-100.782 53.522-181.304t139.87-121.653q17.957-9.13 36 1.544 18.044 10.674 24.174 31.761 5.566 19.957-2.63 39.196-8.196 19.239-26.153 29.5-53.173 28.739-85.978 82.261-32.804 53.522-32.804 118.695ZM708.13 576q.565-46.478-18.239-87.869-18.804-41.391-53.282-76v39.912q0 18.696-12.631 31.327Q611.348 496 592.652 496q-18.696 0-31.609-12.913t-12.913-31.609V297.696q0-22.087 15.457-37.544 15.456-15.457 37.543-15.457h153.783q18.696 0 31.326 12.631 12.631 12.63 12.631 31.326 0 18.696-12.631 31.609-12.63 12.913-31.326 12.913h-46.956q55.609 53 80.674 114.065 25.065 61.065 25.5 128.761H708.13ZM640 976q-17 0-28.5-11.5T600 936V816q0-17 11.5-28.5T640 776v-40q0-33 23.5-56.5T720 656q33 0 56.5 23.5T800 736v40q17 0 28.5 11.5T840 816v120q0 17-11.5 28.5T800 976H640Zm40-200h80v-40q0-17-11.5-28.5T720 696q-17 0-28.5 11.5T680 736v40Z"/>
                        </svg>
                        <h1 className="font-lgc font-bold text-lg">Alterar Senha</h1>
                    </div>

                    <div className="w-full flex flex-col gap-6 my-6">
                        <div className={styles.formDiv}>
                            <input className={styles.formInput} id="currentPassword" name="currentPassword" type="password" placeholder=" "></input>
                            <label className={styles.formLabel} htmlFor="currentPassword"><span className={styles.formInputSpan}>Senha Atual</span></label>
                        </div>

                        <div className={styles.formDiv}>
                            <input className={styles.formInput} id="newPassword" name="newPassword" type="password" placeholder=" "></input>
                            <label className={styles.formLabel} htmlFor="newPassword"><span className={styles.formInputSpan}>Senha Nova</span></label>
                        </div>

                        <div className={styles.formDiv}>
                            <input className={styles.formInput} id="confirmNewPassword" name="confirmNewPassword" type="password" placeholder=" "></input>
                            <label className={styles.formLabel} htmlFor="confirmNewPassword"><span className={styles.formInputSpan}>Confirmar Senha Nova</span></label>
                        </div>
                    </div>

                    <div className="w-full flex flex-row justify-center items-center mt-2">
                        <button className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                                <path d="M520 955.218q-65.391 0-123.152-19.782-57.761-19.783-106.022-56.479-18.522-14.391-21.218-38.391-2.696-24.001 15.261-42.523 14.391-14.391 35.326-14.956 20.935-.566 39.023 12.391 35 26 75.587 39.87 40.586 13.869 85.195 13.869 113.739 0 193.478-79.739T793.217 576q0-113.739-79.739-193.478T520 302.783q-112.043 0-192.63 78.891-80.587 78.891-80.587 191.5v3.608l42.174-41.608q12.695-12.696 30.891-12.696 18.196 0 31.326 12.696 13.131 13.13 13.131 31.326 0 18.196-13.131 31.326L231.391 717.609q-8.261 8.261-17.804 11.609-9.544 3.348-19.805 3.348t-19.804-3.348q-9.544-3.348-17.805-11.609L36.521 596.826Q23.825 584.13 24.042 566q.218-18.13 12.913-30.826 12.696-13.131 31.11-13.131 18.412 0 31.108 13.131l41.609 42.608v-4.608q0-77.826 29.913-146.153 29.913-68.326 80.956-119.37 51.044-51.043 120.218-80.956Q441.043 196.782 520 196.782t147.848 29.913q68.892 29.913 120.218 81.239 51.326 51.326 81.239 120.218Q899.218 497.043 899.218 576q0 158.479-110.369 268.849Q678.479 955.218 520 955.218ZM440 736q-17 0-28.5-11.5T400 696V576q0-17 11.5-28.5T440 536v-40q0-33 23.5-56.5T520 416q33 0 56.5 23.5T600 496v40q17 0 28.5 11.5T640 576v120q0 17-11.5 28.5T600 736H440Zm40-200h80v-40q0-17-11.5-28.5T520 456q-17 0-28.5 11.5T480 496v40Z"/>
                            </svg>
                            Alterar Senha
                        </button>
                    </div>
                    
                </form>

            </div>

        </>
    );

};

Conta.requiresUser = true;

Conta.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Minha Conta"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Conta;