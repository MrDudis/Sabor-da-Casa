import { useState, useEffect } from "react";

export default function PersonSortDropdown({ showDropdown }) {

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

    return (

        <div className={`${dropdownDisplay} absolute z-30 w-fit min-w-[186px] top-12 left-0 p-1.5 rounded-md flex-col justify-center items-end bg-stone-800 shadow-2xl ${showDropdown ? "dropdown-slide-in" : "dropdown-slide-out"}`}>

            <div className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="w-5 h-5 fill-white">
                    <path d="M138-270q-31 0-43.5-20.365Q82-310.731 92-338l114.95-304q8.05-20 27.55-34t42.529-14Q299-690 318-676.213q19 13.788 27 34.213l114 301q11 28.647-4.042 49.824Q439.917-270 408-270q-14.344 0-26.672-10-12.328-10-17.052-22.732L343-366H202.702l-21.746 65.136Q176-289 164.182-279.5 152.364-270 138-270Zm95-184h80l-38-112h-4l-38 112Zm365.088 184Q574-270 556.5-287.296T539-329q0-12.55 5-28.275Q549-373 558-384l168-214H593q-18.833 0-32.417-13.618Q547-625.235 547-644.118 547-663 560.583-676.5 574.167-690 593-690h196.908Q814-690 831.5-672.71T849-630q0 12.564-5.5 27.782T829-576L665-362h140q18.833 0 32.417 13.618Q851-334.765 851-315.882 851-297 837.417-283.5 823.833-270 805-270H598.088ZM420-747q-23.167 0-32.583-21Q378-789 395-806l61-60q2-2 24.429-10Q484-876 504-866l61 60q17 17 8.083 38-8.916 21-32.083 21H420Zm59.571 663Q476-84 456-94l-61-60q-17-17-8.083-38 8.916-21 32.083-21h121q23.167 0 32.583 21Q582-171 565-154l-61 60q-2 2-24.429 10Z"/>
                </svg>
                <p className="text-white font-lgc">Nome (Crescente)</p>
            </div>

            <div className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="w-4 h-4 ml-1 fill-white">
                    <path d="M240-233.217h240v-18q0-17-9.5-31.5t-26.5-22.5q-20-9-40.5-13.5t-43.5-4.5q-23 0-43.5 4.5t-40.5 13.5q-17 8-26.5 22.5t-9.5 31.5v18Zm350-60h100q13 0 21.5-8.5t8.5-21.5q0-13-8.5-21.5t-21.5-8.5H590q-13 0-21.5 8.5t-8.5 21.5q0 13 8.5 21.5t21.5 8.5Zm-230-60q25 0 42.5-17.5t17.5-42.5q0-25-17.5-42.5t-42.5-17.5q-25 0-42.5 17.5t-17.5 42.5q0 25 17.5 42.5t42.5 17.5Zm230-60h100q13 0 21.5-8.5t8.5-21.5q0-13-8.5-21.5t-21.5-8.5H590q-13 0-21.5 8.5t-8.5 21.5q0 13 8.5 21.5t21.5 8.5ZM166.783-60.782q-44.305 0-75.153-30.848-30.848-30.848-30.848-75.153v-426.434q0-44.305 30.848-75.153 30.848-30.848 75.153-30.848h173.999v-106.434q0-40.914 26.326-67.24 26.326-26.326 67.24-26.326h91.304q40.914 0 67.24 26.326 26.326 26.326 26.326 67.24v106.434h173.999q44.305 0 75.153 30.848 30.848 30.848 30.848 75.153v426.434q0 44.305-30.848 75.153-30.848 30.848-75.153 30.848H166.783ZM441.13-613.566h77.74V-798.87h-77.74v185.304Z"/>
                </svg>
                <p className="text-white font-lgc">Cargo (Maior ao Menor)</p>
            </div>

        </div>

    );

};