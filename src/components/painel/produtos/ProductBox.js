import Link from "next/link";

export default function ProductBox({ product, animationDelay }) {

    if (!product) {
        return (
            <div className="w-full min-w-[190px] max-w-md h-72 flex flex-col gap-2 transition-all rounded-md bg-neutral-100 shimmer smooth-slide-down-fade-in opacity-0" style={{ animationDelay: `${animationDelay}ms` }}>
    
            </div>
        );
    };

    return (
        <Link href="/painel/produtos/id" className="w-full min-w-[190px] max-w-md h-72 flex flex-col gap-2 cursor-pointer hover:bg-neutral-50 hover:shadow-2xl transition-all rounded-md bg-neutral-100 fade-in opacity-0" style={{ animationDelay: `${animationDelay}ms` }}>

            <div className="w-full h-[45%] bg-center bg-cover bg-neutral-200 rounded-t-md"
                style={{ backgroundImage: "url('/images/culinaria-mineira-cpt.jpg')" }}
            ></div>

            <div className="w-full h-[55%] flex flex-col items-start justify-between px-4 py-4">
                <div>
                    <h2 className="font-lgc font-bold text-xl">Nome do Produto</h2>
                    <p className="font-lgc text-[16px] text-neutral-800">Descrição Curta.</p>
                </div>

                <div className="w-full flex flex-row justify-end">
                    <p className="font-lgc text-lg text-neutral-600">R$ 12,00</p>
                </div>
            </div>

        </Link>
    );

};