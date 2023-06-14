import { useRef } from "react";

import { validateInputNumbersChange } from "@/utils/validation/client/numbers";
import { formatPrice } from "@/utils/formatting/price";
import Link from "next/link";

export default function MiniAddProductBox({ product, selectedProducts, setSelectedProducts }) {

    let productSelected = selectedProducts.find((selectedProduct) => selectedProduct.id == product?.id);

    if (!productSelected) {
        productSelected = { id: product?.id, quantity: 0, notStored: true };
    };

    const inputRef = useRef(null);

    const setNewQuantity = (newQuantity) => {

        let newSelectedProducts = selectedProducts.map((selectedProduct) => {
            if (selectedProduct.id == product?.id) {
                return {
                    ...selectedProduct,
                    quantity: newQuantity
                };
            } else {
                return selectedProduct;
            };
        });

        if (productSelected?.notStored) {
            newSelectedProducts.push({ id: product?.id, quantity: newQuantity });
        };

        if (newQuantity == 0) {
            newSelectedProducts = newSelectedProducts.filter((selectedProduct) => selectedProduct.id != product?.id);
        };
        
        inputRef.current.value = newQuantity;
        setSelectedProducts(newSelectedProducts);

    };

    const onQuantityChange = (event) => {
        event.target.value = validateInputNumbersChange(event.target.value);

        event.target.value = event.target.value.replace(/^0+/, '');

        if (event.target.value == "") {
            event.target.value = 0;
        };

        let newQuantity = event.target.value;
        setNewQuantity(newQuantity);
    };

    const onMinusClick = () => {
        let newQuantity = productSelected.quantity - 1;

        if (newQuantity < 0) {
            newQuantity = 0;
        };

        setNewQuantity(newQuantity);
    };

    const onPlusClick = () => {
        let newQuantity = productSelected.quantity + 1;

        setNewQuantity(newQuantity);
    };

    return (
        <div className="w-full min-w-[96px] h-20 flex flex-row items-center gap-4 border border-neutral-300 transition-all bg-neutral-100 hover:bg-neutral-50 rounded-lg fast-fade-in">

                <div className="w-48 h-full bg-center bg-cover bg-neutral-200 rounded-l-md"
                    style={{ backgroundImage: `url('${product?.image}')` }}
                ></div>

                <div className="w-full flex flex-col justify-center items-start truncate">
                    <p className="w-full h-full text-black font-lgc font-bold truncate"><Link href={`/painel/produtos/${product?.id}`} className="hover:underline cursor-pointer">{product?.name}</Link></p>

                    <div className="flex flex-row items-center justify-start gap-1">
                        <p className="text-black font-lgc font-bold text-xs">{formatPrice(product?.price)}</p>
                        <p>-</p>
                        <p className="w-full text-black font-lgc text-xs truncate">{product?.description}</p>
                    </div>
                </div>

                <div className="w-fit flex flex-row justify-end items-center gap-2 mx-4">

                    <button onClick={onMinusClick} className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16">
                            <path d="M240-426.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h480q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H240Z"/>
                        </svg>
                    </button>

                    <input ref={inputRef} onChange={onQuantityChange} className="w-16 h-8 text-center text-black font-lgc font-bold bg-neutral-200 focus:border focus:border-red-500 outline-none rounded-md" type="text" defaultValue={productSelected.quantity}></input>

                    <button onClick={onPlusClick} className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16">
                            <path d="M480-186.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-186.999H240q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h186.999V-720q0-22.087 15.457-37.544 15.457-15.457 37.544-15.457 22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v186.999H720q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H533.001V-240q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457Z"/>
                        </svg>
                    </button>

                </div>

        </div>
    );

};