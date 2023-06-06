import Link from "next/link";

export default function DeviceBox({ device }) {

    if (!device) {
        return null;
    };

    return (
        <Link href={`/painel/dispositivos/${device?.id}`} className="w-full min-w-[124px] h-24 flex flex-row justify-start items-center gap-4 px-4 py-4 border border-neutral-400 cursor-pointer hover:bg-neutral-50 hover:shadow-xl hover:scale-[102%] transition-all bg-neutral-100 rounded-lg fast-fade-in opacity-0" style={{ animationDelay: "400ms" }}>

            <div className="flex justify-start items-center mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                    <path d="M283.587-32.587q-37.783 0-64.391-26.609-26.609-26.608-26.609-64.391v-712.826q0-37.783 26.609-64.391 26.608-26.609 64.391-26.609h392.826q37.783 0 64.391 26.609 26.609 26.608 26.609 64.391v712.826q0 37.783-26.609 64.391-26.608 26.61-64.391 26.61H283.587Zm0-211h392.826v-472.826H283.587v472.826Z"/>
                </svg>
            </div>

            <div className="flex flex-col justify-center items-start text-center gap-1">

                <div className="flex flex-row items-center gap-1.5">
                    <p className="w-full h-full text-black font-lgc font-bold text-lg truncate-2-line">{device?.name}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" className={`${device?.userId ? "fill-green-500" : "fill-yellow-500"} animate-pulse`}>
                        <path d="M480.083-180.782q-124.996 0-212.149-87.07-87.152-87.069-87.152-212.065t87.07-212.149q87.069-87.152 212.065-87.152t212.149 87.07q87.152 87.069 87.152 212.065t-87.07 212.149q-87.069 87.152-212.065 87.152Z"/>
                    </svg>
                </div>

                <div className="flex flex-row items-center gap-1.5">
                    <p className="text-black font-lgc text-sm">ID: {device?.id}</p>

                    <svg xmlns="http://www.w3.org/2000/svg" height="6" viewBox="0 -960 960 960" width="6" className="fill-neutral-800">
                        <path d="M480.083-180.782q-124.996 0-212.149-87.07-87.152-87.069-87.152-212.065t87.07-212.149q87.069-87.152 212.065-87.152t212.149 87.07q87.152 87.069 87.152 212.065t-87.07 212.149q-87.069 87.152-212.065 87.152Z"/>
                    </svg>

                    <p className="text-black font-lgc text-sm">{device?.userId ? `Pareado com ${device?.user?.name}` : "Despareado"}</p>
                </div>

            </div>

        </Link>
    );

};