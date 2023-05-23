import { useState, useEffect, useRef, useContext } from "react";

import UserContext from "@/components/painel/user/UserContext";

import Dropdown from "./account/AccountDropdown";

export default function Account() {

    const { user } = useContext(UserContext);
    
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdown = useRef(null);

    const [accountColor, setAccountColor] = useState("bg-stone-900");
    
    useEffect(() => {
        
        setAccountColor(showDropdown ? "bg-stone-700" : "bg-stone-900");

        if (!showDropdown) { return; };

        function handleClick(event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) { setShowDropdown(false); };
        };

        window.addEventListener("click", handleClick);
        
        return () => { window.removeEventListener("click", handleClick) };

    }, [showDropdown]);

    if (!user) { return null; }

    return (
        <div ref={dropdown} className={`flex flex-row justify-between items-center absolute z-40 top-0 right-0 px-1 mx-3 sm:mx-7 my-4 sm:my-7 w-auto min-w-[148px] h-9 rounded-full select-none cursor-pointer ${accountColor} hover:bg-stone-700 account-slide-in`}>

            <div className="flex flex-row items-center w-full" onClick={() => { setShowDropdown(!showDropdown) }}>

                <div className="flex justify-start items-center">
                    <img className="h-[28px] rounded-full" src="/images/profile.jpg"></img>
                </div>

                <div className="flex flex-row justify-center items-baseline pl-2 pr-1 max-w-[75px] sm:max-w-none">
                    <p className="text-white text-[15px] font-lgc truncate">{user?.name}</p>
                </div>

                
                
            </div>

            <div className="flex items-center pr-1" onClick={() => { setShowDropdown(!showDropdown) }}>

                {
                    showDropdown ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white transition-all">
                            <path d="M6.7 14.675q-.275-.275-.275-.7 0-.425.275-.7l4.6-4.6q.15-.15.325-.213Q11.8 8.4 12 8.4t.375.062q.175.063.325.213l4.625 4.625q.275.275.275.675t-.3.7q-.275.275-.7.275-.425 0-.7-.275l-3.9-3.9L8.075 14.7q-.275.275-.675.275t-.7-.3Z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white transition-all">
                            <path d="M12 14.95q-.2 0-.375-.063-.175-.062-.325-.212L6.675 10.05q-.275-.275-.262-.688.012-.412.287-.687.275-.275.7-.275.425 0 .7.275l3.9 3.9 3.925-3.925q.275-.275.688-.263.412.013.687.288.275.275.275.7 0 .425-.275.7l-4.6 4.6q-.15.15-.325.212-.175.063-.375.063Z"/>
                        </svg>
                    )
                }

            </div>

            <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown}></Dropdown>

        </div>
    );

};