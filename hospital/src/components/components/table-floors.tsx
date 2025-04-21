import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { Floor } from '../models/UserModels';
import { AdminServices } from '../services/Services';
import ErrorMessage from '../custom/ErrorMessage';
import AlertMessage from '../custom/AlertMessage';
import ModalForm from '../custom/ModalForm';
import SuccessMessage from '../custom/SuccessMessage';
import { isAdmin } from '../services/LoginServices';
import { a } from 'framer-motion/client';

DataTable.use(DT);
const ListFloor = () => {
    const [loading, setLoading] = useState(true);
    const [floors, setfloors] = useState<Floor[]>([]);
    const [formData, setFormData] = useState<Floor>({ id: 0, identifier: "", bednumber: 0 });

    const [viewModalForm, setViewModalForm] = useState(false);
    const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const Service = new AdminServices<Floor>();
    const [errors, setErrors] = useState<{ identifier?: string; bednumber?: string }>({});
    const isEdit = formData.id !== 0;

    const fetchfloor = async () => {
        setLoading(true);
        try {
            const response = await Service.getAllFloor();
            const floorArray: Floor[] = response.data;
            setfloors(floorArray);
        } catch (error) {
            console.error(error);
            setErrorMessage("Hubo un problema al cargar los pisos. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchfloor();
    }, []);

    const validateForm = () => {
        let newErrors: { identifier?: string, bednumber?: string} = {};
        const regex = /^[a-zA-Z0-9\s]+$/;
    
        if (!formData.identifier.trim()) {
            newErrors.identifier = "El nombre es obligatorio";
        } else if (!regex.test(formData.identifier)) {
            newErrors.identifier = "El nombre no debe contener caracteres especiales";
        }
        if (!formData.bednumber || isNaN(Number(formData.bednumber)) || Number(formData.bednumber) <= 0) {
            newErrors.bednumber = "Debe ingresar una cantidad válida mayor a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    

    const handleSubmit = async () => {
        setErrorMessage("");
        try {
            const editNewFloor = {
                identifier: formData.identifier,
                bednumber: formData.bednumber,
            };
            if (!isEdit) {
                await Service.createFloor(editNewFloor as Floor)
                setSuccessMessage("Piso creado exitosamente");
            } else {
                await Service.updateFloor(formData.id, editNewFloor as Floor)
                setSuccessMessage("Piso actualizado exitosamente");
            }
            setAlertMessage(false);
            toggleModalForm();
            fetchfloor();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const handleDelete = (floor: Floor) => {
        setSelectedFloor(floor);
        setAlertMessage(true);
    };

    const confirmDelete = async () => {
        setErrorMessage("");
        try {
            if (selectedFloor) {
                await Service.deleteFloor(selectedFloor.id)
                setSuccessMessage("Eliminación exitosa");
                fetchfloor();
            }
        } catch (error) {
            setErrorMessage(`${error}`);
        } finally {
            setAlertMessage(false);
        }
    };

    const toggleModalForm = () => {
        setViewModalForm(!viewModalForm);
        setErrors({});
    };

    const handleChange = (key: keyof Floor, value: string) => {
        setFormData({ ...formData, [key]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [key]: undefined }));
    };

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
                <h2 className="text-2xl font-bold text-center font-serif">Pisos</h2>
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
                            <th className="px-6 py-3">Piso</th>
                            <th className="px-6 py-3">Número de Camas</th>
                            {isAdmin() && <th className="px-6 py-3">Acciones</th>}
                        </tr>
                    </thead>
                    
                    <tbody>
                        {floors.map((Floor) => (
                            <tr key={Floor.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{Floor.id}</td>
                                <td className="px-6 py-4">{Floor.identifier}</td>
                                <td className="px-6 py-4">{Floor.bednumber}</td>
                                {isAdmin() && (
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button 
                                            className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
                                            onClick={() => { setFormData(Floor); toggleModalForm(); }}>
                                            <FaPen size={18} />
                                        </button>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-700 transition cursor-pointer"
                                            onClick={() => handleDelete(Floor)}>
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                )}

                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            </div>

            <button className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
                onClick={() => {
                    setFormData({ id: 0, identifier: "", bednumber: 0 });
                    toggleModalForm();
                }}>
                <FaPlus size={24} />
            </button>

            <ModalForm
                isOpen={viewModalForm}
                onClose={toggleModalForm}
                onSubmit={handleSubmit}
                validateForm={validateForm}
                title={isEdit ? "Editar Piso" : "Registrar Piso"}
                textActionOk={isEdit ? "Actualizar" : "Guardar"}
                body={
                    <>
                        <div>
                            <label className="block text-sm font-medium">Nombre del Piso</label>
                            <input
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => handleChange("identifier", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Número de camas</label>
                            <input
                                type="number"
                                value={formData.bednumber}
                                min={1}
                                onChange={(e) => handleChange("bednumber", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            {errors.bednumber && <p className="text-red-500 text-sm">{errors.bednumber}</p>}
                        </div>
                    </>
                }
                textConfirm={isEdit ? "Confirmación actualización" : "Confirmación registro"}
                textBodyConfirm={`¿Estás seguro de que deseas ${isEdit ? "actualizar la información del" : "registrar el nuevo"} piso?`}
            />

            {alertMessage && selectedFloor && (
                <AlertMessage
                    title="Confirmar Eliminación"
                    body={`¿Estás seguro de que deseas eliminar el piso ${selectedFloor.identifier}?`}
                    onCancel={() => setAlertMessage(false)}
                    onConfirm={confirmDelete}
                    isDelete={true}
                />
            )}

            {/* ErrorMessage */}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            {/* SuccessMessage */}
            {successMessage && <SuccessMessage message={successMessage} />}

        </div>
    );


}

export default ListFloor;

