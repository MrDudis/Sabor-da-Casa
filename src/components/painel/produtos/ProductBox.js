import Link from "next/link";

const parsePrice = (price) => {
    if (!price) return "0,00";
    const priceString = price.toString();
    const priceArray = priceString.split(".");
    const priceInteger = priceArray[0];
    const priceDecimal = priceArray[1] || "00";
    const priceDecimalFormatted = priceDecimal.length === 1 ? `${priceDecimal}0` : priceDecimal;
    const priceFormatted = `${priceInteger},${priceDecimalFormatted}`;
    return priceFormatted;
};

export default function ProductBox({ product, animationDelay }) {

    if (!product) {
        return (
            <div className="w-full min-w-[190px] max-w-md h-72 flex flex-col gap-2 transition-all rounded-md bg-neutral-100 border border-neutral-400 shimmer smooth-slide-down-fade-in opacity-0" style={{ animationDelay: `${animationDelay}ms` }}>
    
            </div>
        );
    };

    return (
        <Link href={`/painel/produtos/${product?.id}`} className="w-full min-w-[190px] max-w-md h-72 flex flex-col gap-2 cursor-pointer hover:bg-neutral-50 hover:shadow-xl transition-all rounded-md bg-neutral-100 border border-neutral-400 fast-fade-in">

            <div className="w-full h-[45%] bg-center bg-cover bg-neutral-200 rounded-t-md"
                style={{ backgroundImage: `url('${product?.image}')` }}
            ></div>

            <div className="w-full h-[55%] flex flex-col items-start justify-between px-4 py-2">
                <div className="w-full truncate-4-line">
                    <h2 className="font-lgc font-bold text-xl">{product?.name}</h2>
                    <p className="font-lgc text-[16px] text-neutral-800">{product?.description}</p>
                </div>

                <div className="w-full flex flex-row justify-start mb-1.5">
                    <p className="font-lgc text-lg text-neutral-800">R$ {parsePrice(product?.price)}</p>
                </div>
            </div>

        </Link>
    );

};