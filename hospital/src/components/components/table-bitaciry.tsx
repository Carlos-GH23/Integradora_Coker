import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { Floor, LogEntry } from '../models/UserModels';
import { AdminServices } from '../services/Services';
import ErrorMessage from '../custom/ErrorMessage';
import AlertMessage from '../custom/AlertMessage';
import ModalForm from '../custom/ModalForm';
import SuccessMessage from '../custom/SuccessMessage';
import { isAdmin } from '../services/LoginServices';


DataTable.use(DT);
const Bitacory = () => {
    const [loading, setLoading] = useState(true);
    const [Bitacora, setBitacora] = useState<LogEntry[]>([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const Service = new AdminServices<LogEntry>();

    const fetchBitacora = async () => {
        setLoading(true);
        try {
            const response = await Service.getBitacora();
            const bitacoraA: LogEntry[] = response.data;
            console.log("Respuesta cruda:", bitacoraA);
            setBitacora(bitacoraA); 
        } catch (error) {
            console.error(error);
            setErrorMessage("Hubo un problema al cargar la bitácora");
        } finally {
            setLoading(false);
        }
    };
    


    useEffect(() => {
        fetchBitacora();
    }, []);


    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    return (
        <div className="pt-4 w-full ">

            <div className="w-full h-15 rounded-lg bg-[#34495E] text-white mb-2 flex justify-center items-center">
                <h2 className="text-2xl font-bold text-center font-serif">Bitacora</h2>
            </div>

            <div className="overflow-y-auto min-h-[200px] bg-white shadow-md rounded-lg p-4">
                <DataTable className="min-w-full table-auto display"
                    options={{
                        language: {
                            search: "Buscar:",
                            lengthMenu: "Mostrar _MENU_ registros por página",
                            infoEmpty: "No hay registros disponibles",
                            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                        },
                    }}
                >
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Usuario</th>
                            <th className="px-6 py-3">Metodo</th>
                            <th className="px-6 py-3">Endpoint</th>
                            {isAdmin() && <th className="px-6 py-3">Fecha</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(Bitacora) && Bitacora.length > 0 ? (
                            Bitacora.map((bitacora) => (
                                <tr key={bitacora.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{bitacora.id}</td>
                                    <td className="px-6 py-4">{bitacora.usuario}</td>
                                    <td className="px-6 py-4">{bitacora.metodoHttp}</td>
                                    <td className="px-6 py-4">{bitacora.endpoint}</td>
                                    <td className="px-6 py-4">{new Date(bitacora.fechaHora).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-400">
                                    No hay registros en la bitácora 🪵
                                </td>
                            </tr>
                        )}
                    </tbody>

                </DataTable>
            </div>

            {/* ErrorMessage */}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            {/* SuccessMessage */}
            {successMessage && <SuccessMessage message={successMessage} />}

        </div>
    );


}

export default Bitacory;

