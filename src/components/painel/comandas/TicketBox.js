import Link from "next/link";

export default function TicketBox({ ticket, animationDelay }) {

    if (!ticket) {
        return (
            <div className="w-full min-w-[86px] h-52 flex flex-col xs:flex-row items-center px-4 py-4 border border-neutral-400 transition-all bg-neutral-100 gap-6 rounded-lg shimmer smooth-slide-down-fade-in opacity-0" style={{ animationDelay: `${animationDelay}ms` }}>
    
            </div>
        );
    };

    return (
        <Link href={`/painel/comandas/${ticket?.id}`} className="relative w-full min-w-[86px] h-52 flex flex-col justify-between items-start gap-4 p-3 border border-neutral-400 cursor-pointer hover:bg-neutral-50 hover:shadow-xl hover:scale-[102%] transition-all bg-neutral-100 rounded-lg fast-fade-in">

            <div className="w-full flex flex-col justify-center items-start gap-3">
                <div className="w-full flex flex-row justify-start items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                        <path d="M480-489.609q-74.479 0-126.849-52.37-52.369-52.37-52.369-126.849 0-74.478 52.369-126.565 52.37-52.088 126.849-52.088 74.479 0 126.849 52.088 52.369 52.087 52.369 126.565 0 74.479-52.369 126.849-52.37 52.37-126.849 52.37ZM246.783-131.172q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-26.347q0-39.088 20.326-72.109 20.326-33.022 54.413-50.283 63.696-31.566 129.957-47.631T480-449.609q69.391 0 135.652 15.782 66.261 15.783 128.827 47.348 34.087 17.261 54.413 50.001 20.326 32.739 20.326 72.957v26.347q0 44.305-30.848 75.153-30.848 30.849-75.153 30.849H246.783Z"/>
                    </svg>
                    <p className="font-lgc font-bold text-sm truncate">{ticket?.user?.name ?? "Ninguém"}</p>
                </div>

                <div className="px-2 py-0.5 bg-neutral-200 rounded-md">
                    <p className="font-lgc text-sm">{ticket?.active ? "Ativo" : "Inativo"}</p>
                </div>
            </div>

            <div className="w-full flex flex-row justify-start items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16">
                    <path d="M206.783-58.52q-44.305 0-75.153-30.849-30.848-30.848-30.848-75.153v-444.087q-17-12.519-28.5-31.868-11.5-19.349-11.5-49.697v-103.043q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h626.434q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v103.043q0 30.348-11.5 49.697-11.5 19.349-28.5 31.868v444.087q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-525.653v419.651h546.434v-419.651H206.783Zm586.434-106.001v-103.043H166.783v103.043h626.434ZM393.782-393.217h172.436q18.681 0 31.319-12.64 12.637-12.641 12.637-31.327t-12.637-31.599q-12.638-12.913-31.319-12.913H393.782q-18.681 0-31.319 12.8-12.637 12.8-12.637 31.722 0 18.682 12.637 31.319 12.638 12.638 31.319 12.638ZM206.783-164.522v-419.651 419.651Z"/>
                </svg>
                <p className="font-lgc font-bold text-sm truncate">{ticket.products?.length}</p>
            </div>
            
            <div className="absolute flex flex-row justify-end items-end right-1 -bottom-1">
                <p className="font-lgc text-8xl font-bold opacity-90">{ticket?.id}</p>
            </div>

        </Link>
    );

};