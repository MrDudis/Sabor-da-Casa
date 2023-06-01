import { useContext } from "react";
import Link from "next/link";

import UserContext from "@/providers/user/UserContext";

import { Role } from "@/models/User";

import styles from "@/styles/painel/Layout.module.css";

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
                        <p className="hidden lg:block font-lgc text-xs text-neutral-300">CLIENTE</p>
                        <div className="w-full border-b border-neutral-300 mb-2"></div>
                    </div>

                    <Link href="/painel/pedidos" className={activePage == "Meus Pedidos" ? styles.sidebarLinkActive : styles.sidebarLink}>

                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 96 960 960" width="22" className="fill-white">
                            <path d="m684.217 825.522-13.043-13.609q-10.696-10.695-25.457-10.413-14.761.283-25.457 10.979-10.695 10.695-10.695 24.956t10.695 24.957l36.174 36.174q12.083 11.826 28.194 11.826 16.111 0 27.937-11.826l93.609-92.174q10.696-10.646 10.696-25.432 0-14.786-10.696-25.481-10.696-10.696-25.457-10.413-14.761.282-25.457 10.413l-71.043 70.043Zm-11-361.043q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5H286.783q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5h386.434Zm40 563.961q-83 0-141.5-58.505-58.5-58.5-58.5-141.5t58.5-141.5q58.5-58.5 141.5-58.5t141.5 58.5q58.5 58.5 58.5 141.5t-58.5 141.5q-58.5 58.505-141.5 58.505ZM206.783 198.477h546.434q43.726 0 74.863 31.138 31.138 31.138 31.138 74.864v285.653q-32.522-20.783-69.522-31.24-37-10.457-75.914-10.457v-10.739H286.783q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5h242.869q-17.626 15.482-32.661 33.697-15.034 18.216-27.165 39.52H286.783q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5h152.26q-3.695 14.522-5.326 28.826-1.63 14.305-1.63 30.392 0 45.957 14.326 88.696 14.326 42.74 42.413 79.435-7.261.435-14.456-1.782-7.196-2.218-12.327-7.348l-26.913-26.913q-7.695-7.696-18.521-7.696-10.827 0-18.522 7.696l-26.348 26.348q-7.696 7.695-18.522 7.695-10.826 0-18.522-7.695l-26.347-26.348q-7.696-7.696-18.522-7.696-10.827 0-18.522 7.696l-26.913 26.348q-7.696 7.695-18.522 7.695-10.826 0-18.522-7.695l-25.782-25.783q-8.159-8.261-19.036-8.261-10.878 0-18.574 8.261l-25.217 25.783q-1.13 1.695-17.956 9V304.479q0-43.726 31.138-74.864 31.137-31.138 74.863-31.138Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Pedidos</p>

                    </Link>

                    <Link href="/painel/recompensas" className={activePage == "Recompensas" ? styles.sidebarLinkActive : styles.sidebarLink}>

                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white">
                            <path d="M166.783-278.304v71.521h626.434v-71.521H166.783Zm0-460.914h63.694q-4.434-9.566-6.217-19.383-1.783-9.818-1.783-20.617 0-53.533 37.827-91.006 37.826-37.473 91.217-37.473 31.256 0 57.824 15.5 26.568 15.5 46.133 40.196L480-820.914l24.522-31.087q19.13-25.131 46.027-40.413 26.896-15.283 57.93-15.283 53.391 0 91.217 37.473 37.827 37.473 37.827 91.006 0 11-1.5 21t-6.5 19h63.694q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v426.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-426.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848Zm0 323.391h626.434v-217.39h-181.39l47.564 66.173q10.566 15.131 8 32.892-2.565 17.761-18.308 28.514-15.744 10.377-33.175 7.877-17.43-2.5-27.995-17.761L480-665.13 372.087-515.522q-10.565 15.261-28.012 17.761-17.447 2.5-33.205-8.065-15.131-10.565-18.196-28.044-3.065-17.478 7.5-33.174l47.13-66.173H166.783v217.39Zm184.738-323.391q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm256.958 0q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Recompensas</p>

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

                        <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 96 960 960" width="22" className="fill-white">
                            <path d="M162.87 904.131q-37.783 0-64.392-26.609Q71.87 850.913 71.87 813.13V338.87q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v474.26q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H162.87Zm0-328.848h634.26v-160H162.87v160Z"/>
                        </svg>

                        <p className={styles.sidebarLinkText}>Comandas</p>

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