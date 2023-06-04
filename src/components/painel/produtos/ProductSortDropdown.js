import { useState, useEffect } from "react";

export default function ProductSortDropdown({ selectedSortOption, setSortOption, sortOptions, sortOptionsLabels, showDropdown }) {

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

            {
                selectedSortOption == sortOptions.NAME.ASC ? (
                    <div onClick={() => { setSortOption(sortOptions.NAME.DESC) }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="w-5 h-5 fill-white">
                            <path d="M138-270q-31 0-43.5-20.365Q82-310.731 92-338l114.95-304q8.05-20 27.55-34t42.529-14Q299-690 318-676.213q19 13.788 27 34.213l114 301q11 28.647-4.042 49.824Q439.917-270 408-270q-14.344 0-26.672-10-12.328-10-17.052-22.732L343-366H202.702l-21.746 65.136Q176-289 164.182-279.5 152.364-270 138-270Zm95-184h80l-38-112h-4l-38 112Zm365.088 184Q574-270 556.5-287.296T539-329q0-12.55 5-28.275Q549-373 558-384l168-214H593q-18.833 0-32.417-13.618Q547-625.235 547-644.118 547-663 560.583-676.5 574.167-690 593-690h196.908Q814-690 831.5-672.71T849-630q0 12.564-5.5 27.782T829-576L665-362h140q18.833 0 32.417 13.618Q851-334.765 851-315.882 851-297 837.417-283.5 823.833-270 805-270H598.088ZM420-747q-23.167 0-32.583-21Q378-789 395-806l61-60q2-2 24.429-10Q484-876 504-866l61 60q17 17 8.083 38-8.916 21-32.083 21H420Zm59.571 663Q476-84 456-94l-61-60q-17-17-8.083-38 8.916-21 32.083-21h121q23.167 0 32.583 21Q582-171 565-154l-61 60q-2 2-24.429 10Z"/>
                        </svg>
                        <p className="text-white font-lgc">{sortOptionsLabels[sortOptions.NAME.DESC]}</p>
                    </div>
                ) : (
                    <div onClick={() => { setSortOption(sortOptions.NAME.ASC) }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="w-5 h-5 fill-white">
                            <path d="M138-270q-31 0-43.5-20.365Q82-310.731 92-338l114.95-304q8.05-20 27.55-34t42.529-14Q299-690 318-676.213q19 13.788 27 34.213l114 301q11 28.647-4.042 49.824Q439.917-270 408-270q-14.344 0-26.672-10-12.328-10-17.052-22.732L343-366H202.702l-21.746 65.136Q176-289 164.182-279.5 152.364-270 138-270Zm95-184h80l-38-112h-4l-38 112Zm365.088 184Q574-270 556.5-287.296T539-329q0-12.55 5-28.275Q549-373 558-384l168-214H593q-18.833 0-32.417-13.618Q547-625.235 547-644.118 547-663 560.583-676.5 574.167-690 593-690h196.908Q814-690 831.5-672.71T849-630q0 12.564-5.5 27.782T829-576L665-362h140q18.833 0 32.417 13.618Q851-334.765 851-315.882 851-297 837.417-283.5 823.833-270 805-270H598.088ZM420-747q-23.167 0-32.583-21Q378-789 395-806l61-60q2-2 24.429-10Q484-876 504-866l61 60q17 17 8.083 38-8.916 21-32.083 21H420Zm59.571 663Q476-84 456-94l-61-60q-17-17-8.083-38 8.916-21 32.083-21h121q23.167 0 32.583 21Q582-171 565-154l-61 60q-2 2-24.429 10Z"/>
                        </svg>
                        <p className="text-white font-lgc">{sortOptionsLabels[sortOptions.NAME.ASC]}</p>
                    </div>
                )
            }

            {
                selectedSortOption == sortOptions.PRICE.ASC ? (
                    <div onClick={() => { setSortOption(sortOptions.PRICE.DESC) }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="w-4 h-4 ml-1 fill-white">
                            <path d="M594-85q-35 35-83 35t-83-35L85-428q-16.625-16.927-25.813-38.463Q50-488 50-511v-281q0-48.7 34.65-83.35Q119.3-910 168-910h281q23.468 0 44.234 8.5Q514-893 531.727-875.302L875-533q35 35 35 83t-35 83L594-85ZM264-636q25 0 42.5-17.5T324-696q0-25-17.5-42.5T264-756q-25 0-42.5 17.5T204-696q0 25 17.5 42.5T264-636Z"/>
                        </svg>
                        <p className="text-white font-lgc">{sortOptionsLabels[sortOptions.PRICE.DESC]}</p>
                    </div>
                ) : (
                    <div onClick={() => { setSortOption(sortOptions.PRICE.ASC) }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="w-4 h-4 ml-1 fill-white">
                            <path d="M594-85q-35 35-83 35t-83-35L85-428q-16.625-16.927-25.813-38.463Q50-488 50-511v-281q0-48.7 34.65-83.35Q119.3-910 168-910h281q23.468 0 44.234 8.5Q514-893 531.727-875.302L875-533q35 35 35 83t-35 83L594-85ZM264-636q25 0 42.5-17.5T324-696q0-25-17.5-42.5T264-756q-25 0-42.5 17.5T204-696q0 25 17.5 42.5T264-636Z"/>
                        </svg>
                        <p className="text-white font-lgc">{sortOptionsLabels[sortOptions.PRICE.ASC]}</p>
                    </div>
                )
            }

            {
                selectedSortOption == sortOptions.STOCK.ASC ? (
                    <div onClick={() => { setSortOption(sortOptions.STOCK.DESC) }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"  className="w-4 h-4 ml-1 fill-white">
                            <path d="M216-42q-54.65 0-92.325-37Q86-116 86-171v-430.19q-17-13.499-28.5-35.654Q46-659 46-694.839V-784q0-54.65 37.675-92.325Q121.35-914 176-914h608q54.65 0 92.325 37.675Q914-838.65 914-784v89.161q0 35.839-11 57.995-11 22.155-28 35.654V-171q0 55-37.675 92T745-42H216Zm568-653v-89H176v89h608ZM389.825-381h180.35q19.8 0 34.312-14.518Q619-410.035 619-430.018 619-450 604.487-465q-14.512-15-34.312-15h-180.35q-19.8 0-34.312 14.8Q341-450.4 341-430q0 19.975 14.513 34.487Q370.025-381 389.825-381Z"/>
                        </svg>
                        <p className="text-white font-lgc">{sortOptionsLabels[sortOptions.STOCK.DESC]}</p>
                    </div>
                ) : (
                    <div onClick={() => { setSortOption(sortOptions.STOCK.ASC) }} className="w-full flex flex-row items-center gap-2 p-1.5 rounded-md hover:bg-stone-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"  className="w-4 h-4 ml-1 fill-white">
                            <path d="M216-42q-54.65 0-92.325-37Q86-116 86-171v-430.19q-17-13.499-28.5-35.654Q46-659 46-694.839V-784q0-54.65 37.675-92.325Q121.35-914 176-914h608q54.65 0 92.325 37.675Q914-838.65 914-784v89.161q0 35.839-11 57.995-11 22.155-28 35.654V-171q0 55-37.675 92T745-42H216Zm568-653v-89H176v89h608ZM389.825-381h180.35q19.8 0 34.312-14.518Q619-410.035 619-430.018 619-450 604.487-465q-14.512-15-34.312-15h-180.35q-19.8 0-34.312 14.8Q341-450.4 341-430q0 19.975 14.513 34.487Q370.025-381 389.825-381Z"/>
                        </svg>
                        <p className="text-white font-lgc">{sortOptionsLabels[sortOptions.STOCK.ASC]}</p>
                    </div>
                )
            }

        </div>

    );

};