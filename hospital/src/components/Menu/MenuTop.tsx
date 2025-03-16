
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsPeopleFill } from "react-icons/bs";

function MenuTop({ user }: { user: string }) {
    const [sidehide, setsidehide] = useState(true);
    if (user === "nurse") {
        return (
            <div className="flex ml-22 md:ml-28">
                <div className="fixed top-0 left-0 h-screen g:w-48 bg-[#0077B6] text-white p-4 flex flex-col ">
                    <div className="item-align-center grid justify-items-center">
                        <img className="g:w-26 g:h-26 md:w-22 md:h-22 w-15 h-15 rounded-full object-cover" src="https://i.pinimg.com/736x/ba/de/cd/badecd78f1dd41cf0e9ccded2b80c30c.jpg" alt="" />
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <AiFillHome size={35} />
                        <span className="text- text-white">Inicio</span>
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <BsPeopleFill size={35} />
                        <span className="text- text-white">Pacientes</span>
                    </div>
                </div>
            </div>
        );
    } else if (user === "admin") {
        return (
            <div className="fixed top-0 left-0 h-screen w-48 bg-gray-800 text-white p-4 flex flex-col ">
                <div className="item-align-center grid justify-items-center">
                    <img className="w-28 h-28 rounded-full object-cover" src="https://i.pinimg.com/736x/ba/de/cd/badecd78f1dd41cf0e9ccded2b80c30c.jpg" alt="" />
                </div>
                <div className="mt-5 item-align-center grid justify-items-center">
                    <AiFillHome size={35} />
                    <span className="text- text-white">Inicio</span>
                </div>
            </div>
        );
    } else if (user === "secretary") {
        return (
            <div className="fixed top-0 left-0 h-screen w-48 bg-gray-800 text-white p-4 flex flex-col ">
                <div className="item-align-center grid justify-items-center">
                    <img className="w-28 h-28 rounded-full object-cover" src="https://i.pinimg.com/736x/ba/de/cd/badecd78f1dd41cf0e9ccded2b80c30c.jpg" alt="" />
                </div>
                <div className="mt-5 item-align-center grid justify-items-center">
                    <AiFillHome size={35} />
                    <span className="text- text-white">Inicio</span>
                </div>
            </div>
        );
    }
}

export default MenuTop;