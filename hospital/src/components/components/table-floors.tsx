import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { Floor, User } from '../models/UserModels';
import { AdminServices } from '../services/AdminServices';
import ErrorMessage from '../custom/ErrorMessage';
import AlertMessage from '../custom/AlertMessage';
import ModalForm from '../custom/ModalForm';
import SuccessMessage from '../custom/SuccessMessage';
import { isAdmin } from '../services/LoginServices';

DataTable.use(DT);
const ListFloor = () => {
    const [formData, setFormData] = useState<Floor>({ id: 0, identifier: "" });
    const [errors, setErrors] = useState<{ identifier?: string;}>({});
    const [floor, setfloor] = useState<Floor[]>([]);
    const Service = new AdminServices<Floor>();

    const [viewModalForm, setViewModalForm] = useState(false);
    const isEdit = formData.id !== 0;
    const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchfloor = async () => {
        try {
            const response = await Service.getAllFloor();
            const floorArray: Floor[] = response.data;
            setfloor(floorArray);
            console.log(floorArray);
        } catch (error) {
            console.error(error)
        } finally {
            console.log("Que bien")
        }
    };

    useEffect(() => {
        fetchfloor();
    }, []);

    const validateForm = () => {
        let newErrors: { identifier?: string; } = {};
        if (!formData.identifier.trim()) newErrors.identifier = "El nombre es obligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            const editNewFloor = {
                identifier: formData.identifier,
            };
            if (formData.id === 0) {
                await Service.createFloor(editNewFloor as Floor)
                setSuccessMessage("Cliente creado exitosamente");
            } else {
                await Service.updateFloor(formData.id, editNewFloor as Floor)
                setSuccessMessage("Cliente editado exitosamente");
            }
            fetchfloor();
        } catch (error) {
            setErrorMessage(`${error}`);
        } finally {
            setAlertMessage(false);
            toggleModalForm();
        }
    };

    const handleDelete = (client: Floor) => {
        setSelectedFloor(client);
        setAlertMessage(true);
    };

    const confirmDelete = async () => {
        try {
            if (selectedFloor) {
                await Service.deleteFloor(formData.id)
                setSuccessMessage("Eliminación exitosamente");
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

    const handleChange = (key: keyof Floor, value: string | number | Date) => {
        setFormData({ ...formData, [key]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [key]: undefined }));
    };

    return (
        <div className="pt-4 w-full ">

            <div className="w-full h-15 rounded-lg bg-gray-900 text-white mb-2 flex justify-center items-center">
                <h2 className="text-2xl font-bold text-center font-serif">Pisos</h2>
            </div>

            <div className="max-h-[calc(88vh-80px)] overflow-y-auto min-h-[200px] bg-white shadow-md rounded-lg p-4">
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
                            <th className="px-6 py-3">Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {floor.map((Floor) => (
                            <tr key={Floor.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{Floor.id}</td>
                                <td className="px-6 py-4">{Floor.identifier}</td>

                                {isAdmin() && (
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
                                            onClick={() => { setFormData(Floor); toggleModalForm(); }}
                                        >
                                            <FaPen size={18} />
                                        </button>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-700 transition cursor-pointer"
                                            onClick={() => handleDelete(Floor)}
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                )}

                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            </div>

            {isAdmin() && (
                <button className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
                    onClick={() => {
                        setFormData({ id: 0, identifier: "",});
                        toggleModalForm();
                    }}
                >
                    <FaPlus size={24} />
                </button>
            )}

            <ModalForm
                isOpen={viewModalForm}
                onClose={toggleModalForm}
                onSubmit={handleSubmit}
                validateForm={validateForm}
                title={isEdit ? "Editar Enfermera" : "Registrar Enfermera"}
                textActionOk={isEdit ? "Actualizar" : "Guardar"}
                body={
                    <>
                        <div>
                            <label className="block text-sm font-medium">Nombre</label>
                            <input
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => handleChange("identifier", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                            />
                            {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier}</p>}
                        </div>
                    </>
                }
                textConfirm={isEdit ? "Confirmación actualización" : "Confirmación registro"}
                textBodyConfirm={`¿Estás seguro de que deseas ${isEdit ? "actualizar la información del" : "registrar al nuevo"} enfermera/o?`}
            />

            {alertMessage && selectedFloor && (
                <AlertMessage
                    title="Confirmar Eliminación"
                    body={`¿Estás seguro de que deseas eliminar a ${selectedFloor.identifier}?`}
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

