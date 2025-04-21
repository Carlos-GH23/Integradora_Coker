import { useNavigate } from "react-router-dom";

const ServerError = () => {
    const navigate = useNavigate();
    
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="grid grid-cols-2 w-[30vw] h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col col-span-2 h-[20vh] md:h-[40vh] justify-center items-center p-8" style={{
                    backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr-C5cB-KTPta9mveKUeO_E3KRjGUqpApkfQ&s')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}>
                </div>
                <div className="flex flex-col col-span-2 items-center p-8">
                    <h1 className="text-[15px] md:text-[50px] text-center font-bold">500</h1>
                    <span className="text-[10px] md:text-[25px] text-center font-semibold ">Lo sentimos al parecer la pagina tuvo problemas favor de llamar al equipo FullStakers
                    </span>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white mt-2 font-bold py-3 px-4 rounded-lg w-[20vw] text-lg" onClick={() => navigate(-1)}>Volver</button>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
