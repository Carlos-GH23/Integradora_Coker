import { useState } from "react";
import MenuTop from "../Menu/MenuTop";
import Tablepacients from "../Tables/nurses-pacients";

function Nurses() {
    const [user, setUser] = useState("nurse");
    return (
        <>
            <div className="flex w-screen">
                <MenuTop user={user} />
                <Tablepacients/>
                <div className="w-full hidden">
                    <div className="grid grid-cols-1 gap-2  md:grid-cols-4 md:gap-4">
                        <div className="col-span-4 w-full rounded-t-lg text-center">
                            <div className="w-full bg-[#0077B6] rounded-t-lg text-center ">
                                <h1 className="text-xl text-white">Piso Asignado</h1>
                            </div>
                            <div className="w-full h-12 bg-gray-100 rounded-b-lg text-center ">
                                <h1 className="text-2xl pt-2">Numero: 1</h1>
                            </div>
                        </div>
                        <div className="col-span-4 w-full rounded-t-lg text-center">
                            <div className="w-full bg-[#0077B6] rounded-t-lg text-center ">
                                <h1 className="text-xl text-white">Camas Asignadas</h1>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 md:gap-4 p-4 bg-gray-100 rounded-b-lg ">
                                <div className="w-full">
                                    <div className="w-full bg-[#99CCFF] rounded-t-lg text-center ">
                                        <h1 className="text-xl ">Num de Cama</h1>
                                    </div>
                                    <div className="w-full h-12 bg-blue-100 rounded-b-lg text-center ">
                                        <h1 className="text-2xl">12</h1>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="w-full bg-[#99CCFF] rounded-t-lg text-center ">
                                        <h1 className="text-xl">Num de Cama</h1>
                                    </div>
                                    <div className="w-full h-12 bg-blue-100 rounded-b-lg text-center ">
                                        <h1 className="text-2xl">12</h1>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="w-full bg-[#99CCFF] rounded-t-lg text-center ">
                                        <h1 className="text-xl">Num de Cama</h1>
                                    </div>
                                    <div className="w-full h-12 bg-blue-100 rounded-b-lg text-center ">
                                        <h1 className="text-2xl">12</h1>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="w-full bg-[#99CCFF] rounded-t-lg text-center ">
                                        <h1 className="text-xl">Num de Cama</h1>
                                    </div>
                                    <div className="w-full h-12 bg-blue-100 rounded-b-lg text-center ">
                                        <h1 className="text-2xl">12</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Nurses;