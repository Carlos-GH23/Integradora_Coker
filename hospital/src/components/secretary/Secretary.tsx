import { useState } from "react";
import MenuTop from "../components/sidebar";
import { Outlet } from "react-router-dom";

function Secretary() {
    const [user, setUser] = useState("secretary");
    return (
        <>
            <div className="flex w-screen">
                <div className="h-full">
                    <MenuTop user={user} />
                </div>
                <div className="flex-1 p-4 overflow-auto  bg-white-400">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Secretary;