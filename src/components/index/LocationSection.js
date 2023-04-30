export default function LocationSection() {

    return (
        <>
            <div className="relative w-full overflow-x-clip">
                <div className="absolute z-10 top-0 w-[150%] h-44 bg-white" style={{ transform: "translate3d(-80px, -30%, 0px) rotate(3deg)" }}></div>
            </div>

            <div className="relative z-20 w-[95%] lg:w-[80%] max-w-[1800px] m-auto flex flex-col gap-10 justify-start items-center my-4" id="localizacao">

                <div className="w-[95%]">

                    <div className="flex flex-row items-center mb-4 gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40" className="fill-black">
                            <path d="M480 757q102.3-82.573 154.484-158.953 52.183-76.38 52.183-142.714 0-58-21.167-98.5t-52.173-65.92q-31.006-25.42-67.18-36.834-36.174-11.413-66.147-11.413-29.973 0-66.147 11.413-36.174 11.414-67.18 36.834-31.006 25.42-52.173 65.92t-21.167 98.5q0 66.334 52.184 142.714Q377.7 674.427 480 757Zm0 84.333Q341.667 738 274.167 642.533q-67.5-95.466-67.5-187.036 0-69.164 24.833-121.33 24.833-52.167 64.167-87.5 39.333-35.334 87.986-53Q432.306 176 479.987 176q47.68 0 96.346 17.667 48.667 17.666 88 53Q703.667 282 728.5 334.189q24.833 52.188 24.833 121.448 0 91.696-67.5 187.029Q618.333 738 480 841.333Zm.059-318.667q30.274 0 51.774-21.559t21.5-51.833q0-30.274-21.559-51.774T479.941 376q-30.274 0-51.774 21.559t-21.5 51.833q0 30.274 21.559 51.774t51.833 21.5ZM206.667 976v-66.666h546.666V976H206.667ZM480 455.333Z"/>
                        </svg>
                        <h1 className="font-lgc font-bold text-black text-4xl">LOCALIZAÇÃO</h1>
                    </div>

                    <p className="font-lgc text-black text-2xl">
                        Estamos localizados na Rua Imaculada Conceição, 1150 - Portão 2, Curitiba - PR, 80240-000, use o mapa abaixo para chegar até nós.
                    </p>
                </div>

                <iframe className="w-[95%] border border-neutral-600 rounded-lg" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.6682721066977!2d-49.25503324911012!3d-25.449351739810858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce4fa1bc3c2f9%3A0x7589c488a2097ac0!2sPUCPR%20-%20Port%C3%A3o%202!5e0!3m2!1sen!2sbr!4v1679836947756!5m2!1sen!2sbr" width="600" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

                <button className="flex flex-row gap-2 justify-center items-center bg-green-600 px-5 py-2 font-lgc text-white text-lg shadow-lg rounded-md hover:bg-green-500 hover:scale-[102%] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                        <path d="m574 927-214-75-186 72q-20 8-37-4.5T120 886V326q0-13 7.5-23t20.5-15l186-63q13-4 26-4.5t26 4.5l214 75 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812 864l-186 63q-13 4-26 4.5t-26-4.5Zm-14-89V370l-160-56v468l160 56Zm80 0 120-40V324l-120 46v468Zm-440-10 120-46V314l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/>
                    </svg>
                    Ver no Google Maps
                </button>

            </div>
        </>
    )

}