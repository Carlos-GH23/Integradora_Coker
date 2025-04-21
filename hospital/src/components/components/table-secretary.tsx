import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { Floor, User } from '../models/UserModels';
import { AdminServices } from '../services/Services';
import AlertMessage from '../custom/AlertMessage';
import ErrorMessage from '../custom/ErrorMessage';
import SuccessMessage from '../custom/SuccessMessage';
import ModalForm from '../custom/ModalForm';
import { a } from 'framer-motion/client';

DataTable.use(DT);
const ListSecretary = () => {
    const [loading, setLoading] = useState(true);
    const [secretary, setSecretarys] = useState<User[]>([]);
    const [formData, setFormData] = useState<User>({ id: 0, fullName: "", email: "", phoneNumber: "", username: "", password: "", floor: {id: 0, identifier: "", bednumber: 0}, floorId: 0 });
    
    const [viewModalForm, setViewModalForm] = useState(false);
    const [selectedSecretary, setSelectedSecretary] = useState<User | null>(null);
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const Service = new AdminServices<User>();
    const floorService = new AdminServices<Floor>();
    const [floors, setfloors] = useState<Floor[]>([]);
    const [errors, setErrors] = useState<{ fullName?: string; email?: string; phoneNumber?: string; username?: string; password?: string, floor?: string}>({});
    
    const isEdit = formData.id !== 0;  

    const fetchsecretarys = async () => {
        setLoading(true);
        try {
            const response = await Service.getAllSecretary();
            const secretaryArray: User[] = response.data;
            setSecretarys(secretaryArray);
            console.log(secretaryArray);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const fetchFloor = async () => {
        try {
            const response = await floorService.getAllFloor();
            const floorArray: Floor[] = response.data;
            setfloors(floorArray);
        } catch (error) {
            console.error("Hubo un problema al cargar los pisos. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    useEffect(() => {
        fetchsecretarys();
        fetchFloor();
    }, []);

    const validateForm = () => {
        let newErrors: { fullName?: string; email?: string; phoneNumber?: string; username?: string; password?: string; floor?: string } = {};
    
        // Validar nombre completo
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
        if (!formData.fullName.trim()) {
            newErrors.fullName = "El nombre es obligatorio";
        } else if (!nameRegex.test(formData.fullName.trim())) {
            newErrors.fullName = "El nombre solo puede contener letras y espacios";
        }
    
        // Validar correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "El correo es obligatorio";
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Ingresa un correo válido";
        }
    
        // Validar teléfono
        const phoneRegex = /^\d{10}$/;
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "El teléfono es obligatorio";
        } else if (!phoneRegex.test(formData.phoneNumber.trim())) {
            newErrors.phoneNumber = "El teléfono debe contener exactamente 10 dígitos numéricos";
        }
    
        // Validar usuario
        const usernameRegex = /^[A-Za-z0-9_]+$/;
        if (!formData.username.trim()) {
            newErrors.username = "El usuario es obligatorio";
        } else if (!usernameRegex.test(formData.username.trim())) {
            newErrors.username = "El usuario no debe contener espacios ni caracteres especiales";
        }
    
        // Validar contraseña (solo si es nuevo)
        if (!isEdit) {
            if (!formData.password.trim()) {
                newErrors.password = "La contraseña es obligatoria";
            } else if (/\s/.test(formData.password)) {
                newErrors.password = "La contraseña no debe contener espacios";
            }
        }
        
        if (formData.floor === undefined || formData.floor === null || formData.floor.id === 0) newErrors.floor = "El piso es obligatorio";
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setErrorMessage("");
        try {
            const editNewNurse = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                username: formData.username,
                password: formData.password,
                floor: {
                    id: formData.floor.id,
                    identifier: formData.floor.identifier,
                },
            };
            if (!isEdit) {
                await Service.createSecretary(editNewNurse as User);
            } else {
                await Service.updateSecretary(formData.id, editNewNurse as User);
            }
            const asignFloor = {
                userId: formData.id,
                floorId: formData.floor.id,
            };
            await Service.floorSecretary(asignFloor)
            setSuccessMessage(isEdit ? "Secretaria(o) editada exitosamente" : "Secretaria(o) creada exitosamente");
            setAlertMessage(false);
            toggleModalForm();
            fetchsecretarys();
            fetchFloor();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const handleDelete = (secretary: User) => {
        setSelectedSecretary(secretary);
        setAlertMessage(true);
    };

    const confirmDelete = async () => {
        setErrorMessage("");
        try {
            if (selectedSecretary) {
                await Service.deleteSecretary(selectedSecretary.id)
                setSuccessMessage("Eliminación exitosamente");
                fetchsecretarys();
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

    const handleChange = (key: keyof User, value: string | number) => {
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
                <h2 className="text-2xl font-bold text-center font-serif">Secretarias</h2>
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
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Telefono</th>
                            <th className="px-6 py-3">Correo</th>
                            <th className="px-6 py-3">Usuario</th>
                            <th className="px-6 py-3">Piso</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {secretary.map((secretary) => (
                            <tr key={secretary.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{secretary.id}</td>
                                <td className="px-6 py-4">{secretary.fullName}</td>
                                <td className="px-6 py-4">{secretary.phoneNumber}</td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
                                        {secretary.email.charAt(0)}
                                    </span>
                                    <span>{secretary.email}</span>
                                </td>
                                <td className="px-6 py-4">{secretary.username}</td>
                                <td className="px-6 py-4">
                                    {
                                        secretary.floor?.identifier
                                        ?? floors.find(f => f.id === (secretary as any).floorId)?.identifier
                                        ?? "Sin asignación"
                                    }
                                </td>

                                <td className="px-6 py-4 flex space-x-2">
                                    <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
                                        onClick={() => { setFormData(secretary); toggleModalForm(); }}>
                                        <FaPen size={18} />
                                    </button>
                                    <button
                                        className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-700 transition cursor-pointer"
                                        onClick={() => handleDelete(secretary)}>
                                        <FaTrash size={18} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            </div>

            <button className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
                onClick={() => {
                    setFormData({ id: 0, fullName: "", email: "", phoneNumber: "", username: "", password: "", floor: {id: 0, identifier: "", bednumber: 0}, floorId: 0 });
                    toggleModalForm();
                }}
            >
                <FaPlus size={24} />
            </button>

            <ModalForm
                isOpen={viewModalForm}
                onClose={toggleModalForm}
                onSubmit={handleSubmit}
                validateForm={validateForm}
                title={isEdit ? "Editar Secretaria" : "Registrar Secretaria"}
                textActionOk={isEdit ? "Actualizar" : "Guardar"}
                body={
                    <>
                        <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-3">
                                <label className="block text-sm font-medium">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Usuario</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleChange("username", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>

                            <div className="col-span-3">
                                <label className="block text-sm font-medium">Correo</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Teléfono</label>
                                <input
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium">Piso</label>
                            <select
                                value={formData.floorId || 0}
                                onChange={(e) => {
                                    const selectedFloorId = parseInt(e.target.value);
                                    const selectedFloor = floors.find(f => f.id === selectedFloorId);
                                    if (selectedFloor) {
                                        setFormData({
                                            ...formData,
                                            floorId: selectedFloor.id,
                                            floor: {
                                                id: selectedFloor.id,
                                                identifier: selectedFloor.identifier,
                                                bednumber: selectedFloor.bednumber
                                            }
                                        });
                                        setErrors(prev => ({ ...prev, floor: undefined }));
                                    }
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            >
                                <option value="0" disabled hidden>Seleccionar piso</option>
                                {floors
                                    .filter(floor => floor.occupied !== 1 || floor.id === (formData.floorId ?? 0))
                                    .map(floor => (
                                        <option key={floor.id} value={floor.id}>
                                            {floor.identifier}
                                        </option>
                                ))}
                            </select>
                            {errors.floor && <p className="text-red-500 text-sm">{errors.floor}</p>}
                        </div>

                        {!isEdit && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium">Contraseña</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>
                        )}
                    </>
                }
                textConfirm={isEdit ? "Confirmación actualización" : "Confirmación registro"}
                textBodyConfirm={`¿Estás seguro de que deseas ${isEdit ? "actualizar la información del" : "registrar al nuevo"} secretaria/o?`}
            />

            {alertMessage && selectedSecretary && (
                <AlertMessage
                    title="Confirmar Eliminación"
                    body={`¿Estás seguro de que deseas eliminar a ${selectedSecretary.fullName}?`}
                    onCancel={() => setAlertMessage(false)}
                    onConfirm={confirmDelete}
                    isDelete={true}
                />
            )}

            {errorMessage && <ErrorMessage message={errorMessage} />}
            {successMessage && <SuccessMessage message={successMessage} />}

        </div>

    );


}

export default ListSecretary;

