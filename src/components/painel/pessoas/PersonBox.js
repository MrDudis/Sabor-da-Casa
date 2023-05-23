export default function PersonBox({ user }) {

    return (
        <div className="w-full h-fit flex flex-col xs:flex-row items-center px-4 py-4 bg-neutral-100 gap-6 rounded-lg min-w-[250px]">

            <div className="w-full xs:w-[50%] flex flex-row justify-start items-center gap-4">
                <div className="flex justify-start items-center">
                    <img className="h-12 min-w-[48px] rounded-full" src="/images/profile.jpg"></img>
                </div>

                <div className="flex flex-col justify-center items-start">
                    <p className="text-black font-lgc font-bold text-lg truncate">Eduardo Obladen</p>
                    <p className="text-black font-lgc text-sm truncate">Administrador</p>
                </div>
            </div>

            <div className="w-full xs:w-[50%] flex flex-row justify-end items-center pr-1 gap-4">

                <div className="relative bg-neutral-200 p-2 cursor-pointer rounded-lg hover:bg-neutral-300 transition-all group">

                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-12 -right-2 bg-neutral-800 px-2 py-1 rounded-lg transition-all transition-delay-300">
                        <p className="text-white font-lgc">Editar</p>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-neutral-700">
                        <path d="M772.957 455.63 601.761 286.196l54.565-54.805q23.957-23.956 58.652-24.195 34.696-.239 59.609 24.195l52.652 52.413q24.913 24.435 25.196 58.25.282 33.816-23.674 57.772l-55.804 55.804ZM163.826 939.826q-19.152 0-32.326-13.174t-13.174-32.326V787.783q0-9.196 3.359-17.533 3.358-8.337 10.315-15.293l411.761-411.761 171.435 171.195-411.761 411.761q-6.957 6.957-15.413 10.315-8.457 3.359-17.652 3.359H163.826Z"/>
                    </svg>

                </div>

                <button className="relative bg-neutral-200 p-2 cursor-pointer rounded-lg hover:bg-neutral-300 transition-all group">

                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-12 -right-3 bg-neutral-800 px-2 py-1 rounded-lg transition-all transition-delay-300">
                        <p className="text-white font-lgc">Deletar</p>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className="fill-neutral-700">
                        <path d="M687.413 527.63q-18.435 0-31.13-12.695-12.696-12.696-12.696-31.131 0-18.435 12.696-31.011 12.695-12.576 31.13-12.576h160q18.435 0 31.011 12.576T891 483.804q0 18.435-12.576 31.131-12.576 12.695-31.011 12.695h-160Zm-326.696 44.305q-69.587 0-118.858-49.272-49.272-49.272-49.272-118.859 0-69.587 49.272-118.739 49.271-49.152 118.858-49.152t118.859 49.152q49.272 49.152 49.272 118.739t-49.272 118.859q-49.272 49.272-118.859 49.272ZM78.087 908.196q-19.152 0-32.326-13.174t-13.174-32.326v-75.109q0-36.152 18.695-66.565 18.696-30.413 49.848-46.37 62.718-31.239 127.674-46.978 64.957-15.739 131.913-15.739 67.435 0 132.392 15.619 64.956 15.62 127.195 46.859 31.153 15.957 49.848 46.25 18.696 30.294 18.696 66.924v75.109q0 19.152-13.174 32.326t-32.326 13.174H78.087Z"/>
                    </svg>

                </button>

            </div>

        </div>
    );

};