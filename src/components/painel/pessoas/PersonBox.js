import Link from "next/link";

import { roleNames } from "@/models/User";

export default function PersonBox({ user, animationDelay }) {

    if (!user) {
        return (
            <div className="w-full min-w-[148px] h-52 flex flex-col xs:flex-row items-center px-4 py-4 border border-neutral-400 transition-all bg-neutral-100 gap-6 rounded-lg shimmer smooth-slide-down-fade-in opacity-0" style={{ animationDelay: `${animationDelay}ms` }}>
    
            </div>
        );
    };

    return (
        <Link href={`/painel/pessoas/${user?.id}`} className="w-full min-w-[148px] h-52 flex flex-col xs:flex-row items-center gap-8 px-4 py-4 border border-neutral-400 cursor-pointer hover:bg-neutral-50 hover:shadow-xl hover:scale-[102%] transition-all bg-neutral-100 rounded-lg fast-fade-in">

            <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                <div className="w-full flex justify-center items-center">
                    <img className="h-14 w-14 min-w-[56px] xs:h-20 xs:w-20 rounded-full" src="/images/profile.jpg"></img>
                </div>

                <div className="w-full flex flex-col justify-center items-center text-center">
                    <p className="w-full h-full text-black font-lgc font-bold text-lg truncate-2-line">{user?.name}</p>
                    <p className="text-black font-lgc text-sm">{roleNames[user?.role]}</p>
                </div>
            </div>

        </Link>
    );

};