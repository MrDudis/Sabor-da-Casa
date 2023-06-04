import { useState, useEffect, useRef, useContext } from "react";

import UserContext from "../../providers/user/UserContext.js";

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
        <div ref={dropdown} className={`w-auto min-w-[148px] flex flex-row justify-between items-center absolute z-40 top-0 right-0 px-1 mx-3 sm:mx-7 my-4 sm:my-7 h-9 rounded-full select-none cursor-pointer ${accountColor} hover:bg-stone-700 account-slide-in`}>

            <div className="w-full flex flex-row items-center" onClick={() => { setShowDropdown(!showDropdown) }}>

                <div className="flex justify-start items-center">
                    <img className="h-[28px] rounded-full" src="/images/profile.jpg"></img>
                </div>

                <div className="flex flex-row justify-center items-baseline pl-2 pr-1 max-w-[75px] sm:max-w-none">
                    <p className="max-w-[200px] h-full text-white text-[15px] font-lgc truncate">{user?.name}</p>
                </div>

            </div>

            <div className="flex items-center pr-1" onClick={() => { setShowDropdown(!showDropdown) }}>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-5 h-5 fill-white ${showDropdown ? "rotate-180 mb-1" : ""} transition-all`}>
                    <path d="M12 14.95q-.2 0-.375-.063-.175-.062-.325-.212L6.675 10.05q-.275-.275-.262-.688.012-.412.287-.687.275-.275.7-.275.425 0 .7.275l3.9 3.9 3.925-3.925q.275-.275.688-.263.412.013.687.288.275.275.275.7 0 .425-.275.7l-4.6 4.6q-.15.15-.325.212-.175.063-.375.063Z"/>
                </svg>

            </div>

            <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown}></Dropdown>

        </div>
    );

};