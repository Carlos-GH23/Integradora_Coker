
import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { User } from '../models/UserModels';
import { AdminServices } from '../services/Services';
import ErrorMessage from '../custom/ErrorMessage';
import AlertMessage from '../custom/AlertMessage';
import ModalForm from '../custom/ModalForm';
import SuccessMessage from '../custom/SuccessMessage';
import { isAdmin } from '../services/LoginServices';

DataTable.use(DT);
const ListNurses = () => {
    const [loading, setLoading] = useState(true);
    const [nurses, setNurses] = useState<User[]>([]);
    const [formData, setFormData] = useState<User>({ id: 0, fullName: "", email: "", phoneNumber: "", username: "", password: "" });
    
    const [viewModalForm, setViewModalForm] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState<User | null>(null);
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const Service = new AdminServices<User>();
    const [errors, setErrors] = useState<{ fullName?: string; email?: string; phoneNumber?: string; username?: string; password?: string}>({});
    
    const isEdit = formData.id !== 0;
    
    const fetchNurses = async () => {
        setLoading(true);
        try {
            const response = await Service.getAllNurses();
            const nursesArray: User[] = response.data;
            setNurses(nursesArray);
            console.log(nursesArray);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNurses();
    }, []);

    const validateForm = () => {
        let newErrors: { fullName?: string; email?: string; phoneNumber?: string; username?: string; password?: string } = {};
    
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
            };
            if (!isEdit) {
                await Service.createNurse(editNewNurse as User);
                setSuccessMessage("Enfermero(a) registrado exitosamente");
            } else {
                await Service.updateNurse(formData.id, editNewNurse as User);
                setSuccessMessage("Enfermero(a) actualizado exitosamente");
            }
            setAlertMessage(false);
            toggleModalForm();
            fetchNurses();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const handleDelete = (nurse: User) => {
        setSelectedNurse(nurse);
        setAlertMessage(true);
    };

    const confirmDelete = async () => {
        setErrorMessage("");
        try {
            if (selectedNurse) {
                await Service.deleteNurse(selectedNurse.id)
                setSuccessMessage("Eliminación exitosamente");
                fetchNurses();
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
                <h2 className="text-2xl font-bold text-center font-serif">Enfermeras</h2>
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
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nurses.map((nurse) => (
                            <tr key={nurse.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{nurse.id}</td>
                                <td className="px-6 py-4">{nurse.fullName}</td>
                                <td className="px-6 py-4">{nurse.phoneNumber}</td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
                                        {nurse.email.charAt(0)}
                                    </span>
                                    <span>{nurse.email}</span>
                                </td>
                                <td className="px-6 py-4">{nurse.username}</td>
                                {isAdmin() && (
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
                                            onClick={() => { setFormData(nurse); toggleModalForm(); }}
                                        >
                                            <FaPen size={18} />
                                        </button>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-700 transition cursor-pointer"
                                            onClick={() => handleDelete(nurse)}
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
                        setFormData({ id: 0, fullName: "", email: "", phoneNumber: "", username: "", password: ""});
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
                            <label className="block text-sm font-medium">Nombre Completo</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Usuario</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Telefono</label>
                            <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                maxLength={10}
                                inputMode="numeric"
                                pattern="\d*"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Correo</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        {!isEdit && (
                            <div>
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
                textBodyConfirm={`¿Estás seguro de que deseas ${isEdit ? "actualizar la información del" : "registrar al nuevo"} enfermera/o?`}
            />

            {alertMessage && selectedNurse && (
                <AlertMessage
                    title="Confirmar Eliminación"
                    body={`¿Estás seguro de que deseas eliminar a ${selectedNurse.fullName}?`}
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

export default ListNurses;

