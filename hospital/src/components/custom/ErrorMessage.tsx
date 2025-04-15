import { useState, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";

const ErrorMessage = ({ message }: { message: string }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        console.log('message: ', message)
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut flex items-center space-x-2">
            <MdErrorOutline className="text-white text-xl" />
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage;
