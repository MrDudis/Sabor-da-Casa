import Link from "next/link";
import { useState, useEffect } from "react";

import logout from "@/lib/auth/logout";

export default function Dropdown({ showDropdown, setShowDropdown }) {

    const [dropdownDisplay, setDropdownDisplay] = useState("hidden");

    useEffect(() => {
        let setDisplayTimeout;
        
        if (showDropdown) {
            setDropdownDisplay("flex");
        } else {
            setDisplayTimeout = setTimeout(() => {
                setDropdownDisplay("hidden");
            }, 200);
        };

        return () => {
            if (setDisplayTimeout) { clearTimeout(setDisplayTimeout); };
        };
        
    }, [showDropdown]);

    const handleLogout = async () => {
        let response = await logout(document);

        if (response.status === 200) {
            window.location.href = "/login";
        } else {
            alert(response.message);
        };
    };

    return (

        <div className={`${dropdownDisplay} absolute z-30 w-full top-12 p-1.5 rounded-md flex-col justify-center items-end bg-stone-800 shadow-2xl ${showDropdown ? "account-dropdown-slide-in" : "account-dropdown-slide-out"}`}>

            <Link href="/painel/conta" onClick={() => { setShowDropdown(false) }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 96 960 960" height="24" className="w-5 h-5 fill-white transition-all">
                    <path d="M236.826 771.521q51-37.869 112.87-59.239Q411.565 690.913 480 690.913t131.152 22.217q62.718 22.218 112.022 58.957 33.304-41.566 51.674-90.457 18.369-48.891 18.369-105.63 0-129.609-91.804-221.413T480 262.783q-129.609 0-221.413 91.804T166.783 576q0 56.174 18.087 105.065t51.956 90.456ZM480 621.087q-61.261 0-102.891-41.348-41.631-41.348-41.631-102.609 0-61.26 41.631-102.891 41.63-41.63 102.891-41.63t102.891 41.63q41.631 41.631 41.631 102.891 0 61.261-41.631 102.609-41.63 41.348-102.891 41.348Zm0 374.131q-86.957 0-163.348-32.913-76.392-32.913-133.218-89.739-56.826-56.826-89.74-133.218Q60.783 662.957 60.783 576q0-86.957 32.913-163.348 32.913-76.392 89.739-133.218 56.826-56.826 133.218-89.739Q393.043 156.782 480 156.782q86.957 0 163.348 32.913 76.392 32.913 133.218 89.739 56.826 56.826 89.739 133.218Q899.218 489.043 899.218 576q0 86.957-32.913 163.348-32.913 76.392-89.739 133.218-56.826 56.826-133.218 89.739Q566.957 995.218 480 995.218Z"/>
                </svg>
                <p className="text-white text-sm font-lgc font-bold">Minha Conta</p>
            </Link>

            <div onClick={() => { handleLogout() }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-red-500 transition-all">
                    <path d="M14.925 17.075q-.45-.475-.45-1.112 0-.638.45-1.088l1.3-1.3h-6.1q-.65 0-1.113-.463Q8.55 12.65 8.55 12q0-.65.462-1.113.463-.462 1.113-.462h6.1L14.9 9.1q-.45-.45-.437-1.088.012-.637.462-1.087.45-.45 1.1-.45.65 0 1.1.45L21.1 10.9q.225.225.338.512.112.288.112.588t-.112.587q-.113.288-.338.513l-4 4q-.475.475-1.1.45-.625-.025-1.075-.475ZM4.95 21.85q-1.325 0-2.238-.912Q1.8 20.025 1.8 18.7V5.3q0-1.325.912-2.238.913-.912 2.238-.912h5.675q.65 0 1.113.462.462.463.462 1.113 0 .65-.462 1.113-.463.462-1.113.462H4.95v13.4h5.675q.65 0 1.113.463.462.462.462 1.112 0 .65-.462 1.113-.463.462-1.113.462Z"/>
                </svg>
                <p className="text-red-500 text-sm font-lgc font-bold">Sair</p>
            </div>

        </div>

    );

};