import Link from "next/link";

export default function Sidebar({ activePage }) {

    return (
        <div className="absolute sm:static bottom-0 flex flex-row sm:flex-col justify-between items-start w-full sm:w-[80px] sm:min-w-[80px] lg:w-[256px] lg:min-w-[256px] h-20 sm:min-h-screen sm:h-full bg-neutral-800 px-2 sm:px-6 sm:py-10 gap-8 transition-all">

            <div className="w-full hidden sm:flex flex-col items-center justify-center gap-2">
                <h1 className="font-august text-white text-5xl text-center cursor-pointer hidden lg:block" onClick={() => { window.location.href = "/" }}>Sabor da Casa</h1>
                <h1 className="font-august text-white text-5xl text-center cursor-pointer block lg:hidden" onClick={() => { window.location.href = "/" }}>S</h1>
            </div>

            <div className="w-full h-full sm:h-auto flex flex-row sm:flex-col items-center justify-center sm:items-start sm:justify-start gap-2 sm:py-4 sm:border-t sm:border-b sm:border-neutral-600">

                <Link href="/painel" className="w-full flex flex-row justify-center lg:justify-start items-center gap-3 rounded-lg lg:px-4 py-[12px] sm:py-[6px] cursor-pointer hover:bg-neutral-900 transition-all" style={{ backgroundColor: activePage == "Início" ? "rgb(23, 23, 23)" : "" }}>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                        <path d="M242.87 944.131q-37.538 0-64.269-26.732-26.732-26.731-26.732-64.269V497.435q0-21.658 9.816-41.036 9.815-19.377 26.728-31.812l236.891-177.609q12.435-9.196 26.229-13.793 13.793-4.598 28.467-4.598t28.467 4.598q13.794 4.597 26.229 13.793l236.891 177.609q17.13 12.521 26.837 31.871 9.707 19.35 9.707 40.977V853.13q0 37.538-26.732 64.269-26.731 26.732-64.269 26.732H561.913V654.087H398.087v290.044H242.87Z"/>
                    </svg>

                    <p className="font-lgc font-bold text-white text-lg hidden lg:block">Início</p>

                </Link>
                
                <Link href="/painel/produtos" className="w-full flex flex-row justify-center lg:justify-start items-center gap-3 rounded-lg lg:px-4 py-[12px] sm:py-[6px] cursor-pointer hover:bg-neutral-900 transition-all" style={{ backgroundColor: activePage == "Produtos" ? "rgb(23, 23, 23)" : "" }}>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                        <path d="M202.87 985.087q-37.783 0-64.392-26.609-26.609-26.608-26.609-64.391V445.435q-17-11.643-28.5-29.637t-11.5-44.102V258.87q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v112.826q0 26.108-11.5 44.102-11.5 17.994-28.5 29.637v448.652q0 37.783-26.609 64.391-26.609 26.609-64.392 26.609H202.87Zm0-522.391v431.391h554.26V462.696H202.87Zm594.26-91V258.87H162.87v112.826h634.26ZM397.37 658.87h165.26q17.712 0 29.693-11.983 11.981-11.982 11.981-29.695 0-17.714-11.981-29.812-11.981-12.097-29.693-12.097H397.37q-17.712 0-29.693 12.05-11.981 12.05-11.981 29.863 0 17.711 11.981 29.692 11.981 11.982 29.693 11.982Zm-194.5 235.217V462.696v431.391Z"/>
                    </svg>

                    <p className="font-lgc font-bold text-white text-lg hidden lg:block">Produtos</p>

                </Link>

                <Link href="/painel/pessoas" className="w-full flex flex-row justify-center lg:justify-start items-center gap-3 rounded-lg lg:px-4 py-[12px] sm:py-[6px] cursor-pointer hover:bg-neutral-900 transition-all" style={{ backgroundColor: activePage == "Pessoas" ? "rgb(23, 23, 23)" : "" }}>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                        <path d="M480 571.935q-69.587 0-118.859-49.272-49.272-49.272-49.272-118.859 0-69.587 49.272-118.739T480 235.913q69.587 0 118.859 49.152 49.272 49.152 49.272 118.739t-49.272 118.859Q549.587 571.935 480 571.935ZM242.87 908.196q-37.783 0-64.392-26.609-26.609-26.609-26.609-64.391v-29.609q0-36.152 18.696-66.565 18.696-30.413 49.848-46.37 62.717-31.239 127.674-46.978Q413.043 611.935 480 611.935q67.435 0 132.391 15.619 64.957 15.62 127.196 46.859 31.152 15.957 49.848 46.25 18.696 30.294 18.696 66.924v29.609q0 37.782-26.609 64.391-26.609 26.609-64.392 26.609H242.87Z"/>
                    </svg>

                    <p className="font-lgc font-bold text-white text-lg hidden lg:block">Pessoas</p>

                </Link>

                <Link href="/painel/cartoes" className="w-full flex flex-row justify-center lg:justify-start items-center gap-3 rounded-lg lg:px-4 py-[12px] sm:py-[6px] cursor-pointer hover:bg-neutral-900 transition-all" style={{ backgroundColor: activePage == "Cartões" ? "rgb(23, 23, 23)" : "" }}>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                        <path d="M162.87 904.131q-37.783 0-64.392-26.609Q71.87 850.913 71.87 813.13V338.87q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v474.26q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H162.87Zm0-328.848h634.26v-160H162.87v160Z"/>
                    </svg>

                    <p className="font-lgc font-bold text-white text-lg hidden lg:block">Cartões</p>

                </Link>

                <Link href="/painel/configuracoes" className="w-full flex flex-row justify-center lg:justify-start items-center gap-3 rounded-lg lg:px-4 py-[12px] sm:py-[6px] cursor-pointer hover:bg-neutral-900 transition-all" style={{ backgroundColor: activePage == "Configurações" ? "rgb(23, 23, 23)" : "" }}>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                        <path d="M363.065 984.131 346.587 853.5q-11.087-4.282-21.033-10.326-9.945-6.043-19.511-12.848l-121.391 51.196L67.478 678.609l104.913-79.435q-.761-6.044-.761-11.587v-23.174q0-5.543.761-11.587L67.478 473.391l117.174-202.435 121.87 50.957q9.565-6.804 19.652-12.728 10.087-5.924 20.413-10.207l16.478-131.109h233.87l16.478 131.109q11.087 4.283 21.033 10.207 9.945 5.924 19.511 12.728l121.391-50.957 117.174 202.435-105.152 79.435q.761 6.044.761 11.587V576q0 6.043-.12 11.587-.12 5.543-1.641 11.587l105.152 79.435-117.413 202.913-120.631-51.196q-9.565 6.805-19.652 12.848-10.087 6.044-20.413 10.326l-16.478 130.631h-233.87ZM481.283 716q58 0 99-41t41-99q0-58-41-99t-99-41q-58.761 0-99.381 41-40.619 41-40.619 99t40.619 99q40.62 41 99.381 41Z"/>
                    </svg>

                    <p className="font-lgc font-bold text-white text-lg hidden lg:block">Configurações</p>

                </Link>

            </div>

            <div className="w-full min-h-[86px] hidden sm:flex flex-col items-center justify-end gap-1">
                <p className="font-lgc text-neutral-400 text-xs text-center cursor-pointer">Copyright © 2023</p>
                <p className="font-lgc text-neutral-400 text-xs text-center cursor-pointer hidden lg:block">Todos os direitos reservados.</p>
            </div>

        </div>
    );

}