import { useState, useEffect, ReactNode } from "react";
import { MdErrorOutline } from "react-icons/md";

interface AlertMessageProps {
    title: string;
    colorTitle?: string;
    body: string;
    icon?: ReactNode;
    onCancel?: () => void;
    onConfirm?: () => void;
    colorConfirm?: string;
    isDelete?: boolean;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ title, colorTitle = "#DB2828", body, icon, onCancel, onConfirm, isDelete = false}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        console.log('body: ', body)
        if (body) {
            setVisible(true);
        }
    }, [title, body]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="w-95 rounded-lg shadow-lg overflow-hidden w-full max-w-lg sm:max-w-md md:max-w-xl lg:max-w-2xl min-h-[40vh] max-h-[90vh] overflow-y-auto relative" style={{ backgroundColor: "#F5F5F5" }}>
                <div className="text-white text-center py-3 text-lg font-bold" style={{ backgroundColor: colorTitle }}>
                    {title}
                </div>

                {/* Icono y mensaje */}
                <div className="flex flex-col items-center pl-6 pt-6 pr-6 pb-2">
                    {icon ? icon : <MdErrorOutline className="text-red-600 text-8xl mb-4" />}
                    <p className="text-center text-2xl font-semibold">{body}</p>
                </div>

                {/* Botones */}
                {isDelete ? (
                    <div className="flex justify-around p-4 ">
                        <button 
                            onClick={() => { setVisible(false); onConfirm && onConfirm(); }} 
                            style={{ backgroundColor: '#DB2828' }}
                            className="hover:brightness-120 text-white font-bold py-3 px-4 rounded-lg w-full text-lg shadow-md cursor-pointer m-2"
                        >
                            Continuar
                        </button>
                        <button 
                            onClick={() => { setVisible(false); onCancel && onCancel(); }} 
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg w-full text-lg shadow-md cursor-pointer m-2"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-around p-4 ">
                        <button 
                            onClick={() => { setVisible(false); onCancel && onCancel(); }} 
                            style={{ backgroundColor: '#DB2828' }}
                            className="hover:brightness-120 text-white font-bold py-3 px-4 rounded-lg w-full text-lg shadow-md cursor-pointer m-2"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => { setVisible(false); onConfirm && onConfirm(); }} 
                            className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full text-lg shadow-md cursor-pointer m-2"
                        >
                            Continuar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertMessage;