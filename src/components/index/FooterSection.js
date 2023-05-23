export default function FooterSection() {

    return (

        <div className="w-full bg-gradient-to-b from-neutral-800 to-neutral-950">

            <div className="w-[90%] max-w-[1800px] py-12 m-auto flex flex-col sm:flex-row gap-10 sm:gap-4">

                <div className="w-full sm:w-[60%] flex flex-col gap-8">

                    <h1 className="font-august text-white text-5xl text-center sm:text-start">Sabor da Casa</h1>

                    <div className="flex flex-col gap-2">
                        
                        <div className="flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="fill-neutral-300 min-w-[20px]">
                                <path d="M479.949 577.913q33.768 0 57.866-24.047t24.098-57.815q0-33.768-24.047-57.866t-57.815-24.098q-33.768 0-57.866 24.047t-24.098 57.815q0 33.768 24.047 57.866t57.815 24.098ZM480 862.587q119.204-109.821 176.852-199.541 57.648-89.72 57.648-159.123 0-106.549-67.892-174.486Q578.717 261.5 480.054 261.5t-166.608 67.937Q245.5 397.374 245.5 503.923q0 69.403 57.648 159.123Q360.796 752.766 480 862.587Zm0 120.587Q316.37 843.783 235.435 724.605 154.5 605.428 154.5 504q0-152.515 98.152-243.008Q350.804 170.5 479.978 170.5q129.174 0 227.348 90.492Q805.5 351.485 805.5 504q0 101.428-80.935 220.605Q643.63 843.783 480 983.174ZM480 504Z"/>
                            </svg>
                            <p className="font-lgc text-neutral-300 text-md">Rua Imaculada Conceição, 1150 - Portão 2, Curitiba - PR, 80240-000</p>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="fill-neutral-300 min-w-[20px]">
                                <path d="M162.87 904.131q-37.783 0-64.392-26.609Q71.87 850.913 71.87 813.13V338.87q0-37.783 26.61-64.392 26.608-26.609 64.391-26.609h634.26q37.783 0 64.392 26.609 26.609 26.609 26.609 64.392v474.26q0 37.783-26.609 64.392-26.609 26.609-64.392 26.609H162.87Zm634.26-477.848L504.109 611.131q-5.673 3.478-11.913 5.217-6.239 1.739-12.196 1.739t-12.196-1.739q-6.24-1.739-11.913-5.217L162.87 426.283V813.13h634.26V426.283ZM480 538.87l317.13-200H162.87l317.13 200ZM162.87 426.283v10.956-63.934 1.111-35.546 35.587-.859 63.641-10.956V813.13 426.283Z"/>
                            </svg>
                            <p className="font-lgc text-neutral-300 text-md">sabordacasa@gmail.com</p>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="fill-neutral-300 min-w-[20px]">
                                <path d="M798.239 943.413q-130.674 0-254.489-58.217-123.815-58.218-219.511-153.913-95.696-95.696-153.913-219.511-58.217-123.815-58.217-254.489 0-21.348 14.152-35.501 14.152-14.152 35.5-14.152h161.761q19.5 0 33.369 11.152 13.87 11.153 17.305 29.935l25.761 134.979q2.956 17.826-.5 31.956-3.457 14.131-15.087 25.044l-97.674 96.087q40.087 67.695 99.5 126.989 59.413 59.293 130.391 102.663l95.674-94.957q11.63-11.391 28.522-16.489 16.891-5.098 34.478-1.902l131.543 27.282q19.022 4.435 30.055 17.446 11.032 13.011 11.032 32.033v163.674q0 21.348-14.152 35.619-14.152 14.272-35.5 14.272Z"/>
                            </svg>
                            <p className="font-lgc text-neutral-300 text-md">+55 (41) 98765-4321</p>
                        </div>

                    </div>

                </div>

                <div className="w-full sm:w-[40%]">

                    <div className="w-full flex flex-row sm:justify-end items-start gap-2 pr-[10%]">

                        <div className="flex flex-col sm:items-end gap-1">
                            <a className="font-lgc text-neutral-400 text-lg cursor-pointer hover:text-white transition-all" href="/login">Área Restrita</a>
                            <a className="font-lgc text-neutral-400 text-lg cursor-pointer hover:text-white transition-all">Empregos</a>
                            <a className="font-lgc text-neutral-400 text-lg cursor-pointer hover:text-white transition-all">Cardápio</a>
                            <a className="font-lgc text-neutral-400 text-lg cursor-pointer hover:text-white transition-all">Avaliar</a>
                            <a className="font-lgc text-neutral-400 text-lg cursor-pointer hover:text-white transition-all">Localização</a>
                            <a className="font-lgc text-neutral-400 text-lg cursor-pointer hover:text-white transition-all">Contato</a>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};