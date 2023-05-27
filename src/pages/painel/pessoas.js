import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";

import UserContext from "@/components/painel/auth/UserContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import PersonBox from "@/components/painel/pessoas/PersonBox";

import * as usersLib from "@/lib/users";

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

    const [baseAnimationDelay, setBaseAnimationDelay] = useState(800);
    const animationDelay = 50;

    const [users, setUsers] = useState(Array(18).fill(null));

    const fetchUsers = async () => {
            
        let response = await usersLib.getAll();

        if (response.status === 200) {
            setTimeout(() => { setUsers(response.users); setBaseAnimationDelay(0); }, 2000);
        } else {
            alert(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => fetchUsers, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);

    const handleSearch = async (query) => {
        if (query == "") { return fetchUsers(); };
        
        // does the search
        setUsers([])

    };

    const handleSearchChange = async (event) => {
        if (searchTimeout) { clearTimeout(searchTimeout); };

        let query = event.currentTarget.value;

        setSearchQuery(query);
        if (users && (users.length == 0 || users[0] != null)) { setUsers(Array(18).fill(null)); };
        
        let timeout = setTimeout(() => { handleSearch(query); }, 500);
        setSearchTimeout(timeout); 
        
    };

    return (
        <>

            <Head>
                <title>Painel | Pessoas | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Pessoas | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de pessoas do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl text-left slide-up-fade-in opacity-0" style={{ animationDelay: "600ms" }}>Pessoas</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Pessoas</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">

                <div className="w-full flex flex-col-reverse sm:flex-row gap-6">

                    <div className="flex w-full sm:w-[70%] gap-6">

                        <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-neutral-800">
                                <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                            </svg>
                            <input onChange={handleSearchChange} id="query" name="query" type="text" placeholder="Pesquisar" className="w-full font-lgc text-xl outline-none px-1 py-2 xl:py-0"></input>
                        </div>

                    </div>

                    <Link href="/painel/pessoas/registrar" className="w-full min-w-[190px] sm:w-[30%] flex flex-row justify-start items-center gap-3 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-4 py-3 transition-all smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-neutral-800">
                            <path d="M774.696 631.694q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722v-70.956h-70.956q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722 0-18.921 12.8-31.721 12.801-12.801 31.722-12.801h70.956v-70.956q0-18.921 12.8-31.721 12.801-12.801 31.722-12.801 18.922 0 31.722 12.801 12.8 12.8 12.8 31.721v70.956h70.956q18.922 0 31.722 12.801 12.8 12.8 12.8 31.721 0 18.922-12.8 31.722t-31.722 12.8h-70.956v70.956q0 18.922-12.8 31.722t-31.722 12.8Zm-411.305-65.303q-74.478 0-126.848-52.37-52.37-52.37-52.37-126.849 0-74.478 52.37-126.565 52.37-52.088 126.848-52.088 74.479 0 126.849 52.088 52.37 52.087 52.37 126.565 0 74.479-52.37 126.849-52.37 52.37-126.849 52.37ZM77.174 924.828q-22.088 0-37.544-15.457-15.457-15.457-15.457-37.544v-79.348q0-39.258 20.437-72.166 20.436-32.907 54.303-50.226 63.696-31.566 129.933-47.631 66.238-16.065 134.545-16.065 69.392 0 135.653 15.782 66.261 15.783 128.826 47.348 33.867 17.238 54.303 49.989 20.437 32.751 20.437 72.969v79.348q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H77.174Z"/>
                        </svg>
                        <p className="text-black font-lgc font-bold text-xl">Registrar</p>
                    </Link>

                </div>

                <p className={`${searchQuery == "" ? "hidden" : "block"} font-lgc text-lg`}>Mostrando resultados para "<span className="font-bold">{searchQuery}</span>":</p>

                <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">

                    {
                        users.map((userData, index) => {
                            return <PersonBox user={userData} animationDelay={baseAnimationDelay + (animationDelay * index)} key={index}></PersonBox>;
                        })
                    }

                </div>

                {
                    users.length == 0 ? (
                        <div className="w-full flex flex-col justify-center items-center gap-6 mt-16 fast-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="slide-up-fade-in opacity-0">
                                <path d="M613.087-523.13 423.696-712.522q12.869-5.435 27.652-8.152 14.782-2.717 28.652-2.717 61.261 0 102.891 41.63 41.631 41.631 41.631 102.891 0 13.87-3 28.653-3 14.782-8.435 27.087ZM235.13-283.913q51-38.435 113.435-59.805Q411-365.087 480-365.087q15.739 0 28.848.935 13.108.934 26.586 3.369l-75.564-76.13q-48.696-6.565-82.479-40.065-33.782-33.5-40.348-82.196L228.13-668.087Q197.826-626.521 182.305-579q-15.522 47.522-15.522 99 0 56.174 17.804 105.913t50.543 90.174Zm495.74-8.566q28.608-37.608 45.478-84.847Q793.217-424.565 793.217-480q0-131.87-90.674-222.543Q611.87-793.217 480-793.217q-52.609 0-99.565 16.304-46.956 16.304-88.522 46.043L730.87-292.479ZM480-60.782q-86.522 0-163.196-32.913-76.674-32.913-133.435-89.674-56.761-56.761-89.674-133.435Q60.782-393.478 60.782-480q0-86.957 32.913-163.413 32.913-76.457 89.674-133.218 56.761-56.761 133.152-89.674 76.392-32.913 162.914-32.913 86.956 0 163.413 32.913 76.457 32.913 133.501 89.674 57.043 56.761 89.956 133.218Q899.218-566.957 899.218-480q0 86.522-32.913 163.196-32.913 76.674-89.674 133.435-56.761 56.761-133.218 89.674Q566.957-60.782 480-60.782Z"/>
                            </svg>
                            <div className="flex flex-col text-center gap-1">
                                <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Nenhuma pessoa encontrada.</p>
                                <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Tente novamente com outra pesquisa ou registre um novo usuário com o botão "Registrar" acima.</p>
                            </div>
                        </div>
                    ) : null
                }

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