import { useContext, useState, useEffect } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import * as devicesLib from "@/lib/devices";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import DeviceBox from "@/components/painel/dispositivos/DeviceBox";

import { MessageModal } from "@/components/elements/modal/Modal";

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

function Dispositivos({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);

    const [timerState, setTimerState] = useState(false);

    useEffect(() => {
        
        let timer = setInterval(() => {
            setTimerState(!timerState);
        }, 5000);

        return () => {
            clearInterval(timer);
        };

    }, [timerState]);

    const [devices, setDevices] = useState([]);

    const fetchDevices = async () => {
        setTimerState(false);

        let response = await devicesLib.getAll();

        if (response.status === 200) {
            setDevices(response.devices); setTimerState(true);
        } else {
            showModal(
                <MessageModal 
                    icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
    
            router.push("/painel");
        };

    };

    useEffect(() => { fetchDevices(); }, []);

    useEffect(() => {
        if (!socket) { return; };
        
        const deviceCreate = (data) => {
            if (!data) { return; };

            setDevices([ ...devices, data.device ]);
        };

        socket.on("DEVICE_CREATE", deviceCreate);

        const deviceUpdate = (data) => {
            if (!data) { return; };
            
            let otherDevices = devices.filter(device => device.id != data.device.id);
            setDevices([ ...otherDevices, data.device ]);
        };

        socket.on("DEVICE_UPDATE", deviceUpdate);

        const deviceDelete = (data) => {
            if (!data) { return; };

            setDevices(devices.filter(device => device.id != data.device.id));
        };

        socket.on("DEVICE_DELETE", deviceDelete);

        return () => {
            socket.off("DEVICE_CREATE", deviceCreate);
            socket.off("DEVICE_UPDATE", deviceUpdate);
            socket.off("DEVICE_DELETE", deviceDelete);
        };
    }, [socket, devices]);

    return (
        <>

            <Head>
                <title>Painel | Dispositivos | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Dispositivos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de dispositivos do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start border-b border-neutral-800 scale-right-to-left">
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl text-left slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Dispositivos</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">Dispositivos</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">

                <div className="w-full flex flex-row justify-start items-center gap-3 p-3 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                    
                    { timerState ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" className="fill-neutral-900 fast-fade-in">
                            <path d="M761.13-621.782q-7.26 0-14.174-3.566-6.913-3.565-10.608-11.826l-30.87-67.739-67.174-30.869q-8.261-3.696-12.109-10.327-3.847-6.63-3.847-13.891t3.847-14.174q3.848-6.913 12.109-10.609l67.174-30.304 30.87-67.739q3.695-8.261 10.608-12.109 6.914-3.848 14.174-3.848 7.261 0 13.892 3.848 6.63 3.848 10.326 12.109l30.87 67.739 67.173 30.304q8.261 3.696 12.109 10.609 3.848 6.913 3.848 14.174 0 7.261-3.848 13.891-3.848 6.631-12.109 10.327l-67.173 30.869-30.87 67.739q-3.696 8.261-10.326 11.826-6.631 3.566-13.892 3.566Zm0 560q-7.26 0-14.174-3.566-6.913-3.565-10.608-11.826l-30.87-67.739-67.174-30.869q-8.261-3.696-12.109-10.327-3.847-6.63-3.847-13.891t3.847-14.174q3.848-6.913 12.109-10.609l67.174-30.304 30.87-67.739q3.695-8.261 10.608-12.109 6.914-3.848 14.174-3.848 7.261 0 13.892 3.848 6.63 3.848 10.326 12.109l30.87 67.739 67.173 30.304q8.261 3.696 12.109 10.609 3.848 6.913 3.848 14.174 0 7.261-3.848 13.891-3.848 6.631-12.109 10.327l-67.173 30.869-30.87 67.74q-3.696 8.26-10.326 11.826-6.631 3.565-13.892 3.565ZM363.391-213.61q-14.391 0-27.5-7.978t-20.37-22.935l-58.912-128.695-128.696-58.913q-14.956-7.261-22.935-20.37Q97-465.609 97-480t7.978-27.5q7.979-13.109 22.935-20.37l128.696-58.913 58.912-128.695q7.261-14.957 20.37-22.935 13.109-7.978 27.5-7.978 14.392 0 27.783 7.978 13.392 7.978 20.653 22.935l58.347 128.695L598.87-527.87q14.956 7.261 22.935 20.37 7.978 13.109 7.978 27.5t-7.978 27.5q-7.979 13.109-22.935 20.37l-128.696 58.913-58.347 128.695q-7.261 14.957-20.653 22.935-13.391 7.978-27.783 7.978Z"/>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                            <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                        </svg>
                    )}

                    <p className="font-lgc">Esta página atualiza em tempo real.</p>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6">

                    {
                        devices.map((deviceData, index) => {
                            return <DeviceBox device={deviceData} key={index}></DeviceBox>;
                        })
                    }

                </div>

                {
                    devices.length == 0 ? (
                        <div className="w-full flex flex-col justify-center items-center gap-6 mt-24 fast-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="slide-up-fade-in opacity-0 animate-spin">
                                <path d="M480-288.479q-17 0-29.5-12.5t-12.5-29.5q0-17 12.5-29.5t29.5-12.5q17 0 29.5 12.5t12.5 29.5q0 17-12.5 29.5t-29.5 12.5Zm-92.696-290.659q-10-5.514-12.434-16.449-2.435-10.934 4-20.934 17.179-26 43.959-40.5 26.78-14.5 57.097-14.5 48.507 0 81.856 27.5 33.348 27.5 33.348 74.5 0 24.367-12.5 44.835-12.5 20.469-29.5 37.469-12.434 11.869-24.652 24.304-12.217 12.435-16.574 29.418Q509-422.174 500.5-413.674q-8.5 8.5-20.5 8.5t-20.5-8q-8.5-8-8.5-19.591 0-24.07 15-43.326 15-19.257 34-35.126 13.565-11.87 23.783-25.694Q534-550.735 534-567.521q0-20.246-16.217-33.406-16.218-13.16-37.557-13.16-14.226 0-27.726 6.5-13.5 6.5-21.5 18.5-8 11-20.348 13.783-12.348 2.783-23.348-3.834Zm-98.825 556.66q-44.305 0-75.153-30.848-30.849-30.848-30.849-75.153v-703.042q0-44.305 30.849-75.153 30.848-30.849 75.153-30.849h383.042q44.305 0 75.153 30.849 30.849 30.848 30.849 75.153v703.042q0 44.305-30.849 75.153-30.848 30.849-75.153 30.849H288.479Zm0-226.001h383.042v-463.042H288.479v463.042Z"/>
                            </svg>

                            <div className="flex flex-col text-center gap-1">
                                <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Nenhum dispositivo encontrado.</p>
                                <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>Certifique-se que os dispositivos tem acesso a internet.</p>
                            </div>
                        </div>
                    ) : null
                }

            </div>

        </>
    );

};

Dispositivos.requiresUser = true;

Dispositivos.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Dispositivos"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Dispositivos;