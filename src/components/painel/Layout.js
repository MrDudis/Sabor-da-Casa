import { useContext } from "react";
import Link from "next/link";

import UserContext from "../../providers/user/UserContext.js";

import { Role } from "../../models/User.js";

import styles from "../../styles/painel/Layout.module.css";

export default function Dashboard({ children, activePage }) {

    const { user } = useContext(UserContext);

    if (!user) { return null; }
    
    return (
        <div className="flex w-full h-full mt-8 2xs:mt-0">

            <div className={styles.sidebar}>

                <div className="w-full hidden sm:flex flex-col items-center justify-center gap-2">
                    <h1 className="font-august text-white text-5xl text-center cursor-pointer hidden lg:block" onClick={() => { window.location.href = "/" }}>Sabor da Casa</h1>
                    <h1 className="font-august text-white text-5xl text-center cursor-pointer block lg:hidden" onClick={() => { window.location.href = "/" }}>S</h1>
                </div>

                <div className="w-full h-full sm:h-auto flex flex-row sm:flex-col items-center justify-center sm:items-start sm:justify-start gap-2 sm:gap-0">

                    <Link href="/painel" className={activePage == "Início" ? styles.sidebarLinkActive : styles.sidebarLink}>

                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 96 960 960" width="22" className="fill-white">
                            <path d="M242.87 944.131q-37.538 0-64.269-26.732-26.732-26.731-26.732-64.269V497.435q0-21.658 9.816-41.036 9.815-19.377 26.728-31.812l236.891-177.609q12.435-9.196 26.229-13.793 13.793-4.598 28.467-4.598t28.467 4.598q13.794 4.597 26.229 13.793l236.891 177.609q17.13 12.521 26.837 31.871 9.707 19.35 9.707 40.977V853.13q0 37.538-26.732 64.269-26.731 26.732-64.269 26.732H561.913V654.087H398.087v290.044H242.87Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Início</p>

                    </Link>

                    <div className="w-full hidden sm:flex flex-row px-6 py-4 gap-2">
                        <p className="hidden lg:block font-lgc text-xs text-neutral-300">RESTAURANTE</p>
                        <div className="w-full border-b border-neutral-300 mb-2"></div>
                    </div>

                    <Link href="/painel/produtos" className={activePage == "Produtos" ? styles.sidebarLinkActive : styles.sidebarLink}>

                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 96 960 960" width="22" className="fill-white">
                            <path d="M202.87 985.087q-37.783 0-64.392-26.609-26.609-26.608-26.609-64.391V445.435q-17-11.643-28.5-29.637t-11.5-44.102V258.87q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v112.826q0 26.108-11.5 44.102-11.5 17.994-28.5 29.637v448.652q0 37.783-26.609 64.391-26.609 26.609-64.392 26.609H202.87Zm0-522.391v431.391h554.26V462.696H202.87Zm594.26-91V258.87H162.87v112.826h634.26ZM397.37 658.87h165.26q17.712 0 29.693-11.983 11.981-11.982 11.981-29.695 0-17.714-11.981-29.812-11.981-12.097-29.693-12.097H397.37q-17.712 0-29.693 12.05-11.981 12.05-11.981 29.863 0 17.711 11.981 29.692 11.981 11.982 29.693 11.982Zm-194.5 235.217V462.696v431.391Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Produtos</p>

                    </Link>

                    {
                        user?.role <= Role.CASHIER ? (
                            <Link href="/painel/pessoas" className={activePage == "Pessoas" ? styles.sidebarLinkActive : styles.sidebarLink}>

                                <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 96 960 960" width="22" className="fill-white">
                                    <path d="M480 571.935q-69.587 0-118.859-49.272-49.272-49.272-49.272-118.859 0-69.587 49.272-118.739T480 235.913q69.587 0 118.859 49.152 49.272 49.152 49.272 118.739t-49.272 118.859Q549.587 571.935 480 571.935ZM242.87 908.196q-37.783 0-64.392-26.609-26.609-26.609-26.609-64.391v-29.609q0-36.152 18.696-66.565 18.696-30.413 49.848-46.37 62.717-31.239 127.674-46.978Q413.043 611.935 480 611.935q67.435 0 132.391 15.619 64.957 15.62 127.196 46.859 31.152 15.957 49.848 46.25 18.696 30.294 18.696 66.924v29.609q0 37.782-26.609 64.391-26.609 26.609-64.392 26.609H242.87Z"/>
                                </svg>

                                <p className={styles.sidebarLinkText}>Pessoas</p>

                            </Link>
                        ) : null
                    }

                    <Link href="/painel/comandas" className={activePage == "Comandas" ? styles.sidebarLinkActive : styles.sidebarLink}>

                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" className="fill-white">
                            <path d="M166.783-140.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-138.391q0-11 6.717-18.718 6.717-7.717 17.717-9.717 23.435-6.87 39.5-24.761 16.066-17.891 16.066-41.63 0-24.304-16.066-42.195-16.065-17.892-39.5-24.196-11-2-17.717-9.717-6.717-7.718-6.717-18.718v-138.391q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v138.957q0 11-6.717 18.434-6.717 7.435-17.717 9.435-23.435 6.304-39.5 24.196-16.066 17.891-16.066 42.195 0 23.739 16.066 41.63 16.065 17.891 39.5 24.761 11 2 17.717 9.435 6.717 7.434 6.717 18.434v138.957q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783ZM480-284.522q18.696 0 31.609-12.913t12.913-31.044q0-18.695-12.913-31.609-12.913-12.913-31.609-12.913-18.13 0-31.326 12.913-13.196 12.914-13.196 31.609 0 18.131 13.196 31.044T480-284.522Zm0-150.956q18.696 0 31.609-13.196T524.522-480q0-18.696-12.913-31.609T480-524.522q-18.13 0-31.326 12.913-13.196 12.913-13.196 31.609 0 18.13 13.196 31.326Q461.87-435.478 480-435.478Zm0-151.521q18.696 0 31.609-13.196t12.913-31.326q0-18.696-12.913-31.327-12.913-12.63-31.609-12.63-18.13 0-31.326 12.63-13.196 12.631-13.196 31.327 0 18.13 13.196 31.326Q461.87-586.999 480-586.999Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Comandas</p>

                    </Link>

                    <Link href="/painel/dispositivos" className={activePage == "Dispositivos" ? styles.sidebarLinkActive : styles.sidebarLink}>

                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" className="fill-white">
                            <path d="M631.521-22.477V-128.48h40v-583.042H288.479V-480H182.477v-351.521q0-44.305 30.849-75.153 30.848-30.849 75.153-30.849h383.042q44.305 0 75.153 30.849 30.849 30.848 30.849 75.153v703.042q0 44.305-30.849 75.153-30.848 30.849-75.153 30.849h-40ZM358.695-198.695q27 27 44.565 60.848 17.566 33.848 24.696 71.848 3.131 17.695-9.565 30.608-12.696 12.914-31.518 12.914-18.823 0-32.109-11.914-13.287-11.913-18.417-30.608-5.565-19.87-15.783-37.739-10.217-17.87-25.087-32.739-14.869-14.87-32.739-25.087-17.869-10.218-37.739-15.783-18.695-5.13-30.609-18.417-11.913-13.286-11.913-32.109 0-18.822 12.913-31.518 12.914-12.696 30.609-9.565 38 7.13 71.848 24.696 33.848 17.565 60.848 44.565Zm126-99.435q42.565 46.565 69.631 104.348 27.065 57.783 34.63 123.783 2 18.787-10.579 33.154-12.579 14.368-31.326 14.368t-32.16-13.13q-13.414-13.131-15.979-31.827-6.565-48.304-26.5-90.891t-50.804-77.022q-38-42.435-88.652-69.717-50.652-27.283-110.652-34.848-17.696-2-28.761-15.696-11.066-13.696-11.066-31.472 0-18.888 11.783-31.664 11.783-12.777 28.176-10.777 77.868 8 144.998 42.13 67.131 34.131 117.261 89.261ZM226.999-22.477q-18.922 0-31.722-12.8T182.477-67q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8T271.521-67q0 18.921-12.8 31.722-12.8 12.8-31.722 12.8Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Dispositivos</p>

                    </Link>

                    <Link href="/painel/cartoes" className={activePage == "Cartões" ? styles.sidebarLinkActive : styles.sidebarLink}>

                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 96 960 960" width="22" className="fill-white">
                            <path d="M162.87 904.131q-37.783 0-64.392-26.609Q71.87 850.913 71.87 813.13V338.87q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v474.26q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H162.87Zm0-328.848h634.26v-160H162.87v160Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Cartões</p>

                    </Link>

                    <Link href="/painel/conta" className={activePage == "Minha Conta" ? styles.sidebarLinkActiveMobileOnly : styles.sidebarLinkMobileOnly}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="26" viewBox="0 96 960 960" height="26" className="fill-white">
                            <path d="M236.826 771.521q51-37.869 112.87-59.239Q411.565 690.913 480 690.913t131.152 22.217q62.718 22.218 112.022 58.957 33.304-41.566 51.674-90.457 18.369-48.891 18.369-105.63 0-129.609-91.804-221.413T480 262.783q-129.609 0-221.413 91.804T166.783 576q0 56.174 18.087 105.065t51.956 90.456ZM480 621.087q-61.261 0-102.891-41.348-41.631-41.348-41.631-102.609 0-61.26 41.631-102.891 41.63-41.63 102.891-41.63t102.891 41.63q41.631 41.631 41.631 102.891 0 61.261-41.631 102.609-41.63 41.348-102.891 41.348Zm0 374.131q-86.957 0-163.348-32.913-76.392-32.913-133.218-89.739-56.826-56.826-89.74-133.218Q60.783 662.957 60.783 576q0-86.957 32.913-163.348 32.913-76.392 89.739-133.218 56.826-56.826 133.218-89.739Q393.043 156.782 480 156.782q86.957 0 163.348 32.913 76.392 32.913 133.218 89.739 56.826 56.826 89.739 133.218Q899.218 489.043 899.218 576q0 86.957-32.913 163.348-32.913 76.392-89.739 133.218-56.826 56.826-133.218 89.739Q566.957 995.218 480 995.218Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Conta</p>

                    </Link>

                </div>

                <Link href="/painel/conta" className="w-full min-h-[64px] px-6 mt-8 hidden sm:flex flex-row items-center justify-start gap-4 cursor-pointer hover:bg-neutral-800 transition-all" style={{ backgroundColor: activePage == "Minha Conta" ? "rgb(52, 52, 52)" : "" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" viewBox="0 96 960 960" height="32" className="fill-white">
                        <path d="M236.826 771.521q51-37.869 112.87-59.239Q411.565 690.913 480 690.913t131.152 22.217q62.718 22.218 112.022 58.957 33.304-41.566 51.674-90.457 18.369-48.891 18.369-105.63 0-129.609-91.804-221.413T480 262.783q-129.609 0-221.413 91.804T166.783 576q0 56.174 18.087 105.065t51.956 90.456ZM480 621.087q-61.261 0-102.891-41.348-41.631-41.348-41.631-102.609 0-61.26 41.631-102.891 41.63-41.63 102.891-41.63t102.891 41.63q41.631 41.631 41.631 102.891 0 61.261-41.631 102.609-41.63 41.348-102.891 41.348Zm0 374.131q-86.957 0-163.348-32.913-76.392-32.913-133.218-89.739-56.826-56.826-89.74-133.218Q60.783 662.957 60.783 576q0-86.957 32.913-163.348 32.913-76.392 89.739-133.218 56.826-56.826 133.218-89.739Q393.043 156.782 480 156.782q86.957 0 163.348 32.913 76.392 32.913 133.218 89.739 56.826 56.826 89.739 133.218Q899.218 489.043 899.218 576q0 86.957-32.913 163.348-32.913 76.392-89.739 133.218-56.826 56.826-133.218 89.739Q566.957 995.218 480 995.218Z"/>
                    </svg>
                    <div className="hidden lg:flex flex-col items-start justify-center">
                        <h1 className="text-white text-base font-lgc font-bold">Minha Conta</h1>
                        <p className="max-w-[160px] h-full text-white text-sm font-lgc truncate">{user?.name}</p>
                    </div>
                </Link>

            </div>

            <div className="flex w-full fast-fade-in">

                <div className="w-full pb-24 sm:pb-6 p-6 sm:p-10 overflow-auto min-h-screen max-h-screen">

                    {children}

                </div>

            </div>

        </div>
    );

}