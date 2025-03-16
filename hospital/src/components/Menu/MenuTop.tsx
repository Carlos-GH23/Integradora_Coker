
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";
import { GiFlatPlatform } from "react-icons/gi";
import { FaUserNurse } from "react-icons/fa";
import { IoBedSharp } from "react-icons/io5";

function MenuTop({ user }: { user: string }) {
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
                    <div className="mt-auto item-align-center grid justify-items-center pb-4">
                        <IoLogOut size={35} />
                    </div>
                </div>
            </div>
        );
    } else if (user === "admin") {
        return (
            <div className="flex ml-22 md:ml-28">
                <div className="fixed top-0 left-0 h-screen g:w-48 bg-[#34495E] text-white p-4 flex flex-col ">
                    <div className="item-align-center grid justify-items-center">
                        <img className="g:w-26 g:h-26 md:w-22 md:h-22 w-15 h-15 rounded-full object-cover" src="https://i.pinimg.com/736x/ba/de/cd/badecd78f1dd41cf0e9ccded2b80c30c.jpg" alt="" />
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <AiFillHome size={35} />
                        <span className="text- text-white">Inicio</span>
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <BsPeopleFill size={35} />
                        <span className="text- text-white">Secretarias</span>
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <GiFlatPlatform size={35} />
                        <span className="text- text-white">Pisos</span>
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <FaUserNurse size={35} />
                        <span className="text- text-white">Enfermeras</span>
                    </div>
                    <div className="mt-auto item-align-center grid justify-items-center pb-4">
                        <IoLogOut size={35} />
                    </div>
                </div>
            </div>
        );
    } else if (user === "secretary") {
        return (
            <div className="flex ml-22 md:ml-28">
                <div className="fixed top-0 left-0 h-screen g:w-48 bg-[#117A65] text-white p-4 flex flex-col ">
                    <div className="item-align-center grid justify-items-center">
                        <img className="g:w-26 g:h-26 md:w-22 md:h-22 w-15 h-15 rounded-full object-cover" src="https://i.pinimg.com/736x/ba/de/cd/badecd78f1dd41cf0e9ccded2b80c30c.jpg" alt="" />
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <AiFillHome size={35} />
                        <span className="text- text-white">Inicio</span>
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <IoBedSharp size={35} />
                        <span className="text- text-white">Camas</span>
                    </div>
                    <div className="mt-5 item-align-center grid justify-items-center">
                        <FaUserNurse size={35} />
                        <span className="text- text-white">Enfermeras</span>
                    </div>
                    <div className="mt-auto item-align-center grid justify-items-center pb-4">
                        <IoLogOut size={35} />
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuTop;