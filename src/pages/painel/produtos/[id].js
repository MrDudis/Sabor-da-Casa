import { useState, useEffect, useContext } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ModalContext from "@/providers/modal/ModalContext";
import UserContext from "@/providers/user/UserContext";
import WebSocketContext from "@/providers/websocket/WebSocketContext";

import Dashboard from "@/components/painel/Layout";
import Account from "@/components/painel/Account";

import { BasicInput } from "@/components/elements/input/Input";
import { MessageModal } from "@/components/elements/modal/Modal";

import Product from "@/models/Product";

import * as productsLib from "@/lib/products";

import { formatTimestamp } from "@/utils/formatting/timestamp";
import { formatPrice } from "@/utils/formatting/price";

import { validateInputPriceChange, validateInputPriceBlur, parseInputPrice } from "@/utils/validation/client/price";

export function getServerSideProps({ req, res }) {

    if (!req.cookies.token) {
        res.writeHead(302, { Location: "/login?r=" + req.url });
        res.end();
        return { props: {} };
    };

    return {
        props: {
            token: req.cookies.token
        }
    };

};

function Produto({ token }) {

    const router = useRouter();

    const { showModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const { connect, socket } = useContext(WebSocketContext);
    useEffect(() => { connect(token); }, []);
    
    const [product, setProduct] = useState(null);
    const [productLoadError, setProductLoadError] = useState(null);

    const fetchProduct = async () => {

        const id = router.query?.id;

        let response = await productsLib.get(id);

        if (response.status === 200) {
            setProduct(new Product(response.product));
        } else {
            setProductLoadError(response.message ?? "Erro desconhecido.");
        };

    };

    useEffect(() => { fetchProduct(); }, []);

    const [productPreview, setProductPreview] = useState({});
    useEffect(() => setProductPreview({ name: product?.name, description: product?.description, price: product?.price }), [product]);

    const isEdited = (product, preview) => {
        return product.name !== preview.name || product.description !== preview.description || formatPrice(product.price) !== formatPrice(preview.price);
    };

    const [productUpdateErrors, setProductUpdateErrors] = useState({});
    const [productUpdateLoading, setProductUpdateLoading] = useState(false);

    const handleProductUpdateInputChange = (event) => {
        const target = event.target;

        let newProductUpdateErrors = productUpdateErrors[target.name] = null;
        setProductUpdateErrors({ ...productUpdateErrors, ...newProductUpdateErrors });

        switch (target.name) {
            case "price":
                target.value = validateInputPriceChange(target.value);
                break;
        };

        const { name, value } = target;
        setProductPreview({ ...productPreview, [name]: value });
    };
    
    const handleProductUpdateInputBlur = (event) => {
        switch (event.target.name) {
            case "price":
                event.target.value = validateInputPriceBlur(event.target.value);
                break;
        };
    };

    const handleProductUpdateSubmit = async (event) => {
        event.preventDefault();

        setProductUpdateLoading(true);

        const formData = new FormData(event.target);

        let newProduct = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: parseInputPrice(formData.get("price"))
        };

        let response = await productsLib.update(product?.id, newProduct);

        if (response.status === 200) {
            setProductUpdateErrors({});

            setProduct(response.product);
            setProductPreview({ name: response.product.name, description: response.product.description, price: response.product.price });

            showModal(
                <MessageModal 
                    icon="success" title="Successo!" message="Suas alterações foram salvas no produto com successo."
                    buttons={[ { label: "Fechar", action: closeModal } ]}
                ></MessageModal>
            );
        } else {

            if (response.errors && Object.keys(response.errors).length > 0) {
                setProductUpdateErrors(response.errors);
            } else {
                showModal(
                    <MessageModal 
                        icon="error" title="Erro" message={response?.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
            };

        };

        setTimeout(() => setProductUpdateLoading(false), 500);
    };

    const [productDeleteLoading, setProductDeleteLoading] = useState(false);

    const handleProductDeleteSubmit = async () => {
        closeModal();

        setProductDeleteLoading(true);

        let response = await productsLib.deleteProduct(product.id);

        if (response.status === 200) {

            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="success" title="Produto Excluído" message="O produto foi excluído com successo."
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );

                router.push("/painel/produtos")
            }, 500);

        } else {

            setTimeout(() => {
                showModal(
                    <MessageModal
                        icon="error" title="Erro" message={response.message ?? "Erro desconhecido."}
                        buttons={[ { label: "Fechar", action: closeModal } ]}
                    ></MessageModal>
                );
            }, 500);

        };

        setTimeout(() => setProductDeleteLoading(false), 500);
    };

    const handleProductDeleteConfirmation = (event) => {
        event.preventDefault();

        showModal(
            <MessageModal
                icon="warning" title="Excluir Produto?" message="Tem certeza que deseja excluir esse produto? Essa ação não pode ser desfeita."
                buttons={[ { label: "Excluir", action: handleProductDeleteSubmit }, { label: "Cancelar", action: closeModal } ]}
            ></MessageModal>
        );
    };

    if (!product) {
        if (productLoadError) {
            return (
                <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-black slide-up-fade-in opacity-0">
                        <path d="M676.609-115.478q11.391 0 19.087-7.696 7.695-7.696 7.695-19.087t-7.695-19.37q-7.696-7.978-19.087-7.978-11.392 0-19.088 7.978-7.695 7.979-7.695 19.37 0 11.391 7.695 19.087 7.696 7.696 19.088 7.696Zm0-95.827q9.695 0 17.108-7.413t7.413-17.109v-110.956q0-9.696-7.13-17.109-7.13-7.413-17.391-7.413-9.696 0-17.109 7.413-7.413 7.413-7.413 17.109v110.956q0 9.696 7.13 17.109 7.131 7.413 17.392 7.413Zm-249.61-672.391q24.653-14.392 53.001-14.392t53.001 14.392l273.217 157.043q24.652 14.391 38.826 38.609 14.174 24.218 14.174 53.001v180.87q-36.261-32.479-82.978-50.849-46.718-18.369-99.631-18.369-7.391 0-14.13.652-6.739.652-13.695 2.391l59.389-34.303q18.392-10.261 23.587-31.218 5.196-20.957-6.63-38.913-10.826-17.392-30.283-22.022-19.457-4.631-36.848 5.63L480-537.87 302.001-641.174q-17.391-10.261-36.63-5.63-19.24 4.63-30.501 22.022-11.826 17.956-6.63 38.631 5.195 20.674 23.587 31.5l177.999 103.303v76.392q-16.174 29.739-24.696 62.63-8.521 32.891-8.521 68.935 0 51.043 17.435 96.392 17.435 45.348 48.044 81.174-8.914-1-17.827-3.26-8.913-2.262-17.262-7.219L153.782-233.347q-24.652-14.391-38.826-38.609-14.174-24.218-14.174-53.001v-310.086q0-28.783 14.174-53.001 14.174-24.218 38.826-38.609l273.217-157.043Zm249.61 840.305q-83 0-141.5-58.5t-58.5-141.5q0-83 58.5-141.5t141.5-58.5q83 0 141.5 58.5t58.5 141.5q0 83-58.5 141.5t-141.5 58.5Z"/>
                    </svg>
                    <div className="flex flex-col text-center gap-1">
                        <p className="text-black font-lgc font-bold text-2xl slide-up-fade-in opacity-0" style={{ animationDelay: "200ms" }}>Falha ao Carregar Produto.</p>
                        <p className="text-black font-lgc text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{productLoadError}</p>
                    </div>
                    <div onClick={() => router.back()} className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                        </svg>
                        <p className="font-lgc text-lg">Voltar</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="w-full h-full flex justify-center items-center">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-black">
                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                    </svg>
                </div>
            );
        };
    };

    return (
        <>
            
            <Head>
                <title>Painel | Produto | Sabor da Casa</title>
                <meta property="og:title" content="Painel | Produtos | Sabor da Casa" key="title" />
                <meta name="og:description" content="Painel de gerenciamento de produto do Restaurante Sabor da Casa." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <div className="w-full flex flex-col justify-center items-start gap-6 border-b border-neutral-800 scale-right-to-left">
                <div onClick={() => router.back()} className="w-fit flex flex-row items-center gap-2 bg-neutral-100 hover:bg-neutral-200 cursor-pointer rounded-md px-3 py-2 transition-all slide-up-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M420.869-189.13 166.478-442.956q-7.696-7.696-11.326-17.239-3.631-9.544-3.631-19.805t3.631-19.805q3.63-9.543 11.326-17.239l254.391-254.391q14.957-14.956 36.826-15.174 21.87-.217 37.827 15.739 15.957 15.522 16.457 37.11.5 21.587-15.457 37.544L333.306-533.001h400.65q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457h-400.65l163.216 163.215q14.957 14.957 15.457 37.044.5 22.088-15.457 37.61-15.522 15.956-37.609 15.956-22.087 0-38.044-15.956Z"/>
                    </svg>
                    <p className="font-lgc text-lg">Voltar</p>
                </div>
                
                <div className="w-full flex flex-col justify-start items-start pr-4 pb-3 gap-1">
                    <h1 className="font-lgc text-3xl sm:text-4xl slide-up-fade-in opacity-0" style={{ animationDelay: "400ms" }}>{product?.name}</h1>
                    <p className="w-full flex flex-row items-center justify-start gap-2 font-lgc sm:text-lg slide-up-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <Link href="/painel" className="hover:font-bold">Painel</Link> <p className="cursor-default">{" > "}</p> 
                        <Link href="/painel/produtos" className="hover:font-bold">Produtos</Link> <p className="cursor-default">{" > "}</p> 
                        <p className="cursor-default truncate">{product?.name || router.query?.id}</p>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-start items-start gap-6 py-6">

                <div className="w-full md:w-[60%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="m620-283.609 191.782-191.782q12.435-12.435 31.348-12.435 18.913 0 31.348 12.435 12.435 12.434 12.316 31.228-.12 18.793-12.555 31.228L652.065-190.522q-13.761 13.674-32.108 13.674-18.348 0-32.022-13.674L477.522-300.935q-12.435-12.435-12.435-31.228 0-18.794 12.435-31.228 12.435-12.435 31.348-12.435 18.913 0 31.348 12.435L620-283.609Zm-417.13 171.74q-37.538 0-64.269-26.732-26.732-26.731-26.732-64.269v-554.26q0-37.538 26.732-64.269 26.731-26.732 64.269-26.732h157.912q12.435-35.717 45.936-58.456 33.5-22.739 73.282-22.739 41.196 0 74.37 22.739 33.174 22.739 45.848 58.456H757.13q37.538 0 64.269 26.732 26.732 26.731 26.732 64.269v151.63q0 19.152-13.174 32.326T802.63-560q-19.152 0-32.326-13.174T757.13-605.5v-151.63h-78.326v78.326q0 19.152-13.174 32.326t-32.326 13.174H326.696q-19.152 0-32.326-13.174t-13.174-32.326v-78.326H202.87v554.26H394.5q19.152 0 32.326 13.174T440-157.37q0 19.153-13.174 32.327T394.5-111.869H202.87ZM480-760.717q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Informações do Produto</h1>
                    </div>

                    <div className="w-full flex flex-col xl:flex-row items-center gap-6">

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "400ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28">
                                <path d="M206.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-546.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848H240v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.739 13.478q13.479 13.478 13.479 32.739v33.783h293.998v-33.783q0-19.261 13.761-32.739 13.761-13.478 33.022-13.478t32.74 13.478Q720-872.262 720-853.001v33.783h33.217q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v546.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783Zm0-106.001h546.434V-560H206.783v393.217ZM480-395.478q-18.922 0-31.722-12.8T435.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T480-395.478Zm-160 0q-18.922 0-31.722-12.8T275.478-440q0-18.922 12.8-31.722t31.722-12.8q18.922 0 31.722 12.8t12.8 31.722q0 18.922-12.8 31.722T320-395.478Zm320 0q-18.13 0-31.326-12.8-13.196-12.8-13.196-31.722t13.196-31.722q13.196-12.8 31.609-12.8 18.413 0 31.326 12.8T684.522-440q0 18.922-12.8 31.722T640-395.478Zm-160 160q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T480-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm-160 0q-18.922 0-31.722-13.196t-12.8-31.609q0-18.413 12.8-31.326T320-324.522q18.922 0 31.722 12.8t12.8 31.722q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Zm320 0q-18.13 0-31.326-13.196-13.196-13.196-13.196-31.609 0-18.413 13.196-31.326t31.609-12.913q18.413 0 31.326 12.8T684.522-280q0 18.13-12.8 31.326-12.8 13.196-31.722 13.196Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Adicionado em</p>
                                <p className="font-lgc text-lg">{formatTimestamp(product?.createdAt)}</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-row items-center px-4 py-3 gap-4 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M202.87-70.913q-37.783 0-64.392-26.609-26.609-26.608-26.609-64.391v-448.652q-17-11.643-28.5-29.637t-11.5-44.102V-797.13q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v112.826q0 26.108-11.5 44.102-11.5 17.994-28.5 29.637v448.652q0 37.783-26.609 64.391-26.609 26.61-64.392 26.61H202.87Zm594.26-613.391V-797.13H162.87v112.826h634.26ZM397.37-397.13h165.26q17.712 0 29.693-11.983 11.981-11.982 11.981-29.696 0-17.713-11.981-29.811-11.981-12.097-29.693-12.097H397.37q-17.712 0-29.693 12.05-11.981 12.05-11.981 29.863 0 17.711 11.981 29.692 11.981 11.982 29.693 11.982Z"/>
                            </svg>
                            <div className="w-full flex flex-col items-start justify-center">
                                <p className="font-lgc text-lg font-bold">Estoque</p>
                                <p className="font-lgc text-lg">{product?.stock}</p>
                            </div>
                        </div>

                    </div>

                    <form onSubmit={handleProductUpdateSubmit} className="w-full flex flex-col gap-5 px-6 py-6 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>

                        <div className="w-full flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                                <path d="M774.261 459.218 601.435 287.826l52.608-53.174q25.261-25.261 61.587-25.826 36.327-.565 63.849 25.826l48.086 47.522q27.522 26.391 26.826 62-.695 35.609-25.956 60.87l-54.174 54.174ZM169.044 945.044q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544v-97.738q0-10.826 3.848-20.305 3.848-9.478 12.109-17.739l411.435-411.435 173.391 172.826-411.435 411.435q-8.261 8.261-18.021 12.109-9.761 3.848-20.588 3.848h-97.738Z"/>
                            </svg>
                            <h1 className="font-lgc font-bold text-xl">Editar Informações</h1>
                        </div>

                        <div className="flex flex-row items-center gap-3 bg-neutral-200 rounded-md px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path d="M202.87-71.87q-37.783 0-64.392-26.608-26.609-26.609-26.609-64.392v-554.26q0-37.783 26.609-64.392 26.609-26.609 64.392-26.609H240V-845.5q0-17.957 12.457-30.294 12.456-12.337 30.413-12.337 17.956 0 30.293 12.337T325.5-845.5v37.369h309V-845.5q0-17.957 12.456-30.294 12.457-12.337 30.414-12.337 17.956 0 30.293 12.337T720-845.5v37.369h37.13q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v196.652q0 19.152-13.174 32.326t-32.327 13.174q-19.152 0-32.326-13.174t-13.174-32.326V-560H202.87v397.13H434.5q19.152 0 32.326 13.174T480-117.37q0 19.153-13.174 32.327T434.5-71.87H202.87Zm691.456-195.934-92.652-92.652 29-29q12.435-12.435 31.707-12.555 19.271-.119 31.945 12.555l29 29q12.674 12.674 12.555 31.945-.12 19.272-12.555 31.707l-29 29ZM633.5-26.13h-50.87q-9.195 0-15.913-6.717Q560-39.566 560-48.761v-50.87q0-9.195 3.359-17.532 3.358-8.337 10.076-15.054l200.239-200.239 92.652 92.652-200.239 200.24q-6.717 6.717-15.054 10.075-8.337 3.359-17.533 3.359Z"/>
                            </svg>
                            <div className="flex flex-col lg:flex-row gap-0 lg:gap-1">
                                <p className="font-lgc text-black font-bold">Última Edição em</p>
                                <p className="font-lgc text-black">{formatTimestamp(product?.updatedAt)}</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 bg-yellow-200 rounded-md px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="w-[28px]">
                                <path d="m858.391 455.131-66.304-30.652 66.269-30.123 30.123-66.269 30.652 66.304 65.74 30.088-65.74 30.652-30.652 65.74-30.088-65.74ZM723.13 244.391l-99.522-45.914 99.522-45.348 45.349-99.522 45.913 99.522 99.523 45.348-99.382 46.055-46.054 99.381-45.349-99.522ZM342.477 1010.48q-35.798 0-61.29-27.174-25.493-27.174-25.493-66.392h174.132q0 39.218-25.659 66.392-25.659 27.174-61.69 27.174ZM221.912 872.392q-18.922 0-31.722-12.8t-12.8-31.722q0-18.681 12.8-31.319 12.8-12.638 31.722-12.638h241.696q18.922 0 31.722 12.641 12.8 12.64 12.8 31.326t-12.8 31.599q-12.8 12.913-31.722 12.913H221.912ZM187.39 739.391Q113.303 695 68.564 621.195q-44.74-73.804-44.74-161.022 0-132.772 92.97-225.713 92.969-92.94 225.783-92.94t225.966 92.94q93.153 92.941 93.153 225.713 0 87.783-44.74 161.305Q572.217 695 498.13 739.391H187.39Z"/>
                            </svg>
                            <p className="font-lgc text-black">Não esqueça de salvar as informações quando terminar a edição.</p>
                        </div>
                        
                        <div className="flex flex-col xl:flex-row gap-5">
                            <BasicInput name="name" label="Nome do Produto" type="text" placeholder={product?.name} defaultValue={product?.name} onBlur={handleProductUpdateInputBlur} onChange={handleProductUpdateInputChange} error={productUpdateErrors?.name}></BasicInput>
                            <BasicInput name="price" label="Preço" type="text" placeholder={formatPrice(product?.price)} defaultValue={formatPrice(product?.price)} onBlur={handleProductUpdateInputBlur} onChange={handleProductUpdateInputChange} error={productUpdateErrors?.price}></BasicInput>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-5">
                            <BasicInput name="description" label="Descrição" type="text" placeholder={product?.description} defaultValue={product?.description} onBlur={handleProductUpdateInputBlur} onChange={handleProductUpdateInputChange} error={productUpdateErrors?.description}></BasicInput>
                        </div>

                        <div className="w-full flex flex-row justify-end items-center mt-2">
                            <button disabled={productUpdateLoading} className="w-full xl:w-56 flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                { productUpdateLoading ? (
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white fast-fade-in">
                                        <path d="M206.783 955.218q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153V302.783q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h437.391q21.087 0 40.392 7.978 19.304 7.978 34.261 22.935l109.478 109.478q14.957 14.957 22.935 34.261 7.978 19.305 7.978 40.392v437.391q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H206.783ZM480 809.217q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM299.784 502.783h253.998q22.088 0 37.544-15.457 15.457-15.456 15.457-37.544v-53.998q0-22.088-15.457-37.544-15.456-15.457-37.544-15.457H299.784q-22.088 0-37.544 15.457-15.457 15.456-15.457 37.544v53.998q0 22.088 15.457 37.544 15.456 15.457 37.544 15.457Z"/>
                                    </svg>
                                ) }
                                { productUpdateLoading ? "Salvando..." : "Salvar Alterações" }
                            </button>
                        </div>
                        
                    </form>

                    <form onSubmit={handleProductDeleteConfirmation} className="w-full flex flex-col xl:flex-row items-center justify-between px-6 py-5 gap-2 bg-neutral-100 rounded-md smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>
                        
                        <div className="w-fit flex flex-col justify-center items-start gap-2">
                            <div className="w-full flex flex-row justify-start items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M647.174-229q-17.813 0-29.863-12.05t-12.05-29.863q0-17.711 12.05-29.693 12.05-11.981 29.863-11.981h80q17.813 0 29.863 11.983 12.05 11.982 12.05 29.695 0 17.714-12.05 29.811Q744.987-229 727.174-229h-80Zm0-327.413q-17.813 0-29.863-11.982-12.05-11.983-12.05-29.696t12.05-29.811Q629.361-640 647.174-640h200q17.813 0 29.863 12.05t12.05 29.863q0 17.712-12.05 29.693-12.05 11.981-29.863 11.981h-200Zm0 163.826q-17.813 0-29.863-12.05t-12.05-29.863q0-17.813 12.05-29.863t29.863-12.05h160q17.813 0 29.863 12.05t12.05 29.863q0 17.813-12.05 29.863t-29.863 12.05h-160ZM201.913-191.869q-37.783 0-64.391-26.609-26.609-26.609-26.609-64.392v-358.326q-17.24-1.434-28.62-14.011-11.38-12.576-11.38-30.293 0-19.152 13.174-32.326T116.413-731h118.565v-16.413q.718-18.435 13.652-31.011Q261.565-791 280.239-791h77.848q18.674 0 31.609 12.576 12.934 12.576 13.652 31.011V-731h118.326q19.152 0 32.326 13.174t13.174 32.326q0 17.717-11.38 30.293-11.381 12.577-28.62 14.011v358.326q0 37.783-26.609 64.392-26.608 26.609-64.391 26.609H201.913Z"/>
                                </svg>
                                <h1 className="font-lgc font-bold text-lg">Excluir Produto</h1>
                            </div>

                            <p className="font-lgc text-[17px]">Deleta o produto, essa ação é irreversível.</p>
                        </div>

                        <div className="w-full xl:w-56 flex flex-row justify-center items-center mt-2">
                            <button disabled={productDeleteLoading} className="w-full flex flex-row justify-center items-center gap-3 font-lgc font-bold text-lg p-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-red-600 disabled:cursor-default transition-all" type="submit">
                                { productDeleteLoading ? (
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="animate-spin fill-white">
                                        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-white fast-fade-in">
                                        <path d="m480-394.391 69.217 69.217q14.261 13.261 33.305 13.261 19.043 0 32.304-13.261 14.261-14.261 14.261-33.304 0-19.044-14.261-32.305L545.609-460l69.217-69.217q14.261-14.261 14.261-33.305 0-19.043-14.261-32.304-12.696-13.696-32.022-13.696t-33.022 13.696L480-525.609l-69.217-69.217q-13.261-14.261-32.305-14.261-19.043 0-33.304 14.261-12.696 12.696-12.696 32.022t12.696 33.022L414.391-460l-69.217 69.217q-13.261 13.261-13.261 32.305 0 19.043 13.261 33.304 14.261 13.261 33.304 13.261 19.044 0 32.305-13.261L480-394.391ZM273.782-100.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-506.999q-22.087 0-37.544-15.457-15.457-15.457-15.457-37.544 0-22.087 15.457-37.544 15.457-15.457 37.544-15.457h179.784q0-22.087 15.456-37.544 15.457-15.456 37.544-15.456h158.87q22.087 0 37.544 15.456 15.456 15.457 15.456 37.544h179.784q22.087 0 37.544 15.457 15.457 15.457 15.457 37.544 0 22.087-15.457 37.544-15.457 15.457-37.544 15.457v506.999q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H273.782Z"/>
                                    </svg>
                                ) }
                                
                                { productDeleteLoading ? "Excluindo..." : "Excluir" }
                            </button>
                        </div>
                        
                    </form>

                </div>

                <div className="w-full md:w-[40%] flex flex-col gap-6">

                    <div className="w-full flex flex-row items-center gap-2 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M577.652-96.348Q551.304-70 513-70t-64.652-26.348l-352-352q-12.674-12.674-20.011-29.587T69-514v-286q0-37.544 26.728-64.272Q122.456-891 160-891h286q19.152 0 36.065 7.337 16.913 7.337 29.587 20.011l352 352.761Q890-484.544 890-446.62t-26.348 64.272l-286 286ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Z"/>
                        </svg>
                        <h1 className="font-lgc text-2xl font-bold">Cartão do Produto</h1>
                    </div>

                    <div className="relative w-full xl:max-w-sm flex flex-col items-start justify-start h-fit bg-neutral-100 rounded-md border border-neutral-400 smooth-slide-down-fade-in opacity-0" style={{ animationDelay: "800ms" }}>

                        {
                            isEdited(product, productPreview) ? (
                                <div className="absolute flex flex-row justify-center items-center px-2 py-1 gap-1 rounded-lg bg-neutral-100 -top-2 -left-2 border border-neutral-400 fast-fade-in">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14">
                                        <path d="M168.479 0q-36.392 0-62.435-26.044Q80-52.087 80-88.479q0-36.391 26.044-62.717 26.043-26.327 62.435-26.327h623.042q36.392 0 62.435 26.327Q880-124.87 880-88.479q0 36.392-26.044 62.435Q827.913 0 791.521 0H168.479Zm36.043-257.523q-22.087 0-37.544-15.456-15.457-15.457-15.457-37.544v-86.783q0-10.826 3.848-20.304 3.848-9.479 12.109-17.74l351.696-352.261 162.435 162.436-352.261 351.696q-8.261 8.261-17.739 12.108-9.479 3.848-20.305 3.848h-86.782Zm514.174-404.869-161.87-162.436 75.956-75.956q13.827-14.827 34.218-14.609 20.391.217 34.218 14.609l94 94q13.826 13.826 13.826 33.435t-13.826 34.435l-76.522 76.522Z"/>
                                    </svg>
                                    <p className="font-lgc font-bold text-sm">Edit Mode</p>
                                </div>
                            ) : (
                                <div className="absolute flex flex-row justify-center items-center px-2 py-1 gap-1 rounded-lg bg-neutral-100 -top-2 -left-2 border border-neutral-400 fast-fade-out">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14">
                                        <path d="M168.479 0q-36.392 0-62.435-26.044Q80-52.087 80-88.479q0-36.391 26.044-62.717 26.043-26.327 62.435-26.327h623.042q36.392 0 62.435 26.327Q880-124.87 880-88.479q0 36.392-26.044 62.435Q827.913 0 791.521 0H168.479Zm36.043-257.523q-22.087 0-37.544-15.456-15.457-15.457-15.457-37.544v-86.783q0-10.826 3.848-20.304 3.848-9.479 12.109-17.74l351.696-352.261 162.435 162.436-352.261 351.696q-8.261 8.261-17.739 12.108-9.479 3.848-20.305 3.848h-86.782Zm514.174-404.869-161.87-162.436 75.956-75.956q13.827-14.827 34.218-14.609 20.391.217 34.218 14.609l94 94q13.826 13.826 13.826 33.435t-13.826 34.435l-76.522 76.522Z"/>
                                    </svg>
                                    <p className="font-lgc font-bold text-sm">Edit Mode</p>
                                </div>
                            )
                        }

                        <div className="absolute flex justify-center items-center px-4 py-1 rounded-lg bg-neutral-100 top-3 right-3 opacity-75">
                            <p className="font-lgc text-lg">{product?.id}</p>
                        </div>

                        <div className="w-full min-h-[196px] bg-center bg-cover bg-neutral-200 rounded-t-md"
                            style={{ backgroundImage: `url('${product?.image}')` }}
                        ></div>

                        <div className="w-full h-fit flex flex-col items-start justify-start px-6 py-5 gap-4">
                            <div className="w-full">
                                <h2 className="font-lgc text-sm font-bold">NOME</h2>
                                <p className="font-lgc text-[16px] text-neutral-800">{productPreview?.name}</p>
                            </div>

                            <div className="w-full">
                                <h2 className="font-lgc text-sm font-bold">DESCRIÇÃO</h2>
                                <p className="font-lgc text-[16px] text-neutral-800">{productPreview?.description}</p>
                            </div>

                            <div className="w-full">
                                <h2 className="font-lgc text-sm font-bold">PREÇO</h2>
                                <p className="font-lgc text-[16px] text-neutral-800">{formatPrice(productPreview?.price)}</p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>   

        </>
    );

};

Produto.requiresUser = true;

Produto.getLayout = function getLayout(page) {

    return (
        <Dashboard activePage={"Produtos"}>
            <Account></Account>
            {page}
        </Dashboard>
    );

};

export default Produto;