import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { AiFillHome } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";
import { GiFlatPlatform } from "react-icons/gi";
import { FaUserNurse } from "react-icons/fa";
import { IoBedSharp } from "react-icons/io5";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { logout } from "../services/LoginServices";

function MenuTop({ user }: { user: string }) {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Tu sesión se cerrará.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    };

    const nurse = [
        { name: "Inicio", path: "", icon: <AiFillHome size={30} /> },
        { name: "Pacientes", path: "pacientes", icon: <BsPeopleFill size={30} /> },
    ]

    const secretary = [
        { name: "Inicio", path: "", icon: <AiFillHome size={30} /> },
        { name: "Enfermeras", path: "enfermeras", icon: <FaUserNurse size={30} /> },
        { name: "Camas", path: "camas", icon: <IoBedSharp size={30} /> },
    ]

    const admin = [
        { name: "Inicio", path: "", icon: <AiFillHome size={30} /> },
        { name: "Secretarias", path: "secretarias", icon: <BsPeopleFill size={30} /> },
        { name: "Enfermeras", path: "enfermeras", icon: <FaUserNurse size={30} /> },
        { name: "Pisos", path: "pisos", icon: <GiFlatPlatform size={30} /> },
    ]

    if (user === "nurse") {
        return (
            <div className="flex">
                <div className={`bg-[#0077B6] text-white shadow-lg h-screen p-5 pt-8 ${isOpen ? "w-64" : "w-21"} duration-300 relative`}>
                    <button
                        className="absolute top-6 right-[-15px] bg-white text-[#0077B6] rounded-full p-1 border-2 border-solid"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <HiChevronLeft size={25} className="text-[#0077B6]" /> : <HiChevronRight size={25} className="text-[#0077B6]" />}
                    </button>
                    <div className="flex items-center gap-x-4 mb-6">
                        <img
                            src="https://i.pinimg.com/736x/55/0e/2e/550e2e29394d7b437525f585ff30ac55.jpg"
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 "
                        />
                        {isOpen && (
                            <div className="flex flex-col max-w-xs overflow-hidden">
                            </div>
                        )}
                    </div>

                    <ul className="space-y-4">
                        {nurse.map((item) => (
                            <li
                                key={item.path}
                                className={`flex items-center gap-x-3 p-2 rounded-lg cursor-pointer transition duration-300 w-full 
                                ${location.pathname.includes(item.path) ? "bg-white text-[#0077B6]" : "hover:bg-[#0077B6] hover:text-black"}`}
                                onClick={() => navigate(item.path)}
                            >
                                <span className={`${location.pathname.includes(item.path) ? "text-white" : "text-[#3B82F6]"}`}>
                                    {item.icon}
                                </span>
                                {isOpen && <span>{item.name}</span>}
                            </li>
                        ))}
                    </ul>
                    <div
                        className="absolute bottom-8 left-5 flex items-center gap-x-3 p-2 rounded-lg text-white hover:bg-white hover:text-black cursor-pointer"
                        onClick={handleLogout}
                    >
                        <HiArrowLeftOnRectangle size={30} />
                        {isOpen && <span>Cerrar Sesion</span>}
                    </div>
                </div>
            </div>
        );
    } else if (user === "admin") {
        return (
            <div className="flex">
                <div className={`bg-[#34495E] text-white shadow-lg h-screen p-5 pt-8 ${isOpen ? "w-64" : "w-21"} duration-300 relative`}>
                    <button
                        className="absolute top-6 right-[-15px] bg-white text-[#0077B6] rounded-full p-1 border-2 border-solid"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <HiChevronLeft size={25} className="text-[#0077B6]" /> : <HiChevronRight size={25} className="text-[#0077B6]" />}
                    </button>
                    <div className="flex items-center gap-x-4 mb-6">
                        <img
                            src="https://i.pinimg.com/736x/4d/a7/85/4da7852cd8d1673b38ca81cf1b4ba4be.jpg"
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 "
                        />
                        {isOpen && (
                            <div className="flex flex-col max-w-xs overflow-hidden">
                            </div>
                        )}
                    </div>
                    <ul className="space-y-4">
                        {admin.map((item) => (
                            <li
                                key={item.path}
                                className={`flex items-center gap-x-3 p-2 rounded-lg cursor-pointer transition duration-300 w-full 
                                ${location.pathname.includes(item.path) ? "bg-white text-[#34495E]" : "hover:bg-white hover:text-[#34495E] text-white"}}`}
                                onClick={() => navigate(item.path)}
                            >
                                <span className={`transition-colors duration-300 ${location.pathname.includes(item.path)
                                    ? "text-[#0077B6]" : "text-[#0077B6] group-hover:text-[#34495E]"}`}>
                                    {item.icon}
                                </span>
                                {isOpen && <span>{item.name}</span>}
                            </li>
                        ))}
                    </ul>
                    <div
                        className="absolute bottom-8 left-5 flex items-center gap-x-3 p-2 rounded-lg text-white hover:bg-white hover:text-black cursor-pointer"
                        onClick={handleLogout}
                    >
                        <HiArrowLeftOnRectangle size={30} />
                        {isOpen && <span>Cerrar Sesion</span>}
                    </div>
                </div>
            </div>
        );
    } else if (user === "secretary") {
        return (
            <div className="flex">
                <div className={`bg-[#0077B6] text-white shadow-lg h-screen p-5 pt-8 ${isOpen ? "w-64" : "w-21"} duration-300 relative`}>
                    <button
                        className="absolute top-6 right-[-15px] bg-white text-[#0077B6] rounded-full p-1 border-2 border-solid"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <HiChevronLeft size={25} className="text-[#0077B6]" /> : <HiChevronRight size={25} className="text-[#0077B6]" />}
                    </button>
                    <div className="flex items-center gap-x-4 mb-6">
                        <img
                            src="https://i.pinimg.com/736x/55/0e/2e/550e2e29394d7b437525f585ff30ac55.jpg"
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 "
                        />
                        {isOpen && (
                            <div className="flex flex-col max-w-xs overflow-hidden">
                            </div>
                        )}
                    </div>
                    <ul className="space-y-4">
                        {secretary.map((item) => (
                            <li
                                key={item.path}
                                className={`flex items-center gap-x-3 p-2 rounded-lg cursor-pointer transition duration-300 w-full 
                    ${location.pathname.includes(item.path) ? "bg-[#1D4ED8] text-white" : "hover:bg-white hover:text-black"}`}
                                onClick={() => navigate(item.path)}
                            >
                                <span className={`${location.pathname.includes(item.path) ? "text-white" : "text-[#3B82F6]"}`}>
                                    {item.icon}
                                </span>
                                {isOpen && <span>{item.name}</span>}
                            </li>
                        ))}
                    </ul>
                    <div
                        className="absolute bottom-8 left-5 flex items-center gap-x-3 p-2 rounded-lg text-white hover:bg-white hover:text-black cursor-pointer"
                        onClick={handleLogout}
                    >
                        <HiArrowLeftOnRectangle size={30} />
                        {isOpen && <span>Cerrar Sesion</span>}
                    </div>
                </div>
            </div>

        );
    }
}

export default MenuTop;