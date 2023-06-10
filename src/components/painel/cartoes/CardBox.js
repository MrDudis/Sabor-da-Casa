import Link from "next/link";

export default function CardBox({ card, animationDelay }) {

    if (!card) {
        return (
            <div className="w-full min-w-[124px] h-52 flex flex-col xs:flex-row items-center px-4 py-4 border border-neutral-400 transition-all bg-neutral-100 gap-6 rounded-lg shimmer smooth-slide-down-fade-in opacity-0" style={{ animationDelay: `${animationDelay}ms` }}>
    
            </div>
        );
    };

    return (
        <Link href={`/painel/cartoes/${card?.id}`} className="w-full min-w-[86px] h-52 flex flex-col justify-between items-start gap-8 px-4 py-4 border border-neutral-400 cursor-pointer hover:bg-neutral-50 hover:shadow-xl hover:scale-[102%] transition-all bg-neutral-100 rounded-lg fast-fade-in">

            { card?.userId ? (
                <div className="w-full h-full flex flex-col justify-start items-start">
                    <p className="w-full font-lgc">Vinculado a</p>
                    <p className="w-full font-lgc font-bold truncate">{card?.user?.name}</p>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col justify-start items-start">
                    <p className="w-full font-lgc">Vazio</p>
                </div>
            ) }
            
            <div className="w-full flex flex-row justify-end items-end gap-4">
                <p className="font-lgc text-xl font-bold">{card?.id}</p>
            </div>

        </Link>
    );

};