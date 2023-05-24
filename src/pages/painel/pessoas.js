import { useState, useEffect, useContext } from "react";
import Link from "next/link";
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

    const [users, setUsers] = useState(Array(18).fill(null));
    useEffect(() => { if (!users || users.length == 0) { setUsers(Array(18).fill(null)); }; }, [users]);

    const baseAnimationDelay = 800;
    const animationDelay = 50;

    const fetchUsers = async () => {
            
        // does the fetch

    };

    useEffect(() => { fetchUsers(); }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);

    const handleSearch = async (query) => {

        setSearchQuery(query);
        if (query == "") { return fetchUsers(); };
        
        // does the search

    };

    const handleSearchChange = async (event) => {
        if (searchTimeout) { clearTimeout(searchTimeout); };

        let query = event.currentTarget.value;

        if (users && users[0] != null) { setUsers([]); };
        
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
                <h1 className="font-lgc text-3xl sm:text-4xl pr-4 pb-3 text-left slide-up-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>Pessoas</h1>
            </div>

            <div className="flex flex-col gap-6 mt-6">

                <div className="w-full flex flex-col sm:flex-row gap-6">

                    <div className="flex w-full sm:w-[70%] gap-6">

                        <div className="w-full flex flex-row items-center gap-1 border-b border-neutral-800 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-neutral-800">
                                <path d="M745.826 920.435 526.913 701.523q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87-114.087 0-193.544-79.457Q102.477 590.087 102.477 476q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479 361.913 648.479 476q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l220.478 221.044q14.956 14.956 14.674 36.326-.283 21.37-15.674 36.761-14.957 14.957-37.327 14.957-22.37 0-37.326-14.957ZM375.478 642.999q69.913 0 118.456-48.543Q542.477 545.913 542.477 476q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479 406.087 208.479 476q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/>
                            </svg>
                            <input onChange={handleSearchChange} id="query" name="query" type="text" placeholder="Pesquisar" className="w-full font-lgc text-xl outline-none px-1"></input>
                        </div>

                    </div>

                    <Link href="/painel/pessoas/registrar" className="w-full min-w-[190px] sm:w-[30%] flex flex-row justify-start items-center gap-3 bg-neutral-100 border border-neutral-400 cursor-pointer hover:bg-neutral-50 hover:shadow-xl rounded-md px-4 py-3 transition-all smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-neutral-800">
                            <path d="M774.696 631.694q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722v-70.956h-70.956q-18.921 0-31.722-12.8-12.8-12.8-12.8-31.722 0-18.921 12.8-31.721 12.801-12.801 31.722-12.801h70.956v-70.956q0-18.921 12.8-31.721 12.801-12.801 31.722-12.801 18.922 0 31.722 12.801 12.8 12.8 12.8 31.721v70.956h70.956q18.922 0 31.722 12.801 12.8 12.8 12.8 31.721 0 18.922-12.8 31.722t-31.722 12.8h-70.956v70.956q0 18.922-12.8 31.722t-31.722 12.8Zm-411.305-65.303q-74.478 0-126.848-52.37-52.37-52.37-52.37-126.849 0-74.478 52.37-126.565 52.37-52.088 126.848-52.088 74.479 0 126.849 52.088 52.37 52.087 52.37 126.565 0 74.479-52.37 126.849-52.37 52.37-126.849 52.37ZM77.174 924.828q-22.088 0-37.544-15.457-15.457-15.457-15.457-37.544v-79.348q0-39.258 20.437-72.166 20.436-32.907 54.303-50.226 63.696-31.566 129.933-47.631 66.238-16.065 134.545-16.065 69.392 0 135.653 15.782 66.261 15.783 128.826 47.348 33.867 17.238 54.303 49.989 20.437 32.751 20.437 72.969v79.348q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H77.174Z"/>
                        </svg>
                        <p className="text-black font-lgc font-bold text-xl">Registrar</p>
                    </Link>

                </div>

                <p className={`${searchQuery == "" ? "hidden" : "block"} font-lgc text-lg`}>Mostrando resultados para "<span className="font-bold">{searchQuery}</span>":</p>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

                    {
                        users.map((userData, index) => {
                            return <PersonBox user={userData} animationDelay={baseAnimationDelay + (animationDelay * index)} key={index}></PersonBox>
                        })
                    }

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