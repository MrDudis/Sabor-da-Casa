import { roleNames } from "../../../models/User.js";

export default function MiniPersonBox({ user, selectedUser, setSelectedUser }) {

    if (!user) {
        return (
            <div className="w-full min-w-[96px] h-20 flex flex-row items-center gap-4 p-4 border border-neutral-400 transition-all bg-neutral-100 rounded-lg shimmer fast-fade-in">
    
            </div>
        );
    };

    return (
        <div onClick={() => { setSelectedUser(selectedUser == user?.id ? null : user?.id); }} className={`w-full min-w-[96px] h-20 flex flex-row items-center gap-4 p-4 ${selectedUser == user?.id ? "border-2 border-red-500" : "border border-neutral-300"} cursor-pointer transition-all bg-neutral-100 hover:bg-neutral-50 rounded-lg fast-fade-in`}>

                <div className="flex justify-center items-center">
                    <img className="h-12 w-12 min-w-[48px] xs:h-12 xs:w-12 rounded-full" src="/images/profile.jpg"></img>
                </div>

                <div className="flex flex-col justify-center items-start truncate">
                    <p className="w-full h-full text-black font-lgc font-bold truncate">{user?.name}</p>
                    <p className="text-black font-lgc text-xs">{roleNames[user?.role]}</p>
                </div>

        </div>
    );

};