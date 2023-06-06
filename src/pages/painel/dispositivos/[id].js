import { useState, useEffect, useContext } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import { MessageModal } from "@/components/elements/modal/Modal";

import Device from "@/models/Device";

import * as devicesLib from "@/lib/devices";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
    };

    return {
        props: {
            token: req.cookies.token
        }
    };

};

function Dispositivo({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [device, setDevice] = useState(null);
    const [deviceLoadError, setDeviceLoadError] = useState(null);

    const fetchDevice = async () => {

        const id = router.query?.id;

        let response = await devicesLib.get(id);

        if (response.status === 200) {
            setDevice(new Device(response.device));
        } else {
            setDeviceLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchDevice(); }, []);

    useEffect(() => {
        if (!socket) { return; };

        const onDeviceUpdate = (data) => {
            if (data.id !== device?.id) { return; }
            
            setDevice(null);
            fetchDevice();
        };
    
        const onDeviceDelete = (data) => {
            if (data.id !== device?.id) { return; }
            
            showModal(
                <MessageModal
                    icon="warning" title="Dispositivo Desconectado" message="Este dispositivo foi desconectado e não pode mais ser visualizado."
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );

            router.push("/painel/dispositivos");
        };

        socket.on("UPDATE_DEVICE", onDeviceUpdate);
        socket.on("DELETE_DEVICE", onDeviceDelete);

        return () => {
            socket.off("UPDATE_DEVICE", onDeviceUpdate);
            socket.off("DELETE_DEVICE", onDeviceDelete);
        };
    }, [socket]);

    const [devicePairLoading, setDevicePairLoading] = useState(false);

    const handleDevicePairSubmit = async () => {
        closeModal();

        setDevicePairLoading(true);

        let response = await devicesLib.update(device?.id, user?.id);

        if (response.status === 200) {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Dispositivo Pareado" message="O dispositivo foi pareado com você com successo."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );

                fetchDevice();
            }, 500);
            
        } else {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );

                fetchDevice();
            }, 500);
            
        };

        setTimeout(() => { setDevicePairLoading(false) }, 500);
    };

    const handleDevicePairConfirmation = (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Forçar Pareamento?" message="Essa ação irá parear o dispositivo selecionado com a sua conta, e qual ação feita a seguir será ligada a sua conta. Deseja continuar?"
                buttons={[ { label: "Parear", action: handleDevicePairSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    const [deviceUnpairLoading, setDeviceUnpairLoading] = useState(false);

    const handleDeviceUnpairSubmit = async () => {
        closeModal();

        setDeviceUnpairLoading(true);

        let response = await devicesLib.update(device?.id, null);

        if (response.status === 200) {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Dispositivo Despareado" message="O dispositivo foi despareado com successo."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );

                fetchDevice();
            }, 500);
            
        } else {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );

                fetchDevice();
            }, 500);
            
        };

        setTimeout(() => { setDeviceUnpairLoading(false) }, 500);
    };

    const handleDeviceUnpairConfirmation = (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Forçar Despareamento?" message="Essa ação irá desparear o dispositivo selecionado com outro usuário. Deseja continuar?"
                buttons={[ { label: "Parear", action: handleDeviceUnpairSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    const [deviceDisconnectLoading, setDeviceDisconnectLoading] = useState(false);

    const handleDeviceDisconnectSubmit = async () => {
        closeModal();

        setDeviceDisconnectLoading(true);

        let response = await devicesLib.disconnect(device?.id);

        if (response.status === 200) {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Dispositivo Desconectado" message="O dispositivo foi desconectado com successo."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
                
                router.push("/painel/dispositivos")
            }, 500);
            
        } else {
            
            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
            }, 500);
            
        };

        setTimeout(() => setDeviceDisconnectLoading(false), 500);
    };

    const handleDeviceDisconnectConfirmation = (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Desconectar Dispositivo?" message="Isso irá forçar a desconexão do dispositivo selecionado, será necessario reiniciar o dispositivo para que ele possa funcionar novamente. Deseja continuar?"
                buttons={[ { label: "Desconectar", action: handleDeviceDisconnectSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    if (!device) {
        if (deviceLoadError) {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-black slide-up-fade-in opacity-0">
                        <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                    </svg>
                    <div className="flex flex-col text-center gap-1">
                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Dispositivo.</p>
                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{deviceLoadError}</p>
                    </div>
                    <Link href="/painel/dispositivos" className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                        </svg>
                        <p className="font-lgc text-lg">Voltar</p>
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="w-full h-full flex justify-center items-center">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                    </svg>
                </div>
            );
        };
    };
    
    return (
        <>

            <Head>
                <title>Painel | {device?.name} | Sabor da Casa</title>
                <meta property="og:title" content={`Painel | ${device?.name} | Sabor da Casa`} key="title" />
                <meta name="og:description" content="Painel para gerenciamento de dispositivo do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start gap-6 border-b border-neutral-800 scale-right-to-left">
                <Link href="/painel/dispositivos" className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                    </svg>
                    <p className="font-lgc text-lg">Voltar</p>
                </Link>
                
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">

                    <div className="flex flex-row justify-start items-center gap-2 slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                        <h1 className="font-lgc text-3xl sm:text-4xl">{device?.name}</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" className={`${device?.userId ? "fill-green-500" : "fill-yellow-500"} animate-pulse`}>
                            <path d="M480.083-180.782q-124.996 0-212.149-87.07-87.152-87.069-87.152-212.065t87.07-212.149q87.069-87.152 212.065-87.152t212.149 87.07q87.152 87.069 87.152 212.065t-87.07 212.149q-87.069 87.152-212.065 87.152Z"/>
                        </svg>
                    </div>

                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/dispositivos" className="hover:font-bold">Dispositivos</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">{device?.name || router.query?.id}</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <div className="w-full md:w-[60%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M288.479-22.477q-44.305 0-75.153-30.849-30.849-30.848-30.849-75.153v-703.042q0-44.305 30.849-75.153 30.848-30.849 75.153-30.849h383.042q44.305 0 75.153 30.849 30.849 30.848 30.849 75.153v703.042q0 44.305-30.849 75.153-30.848 30.849-75.153 30.849H288.479ZM480-148.48q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm-191.521-180h383.042v-383.042H288.479v383.042Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Informações do Dispositivo</h1>
                    </div>

                    <div className="w-full flex flex-col xl:flex-row items-center gap-6">

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                <path d="M528.479-500.522v-128.173q0-20.604-13.938-34.541-13.938-13.938-34.541-13.938-20.603 0-34.541 13.938-13.938 13.937-13.938 34.541v145.999q0 10.826 3.848 20.345 3.848 9.519 11.544 17.134l122.956 122.956q13.826 13.826 33.652 13.826 19.827 0 34.218-13.826 14.391-13.826 14.391-34.218 0-20.391-14.391-34.783l-109.26-109.26ZM480-60.782q-87.522 0-163.906-32.96-76.385-32.96-132.888-89.464-56.504-56.503-89.464-132.888Q60.782-392.478 60.782-480t32.96-163.906q32.96-76.385 89.464-132.888 56.503-56.504 132.888-89.464 76.384-32.96 163.906-32.96t163.906 32.96q76.385 32.96 132.888 89.464 56.504 56.503 89.464 132.888 32.96 76.384 32.96 163.906t-32.96 163.906q-32.96 76.385-89.464 132.888-56.503 56.504-132.888 89.464Q567.522-60.782 480-60.782ZM480-480Zm-.005 313.217q130.179 0 221.7-91.239Q793.217-349.261 793.217-480T701.7-701.978q-91.516-91.239-221.695-91.239-130.179 0-221.7 91.239Q166.783-610.739 166.783-480T258.3-258.022q91.516 91.239 221.695 91.239Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Tempo Conectado</p>
                                <p className="font-lgc text-lg">2 minutos</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M22.477-102.477V-320H120v120h120v97.523H22.477Zm697.523 0V-200h120v-120h97.523v217.523H720ZM160-240v-480h80v480h-80Zm120 0v-480h40v480h-40Zm120 0v-480h80v480h-80Zm120 0v-480h120v480H520Zm160 0v-480h40v480h-40Zm80 0v-480h40v480h-40ZM22.477-640v-217.523H240V-760H120v120H22.477ZM840-640v-120H720v-97.523h217.523V-640H840Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Serial Number</p>
                                <p className="font-lgc text-lg">4125-5273-3936</p>
                            </div>
                        </div>

                    </div>

                    {
                        device?.userId ? (
                            <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M480-489.609q-74.479 0-126.849-52.37-52.369-52.37-52.369-126.849 0-74.478 52.369-126.565 52.37-52.088 126.849-52.088 74.479 0 126.849 52.088 52.369 52.087 52.369 126.565 0 74.479-52.369 126.849-52.37 52.37-126.849 52.37ZM246.783-131.172q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-26.347q0-39.088 20.326-72.109 20.326-33.022 54.413-50.283 63.696-31.566 129.957-47.631T480-449.609q69.391 0 135.652 15.782 66.261 15.783 128.827 47.348 34.087 17.261 54.413 50.001 20.326 32.739 20.326 72.957v26.347q0 44.305-30.848 75.153-30.848 30.849-75.153 30.849H246.783Z"/>
                                </svg>
                                <p className="font-lgc text-lg">Pareado com <span className="font-bold">{device.user.name}</span>.</p>
                            </div>
                        ) : (
                            <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M480-271.521q20.603 0 34.541-13.938 13.938-13.938 13.938-34.541v-151.521q0-20.604-13.938-34.541Q500.603-520 480-520q-20.603 0-34.541 13.938-13.938 13.937-13.938 34.541V-320q0 20.603 13.938 34.541 13.938 13.938 34.541 13.938Zm0-317.174q21.805 0 36.555-14.75T531.305-640q0-21.805-14.75-36.555T480-691.305q-21.805 0-36.555 14.75T428.695-640q0 21.805 14.75 36.555T480-588.695Zm0 527.913q-87.522 0-163.906-32.96-76.385-32.96-132.888-89.464-56.504-56.503-89.464-132.888Q60.782-392.478 60.782-480t32.96-163.906q32.96-76.385 89.464-132.888 56.503-56.504 132.888-89.464 76.384-32.96 163.906-32.96t163.906 32.96q76.385 32.96 132.888 89.464 56.504 56.503 89.464 132.888 32.96 76.384 32.96 163.906t-32.96 163.906q-32.96 76.385-89.464 132.888-56.503 56.504-132.888 89.464Q567.522-60.782 480-60.782Z"/>
                                </svg>
                                <p className="font-lgc text-lg">Este dispositivo não está pareado com ninguém.</p>
                            </div>
                        )
                    }

                    {
                        device?.userId ? (
                            <form onSubmit={handleDeviceUnpairConfirmation} className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>
                                
                                <div className="w-full xl:w-[65%] flex flex-col justify-center items-start gap-2">
                                    <div className="w-full flex flex-row justify-start items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                            <path d="M613.087-523.13 423.696-712.522q12.869-5.435 27.652-8.152 14.782-2.717 28.652-2.717 61.261 0 102.891 41.63 41.631 41.631 41.631 102.891 0 13.87-3 28.653-3 14.782-8.435 27.087ZM235.13-283.913q51-38.435 113.435-59.805Q411-365.087 480-365.087q15.739 0 28.848.935 13.108.934 26.586 3.369l-75.564-76.13q-48.696-6.565-82.479-40.065-33.782-33.5-40.348-82.196L228.13-668.087Q197.826-626.521 182.305-579q-15.522 47.522-15.522 99 0 56.174 17.804 105.913t50.543 90.174Zm495.74-8.566q28.608-37.608 45.478-84.847Q793.217-424.565 793.217-480q0-131.87-90.674-222.543Q611.87-793.217 480-793.217q-52.609 0-99.565 16.304-46.956 16.304-88.522 46.043L730.87-292.479ZM480-60.782q-86.522 0-163.196-32.913-76.674-32.913-133.435-89.674-56.761-56.761-89.674-133.435Q60.782-393.478 60.782-480q0-86.957 32.913-163.413 32.913-76.457 89.674-133.218 56.761-56.761 133.152-89.674 76.392-32.913 162.914-32.913 86.956 0 163.413 32.913 76.457 32.913 133.501 89.674 57.043 56.761 89.956 133.218Q899.218-566.957 899.218-480q0 86.522-32.913 163.196-32.913 76.674-89.674 133.435-56.761 56.761-133.218 89.674Q566.957-60.782 480-60.782Z"/>
                                        </svg>
                                        <h1 className="font-lgc font-bold text-lg">Forçar Despareamento</h1>
                                    </div>

                                    <p className="font-lgc text-[17px]">Força o dispositivo a desparear com a conta que está pareado, não se esqueça de avisar quem está usando o dispositivo que ele será despareado para evitar confusão.</p>
                                </div>

                                <div disabled={deviceUnpairLoading} className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                                    <button className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                        { deviceUnpairLoading ? (
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                                <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                                <path d="M613.087-523.13 423.696-712.522q12.869-5.435 27.652-8.152 14.782-2.717 28.652-2.717 61.261 0 102.891 41.63 41.631 41.631 41.631 102.891 0 13.87-3 28.653-3 14.782-8.435 27.087ZM235.13-283.913q51-38.435 113.435-59.805Q411-365.087 480-365.087q15.739 0 28.848.935 13.108.934 26.586 3.369l-75.564-76.13q-48.696-6.565-82.479-40.065-33.782-33.5-40.348-82.196L228.13-668.087Q197.826-626.521 182.305-579q-15.522 47.522-15.522 99 0 56.174 17.804 105.913t50.543 90.174Zm495.74-8.566q28.608-37.608 45.478-84.847Q793.217-424.565 793.217-480q0-131.87-90.674-222.543Q611.87-793.217 480-793.217q-52.609 0-99.565 16.304-46.956 16.304-88.522 46.043L730.87-292.479ZM480-60.782q-86.522 0-163.196-32.913-76.674-32.913-133.435-89.674-56.761-56.761-89.674-133.435Q60.782-393.478 60.782-480q0-86.957 32.913-163.413 32.913-76.457 89.674-133.218 56.761-56.761 133.152-89.674 76.392-32.913 162.914-32.913 86.956 0 163.413 32.913 76.457 32.913 133.501 89.674 57.043 56.761 89.956 133.218Q899.218-566.957 899.218-480q0 86.522-32.913 163.196-32.913 76.674-89.674 133.435-56.761 56.761-133.218 89.674Q566.957-60.782 480-60.782Z"/>
                                            </svg>
                                        ) }
                                        { deviceUnpairLoading ? "Despareando..." : "Desparear" }
                                    </button>
                                </div>
                                
                            </form>
                        ) : (
                            <form onSubmit={handleDevicePairConfirmation} className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "700ms" }}>
                        
                                <div className="w-full xl:w-[65%] flex flex-col justify-center items-start gap-2">
                                    <div className="w-full flex flex-row justify-start items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                            <path d="M779.131-390.611q-12.13-12.13-12.63-30.261-.5-18.13 11.63-33.261 30.435-38 47.652-85.217 17.218-47.217 17.218-100.783 0-51.434-16.652-97.586-16.653-46.153-46.522-84.153-11.565-15.13-11.565-32.978t13.13-30.978q14.565-14.565 34.348-14.565t32.348 15.13q42 51 65.717 113.565 23.718 62.565 23.718 131.565 0 71.261-24.283 134.392-24.283 63.13-67.413 114.696-12.565 15.13-32.348 15.065-19.783-.065-34.348-14.631ZM645.044-528.089q-10.435-11-11.935-28.218-1.5-17.217 7.37-35.347 5.869-10.87 8.804-22.957 2.935-12.087 2.935-24.391 0-12.304-2.935-24.109-2.935-11.804-8.239-22.108-8.87-18.131-7.37-35.631 1.5-17.5 12.5-28.5 15.696-15.695 37.109-15.195 21.413.5 32.413 17.761 15.305 23.869 23.609 50.956 8.304 27.087 8.304 56.826 0 30.304-9.152 57.674-9.152 27.369-24.456 51.239-11 16.696-32.131 17.196-21.13.5-36.826-15.196Zm-283.348 68.305q-74.479 0-126.849-52.369-52.37-52.37-52.37-126.849 0-74.479 52.37-126.849 52.37-52.369 126.849-52.369 74.478 0 126.848 52.369 52.37 52.37 52.37 126.849 0 74.479-52.087 126.849-52.087 52.369-127.131 52.369ZM75.478-101.912q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-78.783q0-41.478 22.37-74.435t52.37-47.957q51-26 119.239-44.848 68.24-18.848 145.24-18.848 77 0 145.239 18.283t119.239 44.283q30 15 52.37 48.522 22.37 33.522 22.37 75v78.783q0 22.087-15.457 37.544-15.456 15.457-37.544 15.457H75.478Z"/>
                                        </svg>
                                        <h1 className="font-lgc font-bold text-lg">Forçar Pareamento</h1>
                                    </div>

                                    <p className="font-lgc text-[17px]">Força o dispositivo a parear com a sua conta, apenas para gerentes e administradores, geralmente usado para a configuração inicial. Mas pode ser usado para pular a parte de passar seu cartão no dispositivo.</p>
                                </div>

                                <div disabled={devicePairLoading} className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                                    <button className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                        { devicePairLoading ? (
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                                <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                                <path d="M779.131-390.611q-12.13-12.13-12.63-30.261-.5-18.13 11.63-33.261 30.435-38 47.652-85.217 17.218-47.217 17.218-100.783 0-51.434-16.652-97.586-16.653-46.153-46.522-84.153-11.565-15.13-11.565-32.978t13.13-30.978q14.565-14.565 34.348-14.565t32.348 15.13q42 51 65.717 113.565 23.718 62.565 23.718 131.565 0 71.261-24.283 134.392-24.283 63.13-67.413 114.696-12.565 15.13-32.348 15.065-19.783-.065-34.348-14.631ZM645.044-528.089q-10.435-11-11.935-28.218-1.5-17.217 7.37-35.347 5.869-10.87 8.804-22.957 2.935-12.087 2.935-24.391 0-12.304-2.935-24.109-2.935-11.804-8.239-22.108-8.87-18.131-7.37-35.631 1.5-17.5 12.5-28.5 15.696-15.695 37.109-15.195 21.413.5 32.413 17.761 15.305 23.869 23.609 50.956 8.304 27.087 8.304 56.826 0 30.304-9.152 57.674-9.152 27.369-24.456 51.239-11 16.696-32.131 17.196-21.13.5-36.826-15.196Zm-283.348 68.305q-74.479 0-126.849-52.369-52.37-52.37-52.37-126.849 0-74.479 52.37-126.849 52.37-52.369 126.849-52.369 74.478 0 126.848 52.369 52.37 52.37 52.37 126.849 0 74.479-52.087 126.849-52.087 52.369-127.131 52.369ZM75.478-101.912q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-78.783q0-41.478 22.37-74.435t52.37-47.957q51-26 119.239-44.848 68.24-18.848 145.24-18.848 77 0 145.239 18.283t119.239 44.283q30 15 52.37 48.522 22.37 33.522 22.37 75v78.783q0 22.087-15.457 37.544-15.456 15.457-37.544 15.457H75.478Z"/>
                                            </svg>
                                        ) }
                                        { devicePairLoading ? "Pareando..." : "Parear" }
                                    </button>
                                </div>
                                
                            </form>
                        )
                    }

                    <form onSubmit={handleDeviceDisconnectConfirmation} className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        
                        <div className="w-full xl:w-[65%] flex flex-col justify-center items-start gap-2">
                            <div className="w-full flex flex-row justify-start items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M480-120q-42 0-71-29.5T380-220q0-42 29-71t71-29q42 0 71 29t29 71q0 41-29 70.5T480-120Zm333.347-427.521q-70.739-55.044-154.304-85Q575.478-662.477 480-662.477q-13.652 0-26.651.652-13 .652-26.217 2.521L307.609-778.826q44-12 84.696-16.587Q433-800 480-800q123.304 0 232.826 40.587 109.522 40.587 197.522 113.456 21.261 17.696 21.761 45.087.5 27.392-20.892 49.218-18.696 19.261-46.87 20.544-28.174 1.282-51-16.413ZM714.87-371.565l-24.196-24.196-24.195-24.196-137.783-137.217q60.348 7.131 113.913 28.87t97.173 54.217q21.696 16.13 22.544 43.239.848 27.109-19.413 47.37-5.609 5.608-13.087 8.695-7.478 3.087-14.956 3.218Zm38.651 290.391L418.522-417.608q-28.609 6.435-53.152 16.957-24.543 10.521-47.152 24.13-25.391 16.13-53.065 14.282-27.674-1.848-48.066-22.239-20.261-20.261-18.978-47.805 1.282-27.543 22.543-43.239 19.609-15.174 42.218-27.695 22.608-12.522 46.651-23.392l-76.999-76.999q-23.609 12.87-45.217 26.609-21.609 13.739-41.217 28.912-22.826 17.696-50.718 16.631-27.891-1.065-48.283-22.457-19.26-20.261-18.978-47.804.282-27.544 21.544-44.805 20.173-16.174 40.564-30.195 20.392-14.022 41.87-26.761l-50.913-51.478q-12.696-12.696-12.696-31.109 0-18.413 12.696-31.109Q93.869-829.87 112-829.87q18.13 0 30.826 12.696l673.348 673.348Q828.87-131.13 828.87-112.5q0 18.63-12.696 31.326-13.131 13.13-31.544 12.913-18.413-.217-31.109-12.913Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-lg">Desconectar Dispositivo</h1>
                            </div>

                            <p className="font-lgc text-[17px]">Força a desconexão do dispositivo, o dispositivo terá que se reconectar, não use, a não ser que seja um dispositivo fantasma.</p>
                        </div>

                        <div disabled={deviceDisconnectLoading} className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                            <button className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                { deviceDisconnectLoading ? (
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" className="fill-white fast-fade-in">
                                        <path d="M480-120q-42 0-71-29.5T380-220q0-42 29-71t71-29q42 0 71 29t29 71q0 41-29 70.5T480-120Zm333.347-427.521q-70.739-55.044-154.304-85Q575.478-662.477 480-662.477q-13.652 0-26.651.652-13 .652-26.217 2.521L307.609-778.826q44-12 84.696-16.587Q433-800 480-800q123.304 0 232.826 40.587 109.522 40.587 197.522 113.456 21.261 17.696 21.761 45.087.5 27.392-20.892 49.218-18.696 19.261-46.87 20.544-28.174 1.282-51-16.413ZM714.87-371.565l-24.196-24.196-24.195-24.196-137.783-137.217q60.348 7.131 113.913 28.87t97.173 54.217q21.696 16.13 22.544 43.239.848 27.109-19.413 47.37-5.609 5.608-13.087 8.695-7.478 3.087-14.956 3.218Zm38.651 290.391L418.522-417.608q-28.609 6.435-53.152 16.957-24.543 10.521-47.152 24.13-25.391 16.13-53.065 14.282-27.674-1.848-48.066-22.239-20.261-20.261-18.978-47.805 1.282-27.543 22.543-43.239 19.609-15.174 42.218-27.695 22.608-12.522 46.651-23.392l-76.999-76.999q-23.609 12.87-45.217 26.609-21.609 13.739-41.217 28.912-22.826 17.696-50.718 16.631-27.891-1.065-48.283-22.457-19.26-20.261-18.978-47.804.282-27.544 21.544-44.805 20.173-16.174 40.564-30.195 20.392-14.022 41.87-26.761l-50.913-51.478q-12.696-12.696-12.696-31.109 0-18.413 12.696-31.109Q93.869-829.87 112-829.87q18.13 0 30.826 12.696l673.348 673.348Q828.87-131.13 828.87-112.5q0 18.63-12.696 31.326-13.131 13.13-31.544 12.913-18.413-.217-31.109-12.913Z"/>
                                    </svg>
                                ) }
                                { deviceDisconnectLoading ? "Desconectando..." : "Desconectar" }
                            </button>
                        </div>
                        
                    </form>

                </div>

            </div>   

        </>
    );

};

Dispositivo.requiresUser = true;

Dispositivo.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Dispositivos"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Dispositivo;