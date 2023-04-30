export default function ContactSection() {
    
    return (

        <div className="w-[95%] lg:w-[80%] max-w-[1800px] m-auto flex flex-col lg:flex-row gap-24 justify-start items-center my-24" id="contato">

                <div className="w-[95%] lg:w-[60%]">

                    <div className="flex flex-row items-center mb-4 gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40" className="fill-black">
                            <path d="M518.667 555.999q-8.667 8-18.333 3.667-9.667-4.333-9.667-15.667V252q0-15.667 11.833-25.833Q514.334 216 530.667 216h270Q817 216 828.5 226.167 840 236.333 840 252v185.333q0 17-11.167 28.5-11.166 11.5-28.166 11.5H600l-81.333 78.666ZM796 936q-124.333 0-245.5-59.167-121.167-59.166-216.667-154.666T179.167 505.5Q120 384.333 120 260q0-18.667 12.667-31.333Q145.333 216 164 216h147.333q14 0 24.667 9.333 10.666 9.334 13.333 24.667L376 380.666q2 14-.5 25.5T364.666 426L266 526q51.333 86 118.667 153Q452 746 536 793.334l94.667-96.667q9.667-10.333 23.167-14.833 13.5-4.5 26.833-1.834L806 706.667q14.667 3 24.333 14.5Q840 732.667 840 748v144q0 18.667-12.667 31.333Q814.667 936 796 936Z"/>
                        </svg>
                        <h1 className="font-lgc font-bold text-black text-4xl">CONTATO E RESERVAS</h1>
                    </div>

                    <p className="font-lgc text-black text-2xl">O salão está aberto para reserva de mesas para grupos maiores do que 8 e reservas para eventos de quinta a sábado, ao lado você entra os hórarios de funcionamento e abaixo nossas informações de contato.</p>
                    
                    <p className="font-lgc text-black text-xl mt-8"><span className="font-bold text-lg">E-MAIL: </span>sabordacasa@gmail.com</p>
                    <p className="font-lgc text-black text-xl"><span className="font-bold text-lg">TELEFONE: </span>(41) 98765-4321</p>
                </div>

                <div className="w-[95%] lg:w-[40%]">
                    
                    <div className="bg-neutral-900 p-2 lg:p-6">

                        <div className="flex flex-col justify-center items-center border border-neutral-400">

                            <div className="flex flex-row items-center my-5 gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28" className="fill-white">
                                    <path d="M585 737q11 11 27 11t28-12q11-11 11-28t-11-28L520 560V415q0-17-11.5-28T480 376q-17 0-28.5 11.5T440 416v159q0 8 3 15.5t9 13.5l133 133ZM480 976q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm0-400Zm0 320q133 0 226.5-93.5T800 576q0-133-93.5-226.5T480 256q-133 0-226.5 93.5T160 576q0 133 93.5 226.5T480 896Z"/>
                                </svg>
                                <h1 className="font-lgc text-white text-3xl">HORÁRIOS</h1>
                            </div>

                            <div className="w-[80%] flex flex-col border-t-2 border-neutral-400 mb-4">

                                <div className="w-full flex justify-between items-center mt-4 my-1">
                                    <p className="font-lgc text-white text-lg">Segunda-Feira</p>
                                    <p className="font-lgc text-white text-md">11:30 - 20:00</p>
                                </div>

                                <div className="w-full flex justify-between items-center my-1">
                                    <p className="font-lgc text-white text-lg">Terça-Feira</p>
                                    <p className="font-lgc text-white text-md">11:30 - 20:00</p>
                                </div>

                                <div className="w-full flex justify-between items-center my-1">
                                    <p className="font-lgc text-white text-lg">Quarta-Feira</p>
                                    <p className="font-lgc text-white text-md">11:30 - 20:00</p>
                                </div>

                                <div className="w-full flex justify-between items-center my-1">
                                    <p className="font-lgc text-white text-lg">Quinta-Feira</p>
                                    <p className="font-lgc text-white text-md">11:30 - 20:00</p>
                                </div>

                                <div className="w-full flex justify-between items-center my-1">
                                    <p className="font-lgc text-white text-lg">Sexta-Feira</p>
                                    <p className="font-lgc text-white text-md">11:30 - 20:00</p>
                                </div>

                                <div className="w-full flex justify-between items-center my-1">
                                    <p className="font-lgc text-white text-lg">Sábado</p>
                                    <p className="font-lgc text-white text-md">11:30 - 20:00</p>
                                </div>

                                <div className="w-full flex justify-between items-center my-1">
                                    <p className="font-lgc text-white text-lg">Domingo</p>
                                    <p className="font-lgc text-white text-md">11:30 - 19:00</p>
                                </div>

                            </div>

                        </div>

                    </div>
                    
                </div>

            </div>

    );

};