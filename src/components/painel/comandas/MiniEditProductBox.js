import { useState, useRef, useEffect } from "react";

import Link from "next/link";

import { formatPrice } from "@/utils/formatting/price";

import { validateInputNumbersChange } from "@/utils/validation/client/numbers";

export default function MiniEditProductBox({ active, product, updateProduct }) {

    const inputRef = useRef(null);

    const [productQuantity, setProductQuantity] = useState(product.quantity);

    useEffect(() => {
        if (!inputRef.current) { return; };
        inputRef.current.value = productQuantity;
    }, [productQuantity]);

    const onQuantityChange = (event) => {
        event.target.value = validateInputNumbersChange(event.target.value);

        event.target.value = event.target.value.replace(/^0+/, '');

        if (event.target.value == "") {
            event.target.value = 0;
        };

        let newQuantity = event.target.value;
        setProductQuantity(newQuantity);
        updateProduct(product?.id, newQuantity);
    };

    const onMinusClick = () => {
        let newQuantity = productQuantity - 1;

        if (newQuantity < 0) {
            newQuantity = 0;
        };

        setProductQuantity(newQuantity);
        updateProduct(product?.id, newQuantity);
    };

    const onPlusClick = () => {
        let newQuantity = productQuantity + 1;
        setProductQuantity(newQuantity);
        updateProduct(product?.id, newQuantity);
    };

    const onDeleteClick = () => {
        let newQuantity = 0;
        setProductQuantity(newQuantity);
        updateProduct(product?.id, newQuantity);
    };

    return (
        <div className="w-full min-w-[96px] h-20 flex flex-row items-center gap-4 border border-neutral-300 transition-all bg-neutral-100 hover:bg-neutral-50 rounded-lg fast-fade-in">

                <div className="w-48 h-full bg-center bg-cover bg-neutral-200 rounded-l-md"
                    style={{ backgroundImage: `url('${product?.image}')` }}
                ></div>

                <div className="w-full flex flex-col justify-center items-start truncate">
                    <p className="w-full h-full text-black font-lgc truncate"><Link href={`/painel/produtos/${product?.id}`} className="font-bold hover:underline cursor-pointer">{product?.name}</Link> ({productQuantity}x)</p>
                    <p className="text-black font-lgc font-bold text-sm">{formatPrice(product?.price * productQuantity)}</p>
                </div>

                {
                    active ? (
                        <div className="w-fit flex flex-row justify-end items-center gap-2">

                            <button onClick={onMinusClick} className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16">
                                    <path d="M240-426.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h480q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H240Z"/>
                                </svg>
                            </button>

                            <input ref={inputRef} onChange={onQuantityChange} className="w-16 h-8 text-center text-black font-lgc font-bold bg-neutral-200 focus:border focus:border-red-500 outline-none rounded-md" type="text" defaultValue={productQuantity}></input>

                            <button onClick={onPlusClick} className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16">
                                    <path d="M480-186.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-186.999H240q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h186.999V-720q0-22.087 15.457-37.544 15.457-15.457 37.544-15.457 22.087 0 37.544 15.457 15.457 15.457 15.457 37.544v186.999H720q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457H533.001V-240q0 22.087-15.457 37.544-15.457 15.457-37.544 15.457Z"/>
                                </svg>
                            </button>

                        </div>
                    ) : null
                }

                {
                    active ? (
                        <button onClick={onDeleteClick} className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-all mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
                                <path d="M273.782-100.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-506.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h179.784q0-22.087 15.456-37.544 15.457-15.456 37.544-15.456h158.87q22.087 0 37.544 15.456 15.456 15.457 15.456 37.544h179.784q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457v506.999q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H273.782Zm76.044-226.001q0 19.261 13.478 32.739 13.478 13.479 32.739 13.479 19.261 0 33.022-13.479 13.761-13.478 13.761-32.739v-266.999q0-19.261-13.761-33.022t-33.022-13.761q-19.261 0-32.739 13.761-13.478 13.761-13.478 33.022v266.999Zm167.348 0q0 19.261 13.761 32.739 13.761 13.479 33.022 13.479t32.739-13.479q13.478-13.478 13.478-32.739v-266.999q0-19.261-13.478-33.022t-32.739-13.761q-19.261 0-33.022 13.761t-13.761 33.022v266.999Z"/>
                            </svg>
                        </button>
                    ) : null
                }

        </div>
    );

};