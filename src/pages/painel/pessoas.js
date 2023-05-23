import { useContext } from "react";
import Head from "next/head";

import UserContext from "@/components/painel/user/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import PersonBox from "@/components/painel/pessoas/PersonBox";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {}
    };

};

function Pessoas() {

    const { user } = useContext(UserContext);

    return (
        <>

            <Head>
                <title>Painel | Pessoas | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Pessoas | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de pessoas do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <h1 className="font-lgc text-3xl sm:text-4xl pr-4 pb-3 text-left slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>Pessoas</h1>
            </div>

            <div className="flex flex-col">

                <div className="w-full flex flex-col sm:flex-row gap-6 mt-6">

                    <div className="flex w-full sm:w-[70%] gap-6">

                        <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-neutral-800">
                                <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                            </svg>
                            <input type="text" placeholder="Pesquisar" className="w-full font-lgc text-xl outline-none p-1"></input>

                        </div>

                    </div>

                    <div className="w-full sm:w-[30%] flex flex-row justify-start items-center gap-2 bg-neutral-100 cursor-pointer hover:bg-neutral-200 rounded-md px-4 py-3 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-neutral-800">
                            <path d="M774.696 631.694q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722v-70.956h-70.956q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722 0-18.921 12.8-31.721 12.801-12.801 31.722-12.801h70.956v-70.956q0-18.921 12.8-31.721 12.801-12.801 31.722-12.801 18.922 0 31.722 12.801 12.8 12.8 12.8 31.721v70.956h70.956q18.922 0 31.722 12.801 12.8 12.8 12.8 31.721 0 18.922-12.8 31.722t-31.722 12.8h-70.956v70.956q0 18.922-12.8 31.722t-31.722 12.8Zm-411.305-65.303q-74.478 0-126.848-52.37-52.37-52.37-52.37-126.849 0-74.478 52.37-126.565 52.37-52.088 126.848-52.088 74.479 0 126.849 52.088 52.37 52.087 52.37 126.565 0 74.479-52.37 126.849-52.37 52.37-126.849 52.37ZM77.174 924.828q-22.088 0-37.544-15.457-15.457-15.457-15.457-37.544v-79.348q0-39.258 20.437-72.166 20.436-32.907 54.303-50.226 63.696-31.566 129.933-47.631 66.238-16.065 134.545-16.065 69.392 0 135.653 15.782 66.261 15.783 128.826 47.348 33.867 17.238 54.303 49.989 20.437 32.751 20.437 72.969v79.348q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H77.174Z"/>
                        </svg>
                        <p className="text-black font-lgc font-bold text-xl">Adicionar</p>
                    </div>

                </div>

                <div className="w-full flex flex-col-reverse md:flex-row gap-6 mt-6">

                    <div className="w-full md:w-[70%] flex flex-col gap-4">

                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>
                        <PersonBox></PersonBox>

                    </div>
                    
                    <div className="w-full md:w-[30%] h-fit flex flex-col bg-neutral-100 rounded-lg px-4 py-3 gap-2">

                        <div className="flex flex-row gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-black">
                                <path d="M158.087 863.413q-18.525 0-31.056-12.695-12.531-12.696-12.531-31.131 0-18.435 12.531-31.011T158.087 776h160q18.435 0 31.13 12.531 12.696 12.532 12.696 31.056 0 18.435-12.696 31.131-12.695 12.695-31.13 12.695h-160Zm0-487.413q-18.525 0-31.056-12.531-12.531-12.532-12.531-31.056 0-18.435 12.531-31.131 12.531-12.695 31.056-12.695h320q18.435 0 31.13 12.695 12.696 12.696 12.696 31.131 0 18.435-12.696 31.011Q496.522 376 478.087 376h-320Zm323.826 567.413q-18.435 0-31.13-12.695-12.696-12.696-12.696-31.131v-160q0-18.524 12.696-31.056Q463.478 696 481.913 696t31.011 12.531q12.576 12.532 12.576 31.056V776h276.413q18.525 0 31.056 12.531 12.531 12.532 12.531 31.056 0 18.435-12.531 31.131-12.531 12.695-31.056 12.695H525.5v36.174q0 18.435-12.531 31.131-12.531 12.695-31.056 12.695ZM318.087 699.587q-18.435 0-31.011-12.531Q274.5 674.524 274.5 656v-36.413H158.087q-18.525 0-31.056-12.531Q114.5 594.524 114.5 576t12.531-31.056q12.531-12.531 31.056-12.531H274.5V496q0-18.524 12.531-31.056 12.531-12.531 31.056-12.531 18.435 0 31.13 12.531 12.696 12.532 12.696 31.056v160q0 18.524-12.696 31.056-12.695 12.531-31.13 12.531Zm163.826-80q-18.435 0-31.13-12.531-12.696-12.532-12.696-31.056t12.696-31.056q12.695-12.531 31.13-12.531h320q18.525 0 31.056 12.531Q845.5 557.476 845.5 576t-12.531 31.056q-12.531 12.531-31.056 12.531h-320Zm160-163.587q-18.435 0-31.13-12.531-12.696-12.532-12.696-31.056v-160q0-18.435 12.696-31.131 12.695-12.695 31.13-12.695t31.011 12.695q12.576 12.696 12.576 31.131v36.174h116.413q18.525 0 31.056 12.695 12.531 12.696 12.531 31.131 0 18.435-12.531 31.011T801.913 376H685.5v36.413q0 18.524-12.531 31.056Q660.438 456 641.913 456Z"/>
                            </svg>

                            <p className="text-black font-lgc font-bold text-xl">Filtros</p>
                        </div>
                    </div>

                </div>

            </div>

        </>
    );

};

Pessoas.requiresUser = true;

Pessoas.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Pessoas"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Pessoas;