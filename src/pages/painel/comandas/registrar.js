import { useState, useEffect, useContext, useRef, use } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import MiniPersonBox from "@/components/painel/pessoas/MiniPersonBox";

import { MessageModal } from "@/components/elements/modal/Modal";

import * as usersLib from "@/lib/users";
import * as ticketsLib from "@/lib/tickets";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
        return { props: {} };
    };

    return {
        props: {
            token: req.cookies.token
        }
    };

};

function RegistrarComanda({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [users, setUsers] = useState([]);
    const [usersLoadError, setUsersLoadError] = useState(null);

    const fetchUsers = async () => {

        let response = await usersLib.getAll();

        if (response.status === 200) {
            setTimeout(() => { setUsers(response.users); }, 1200);
        } else {
            setUsersLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchUsers(); }, []);

    const [selectedUser, setSelectedUser] = useState(null);

    const [ticketRegisterLoading, setTicketRegisterLoading] = useState(false);

    const handleTicketRegisterSubmit = async (event) => {
        event.preventDefault();

        setTicketRegisterLoading(true);

        let response = await ticketsLib.register(selectedUser);

        if (response.status === 200) {
            
            showModal(
                <MessageModal
                    icon="success" title="Comanda Registrada" message="A comanda foi registrada com sucesso."
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
            
            router.push(`/painel/comandas/${response?.ticket?.id}`);
            
        } else {
            
            showModal(
                <MessageModal
                    icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
            
        };

        setTimeout(() => setTicketRegisterLoading(false), 800);
    };

    useEffect(() => {
        if (!socket) { return; };

        const Action = async (data) => {
            
            if (data?.userId == null) { 
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message="O cartão precisa estar vinculado a um usuário para ser registrado em uma comanda."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                return;
            };

            const userId = data.userId;

            let response = await ticketsLib.register(userId);

            if (response.status === 200) {
                
                showModal(
                    <MessageModal
                        icon="success" title="Comanda Registrada" message="A comanda foi registrada usando o cartão com sucesso."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                
                router.push(`/painel/comandas/${response?.ticket?.id}`);
                
            } else {
                
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                
            };

        };

        socket.on("ACTION", Action);

        return () => {
            socket.off("ACTION", Action);
        };

    }, [socket]);

    return (
        <>

            <Head>
                <title>Painel | Registrar Comanda | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Registrar Comanda | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel para registrar comandas no Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start gap-6 border-b border-neutral-800 scale-right-to-left">
                <div onClick={() => router.back()} className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                    </svg>
                    <p className="font-lgc text-lg">Voltar</p>
                </div>
                
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Registrar Comanda</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/comandas" className="hover:font-bold">Comandas</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Registrar Comanda</p>
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start gap-6 py-6">

                <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="m480-392.695 50.956 39.217q14.957 11.826 31.631.5t10.543-29.848l-20.608-65.261 57.956-45.217q14.957-11.826 8.544-29.565-6.413-17.74-25.501-17.74h-66.695l-21.608-66.26q-6.131-18.522-25.218-18.522t-25.218 18.522l-21.608 66.26h-67.695q-19.088 0-25.001 17.74-5.913 17.739 8.479 29.565l56.521 45.217-20.608 66.826q-6.131 18.522 9.826 29.566 15.956 11.043 31.348-.783L480-392.695ZM166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-138.391q0-11 6.717-18.718 6.717-7.717 17.717-9.717 23.435-6.87 39.5-24.761 16.066-17.891 16.066-41.63 0-24.304-16.066-42.195-16.065-17.892-39.5-24.196-11-2-17.717-9.717-6.717-7.718-6.717-18.718v-138.391q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v138.957q0 11-6.717 18.434-6.717 7.435-17.717 9.435-23.435 6.304-39.5 24.196-16.066 17.891-16.066 42.195 0 23.739 16.066 41.63 16.065 17.891 39.5 24.761 11 2 17.717 9.435 6.717 7.434 6.717 18.434v138.957q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783Z"/>
                    </svg>
                    <h1 className="font-lgc text-2xl font-bold">Informações da Comanda</h1>
                </div>

                <div className="w-full flex flex-col-reverse md:flex-row justify-start items-start gap-6">

                    <div className="w-full md:w-1/2 flex flex-row justify-start items-start gap-6">

                        <div className="w-full flex flex-col gap-5 px-6 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>

                            <div className="w-full flex flex-row items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M400-489.609q-74.479 0-126.849-52.37-52.369-52.37-52.369-126.849 0-74.478 52.369-126.565 52.37-52.088 126.849-52.088 74.479 0 126.849 52.088 52.369 52.087 52.369 126.565 0 74.479-52.369 126.849-52.37 52.37-126.849 52.37ZM113.782-131.172q-22.087 0-37.544-15.457-15.456-15.457-15.456-37.544v-79.348q0-41.479 22.37-74.436 22.369-32.956 52.369-47.956 51-26 119.24-44.848Q323-449.609 400-449.609h18.805q10.804 0 19.065 2-9.13 18-19.718 48.239-10.587 30.24-13.022 55.762-3.304 30.348-2.434 52.869.869 22.522 8.174 53.565 6.565 30.044 22.217 57.61 15.653 27.565 31.609 48.392H113.782Zm582.045-102.61q30.739 0 53.108-22.652 22.37-22.653 22.37-53.392 0-30.739-22.37-53.108-22.369-22.37-53.108-22.37-30.739 0-53.391 22.37-22.652 22.369-22.652 53.108 0 30.739 22.652 53.392 22.652 22.652 53.391 22.652Zm-59.914 70.174q-9.739-3.869-19.108-9.087-9.37-5.217-18.674-11.521l-40.739 12.434q-9.261 3.131-17.804-.5-8.544-3.63-13.109-11.891l-25.131-41.696q-5.13-8.261-3.348-18.087 1.783-9.826 9.479-16.522l31.304-26.739q-2.565-11.174-2.283-22.326.283-11.152 2.283-22.326l-31.304-27.304q-7.696-6.696-9.479-16.239-1.782-9.544 3.348-17.805l25.131-42.261q4.565-8.261 13.109-11.609 8.543-3.348 17.804-.217l40.739 12.434q9.304-6.304 18.674-11.521 9.369-5.218 19.108-9.087l8.435-41.174q2.565-9.261 9.544-15.457 6.978-6.195 16.239-6.195h50.826q9.261 0 16.24 6.195 6.978 6.196 9.543 15.457l8.435 41.174q9.739 3.869 19.391 9.304 9.652 5.435 18.957 13.304l39.173-13.869q9.261-4.131 18.305-.283 9.044 3.848 14.174 12.109l24.565 43.696q4.566 8.261 3.283 17.805-1.283 9.543-8.978 16.239l-31.739 27.304q2.565 9.739 2.282 21.326-.282 11.587-2.282 21.326l31.304 26.739q7.696 6.696 9.478 16.522 1.783 9.826-3.348 18.087l-25.13 41.696q-4.565 8.261-13.109 11.891-8.544 3.631-17.805.5l-40.173-12.434q-9.305 6.304-18.957 11.521-9.652 5.218-19.391 9.087l-8.435 41.174q-2.565 9.261-9.543 15.457-6.979 6.195-16.24 6.195h-50.826q-9.261 0-16.239-6.195-6.979-6.196-9.544-15.457l-8.435-41.174Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-xl">Selecionar Usuário</h1>
                            </div>

                            <div className="w-full flex flex-col justify-center items-start gap-6">

                                <div className="w-full h-96 bg-neutral-200 rounded-md overflow-y-scroll">

                                    {
                                        users.length > 0 ? (

                                            <div className="w-full grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-4 p-4">
                                                {
                                                    users.map((user, index) => {
                                                        return <MiniPersonBox key={index} user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                                                    })
                                                }
                                            </div>

                                        ) : users.length == 0 && usersLoadError == null ? (

                                            <div className="w-full h-full flex justify-center items-center">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                                                    <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                                </svg>
                                            </div>

                                        ) : users.length == 0 && usersLoadError != null ? (

                                            <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" className="fill-black slide-up-fade-in opacity-0">
                                                    <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                                                </svg>
                                                <div className="flex flex-col text-center gap-1">
                                                    <p className="text-black font-lgc font-bold text-xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Usuários.</p>
                                                    <p className="text-black font-lgc slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{usersLoadError}</p>
                                                </div>
                                            </div>

                                        ) : null
                                    }

                                </div>

                                <div className="w-full flex flex-row justify-end items-center mt-2">
                                    <button onClick={handleTicketRegisterSubmit} disabled={ticketRegisterLoading || !selectedUser} className={`w-full xl:w-56 flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 ${!selectedUser ? "disabled:bg-neutral-300 disabled:cursor-not-allowed" : "disabled:bg-red-600 disabled:cursor-default"} transition-all`} type="submit">
                                        { ticketRegisterLoading ? (
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                                <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white fast-fade-in">
                                                <path d="M206.783 955.218q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153V302.783q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h437.391q21.087 0 40.392 7.978 19.304 7.978 34.261 22.935l109.478 109.478q14.957 14.957 22.935 34.261 7.978 19.305 7.978 40.392v437.391q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783ZM480 809.217q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM299.784 502.783h253.998q22.088 0 37.544-15.457 15.457-15.456 15.457-37.544v-53.998q0-22.088-15.457-37.544-15.456-15.457-37.544-15.457H299.784q-22.088 0-37.544 15.457-15.457 15.456-15.457 37.544v53.998q0 22.088 15.457 37.544 15.456 15.457 37.544 15.457Z"/>
                                            </svg>
                                        ) }
                                        { ticketRegisterLoading ? "Registrando..." : "Registrar Comanda" }
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="w-full md:w-fit md:h-[456px] flex justify-center items-center smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                        <p className="font-lgc font-bold">ou</p>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-4 px-6 py-5 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>

                        <div className="w-full flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-466.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v466.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783Zm0-340.914h626.434v-160H166.783v160Z"/>
                            </svg>
                            <h1 className="font-lgc font-bold text-xl">Ler Cartão de Usuário</h1>
                        </div>

                        <div className="w-full flex flex-col justify-center items-start gap-6">

                            <div className="scanner w-full h-96 flex flex-col justify-center items-center text-center gap-2 m-2 rounded-md">

                                <h1 className="font-lgc text-lg font-bold px-6">PASSE UM CARTÃO NO LEITOR</h1>

                                <p className="font-lgc text-lg max-w-lg px-6">Certifique-se que o dispositivo está pareado com você.</p>

                                <div className="mt-4">  
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </>
    );

};

RegistrarComanda.requiresUser = true;

RegistrarComanda.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Comandas"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default RegistrarComanda;