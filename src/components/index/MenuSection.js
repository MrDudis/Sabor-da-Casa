export default function MenuSection() {

    return (
        <>
            <div className="relative w-full overflow-x-clip">
                <div className="absolute z-10 top-0 w-[150%] h-44 bg-white" style={{ transform: "translate3d(0px, -50%, 0px) rotate(-3deg)" }}></div>
            </div>

            <div className="relative z-20 w-[95%] lg:w-[80%] m-auto flex flex-col lg:flex-row gap-24 justify-start items-center my-16" id="cardapio">

                <div className="xl:w-[55%] px-12">
                    
                    <div className="flex flex-row items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40" className="fill-black">
                            <path d="M148.333 912.667q-9.666-9.667-9.666-23.333 0-13.667 9.666-23.334l393.334-393.333q-20.667-46-8.333-98 12.333-52 57-96 47.666-47 111.999-58.334Q766.667 209 807.667 250q41.666 41.667 29.666 105.333-12 63.667-61 113.334-41.333 42.666-92.666 55.666-51.334 13-94.667-5.667L527.666 580l286.001 286q9.666 9.667 9.666 23.334 0 13.666-9.666 23.333-10 10-23.334 10-13.333 0-23.333-10L481 627.333 195 912.667q-10 10-23.333 10-13.334 0-23.334-10Zm146-324.667L175 468.667q-45-45-51.833-104-6.834-59 22.5-111.334Q154.333 239 171 237.667q16.666-1.334 29 11.333l216.333 217-122 122Z"/>
                        </svg>
                        <h1 className="font-lgc font-bold text-black text-4xl">CARDÁPIO</h1>
                    </div>
                    
                    <p className="font-lgc text-black text-2xl">Explore nosso cardápio variado, com opções que vão desde entradas saborosas até sobremesas irresistíveis. Delicie-se com nossos pratos preparados com ingredientes frescos e selecione os seus favoritos. Experimente sabores autênticos da nossa cozinha e deixe-se levar por uma experiência gastronômica única.</p>
                    
                    <button className="flex flex-row gap-2 justify-center items-center bg-red-600 mt-8 px-5 py-2 font-lgc text-white text-lg shadow-lg rounded-md hover:bg-red-500 hover:scale-[102%] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-white">
                            <path d="M557.692 485.846v-52.615q32.615-15.153 68.269-22.73T700 402.924q24.077 0 46.769 3.423 22.692 3.423 45.538 9.038v50.153q-22.461-7.846-44.653-11.385-22.193-3.538-47.654-3.538-38.385 0-74.346 9.115-35.962 9.116-67.962 26.116Zm0 219.23v-53.383q31.846-15.154 68.077-22.731Q662 621.385 700 621.385q24.077 0 46.769 3.423 22.692 3.423 45.538 9.038v50.153q-22.461-7.846-44.653-11.384-22.193-3.539-47.654-3.539-38.385 0-74.346 9.193-35.962 9.192-67.962 26.807Zm0-109.23v-53.384q32.615-15.154 68.269-22.731 35.654-7.577 74.039-7.577 24.077 0 46.769 3.423 22.692 3.423 45.538 9.039v50.153q-22.461-7.847-44.653-11.385-22.193-3.538-47.654-3.538-38.385 0-74.346 9.5-35.962 9.5-67.962 26.5Zm-47.693 187.539q46.308-24.077 93.308-35.346 47-11.27 96.693-11.27 36 0 67.615 5.231 31.615 5.231 60.076 14.923 4.616 1.923 8.463-.577 3.846-2.5 3.846-7.885V370.154q0-3.461-1.923-6.154t-6.539-4.616q-33-12.846-64.269-18.5Q736 335.231 700 335.231q-49.693 0-98.77 13.731t-91.231 41.192v393.231ZM480 871.383q-48.385-35.692-104.385-55.154-56-19.461-115.615-19.461-36.615 0-71.922 8.115-35.308 8.115-68.077 23.884-21.384 9.846-40.692-3.115-19.307-12.962-19.307-36.731V354.616q0-12.923 6.653-24.269 6.654-11.346 19.193-16.346 41.23-19.154 84.961-28.961 43.73-9.808 89.191-9.808 58.385 0 114.077 15.962Q429.769 307.155 480 338.309q50.231-31.154 105.923-47.115Q641.615 275.232 700 275.232q45.461 0 89.191 9.808 43.731 9.807 84.961 28.961 12.539 5 19.193 16.346 6.654 11.346 6.654 24.269v434.305q0 23.769-20.077 36.346-20.077 12.577-42.231 2.731-32.385-15.384-67.115-23.307-34.73-7.923-70.576-7.923-59.615 0-115.615 19.461-56 19.462-104.385 55.154Z"/>
                        </svg>
                        Ver Cardápio
                    </button>
                </div>

                <div className="">
                    <img className="" src="/images/meal-top-view-home.png"></img>
                </div>

            </div>

            <div className="relative w-full overflow-x-clip">
                <div className="absolute z-10 top-0 w-[150%] h-44 bg-white" style={{ transform: "translate3d(-50px, -75%, 0px) rotate(-3deg)" }}></div>
            </div>
        </>
    );

};