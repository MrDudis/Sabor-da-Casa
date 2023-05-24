import Link from "next/link";

export default function PersonBox({ user, animationDelay }) {

    if (!user) {
        return (
            <div className="w-full min-w-[190px] h-20 flex flex-col xs:flex-row items-center px-4 py-4 border border-neutral-400 transition-all bg-neutral-100 gap-6 rounded-lg shimmer smooth-slide-down-fade-in opacity-0" style={{ animationDelay: `${animationDelay}ms` }}>
    
            </div>
        );
    };

    return (
        <Link href={`/painel/pessoas/${user?.id}`} className="w-full min-w-[190px] h-20 flex flex-col xs:flex-row items-center px-4 py-4 border border-neutral-400 cursor-pointer hover:bg-neutral-50 hover:shadow-xl transition-all bg-neutral-100 gap-6 rounded-lg fast-fade-in">

            <div className="w-full flex flex-row justify-start items-center gap-4">
                <div className="flex justify-start items-center">
                    <img className="h-10 w-10 min-w-[40px] xs:h-12 xs:w-12 rounded-full" src="/images/profile.jpg"></img>
                </div>

                <div className="flex flex-col justify-center items-start truncate">
                    <p className="text-black font-lgc font-bold text-lg">{user?.name}</p>
                    <p className="text-black font-lgc text-sm">{user?.role}</p>
                </div>
            </div>

        </Link>
    );

};