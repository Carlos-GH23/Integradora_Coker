import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { Bed, Floor, Patient, User } from '../models/UserModels';
import { AdminServices } from '../services/Services';
import ErrorMessage from '../custom/ErrorMessage';
import ModalForm from '../custom/ModalForm';
import SuccessMessage from '../custom/SuccessMessage';
import { isSecretary } from '../services/LoginServices';

DataTable.use(DT);
const ListBeds = () => {
    const [loading, setLoading] = useState(true);
    const [beds, setbeds] = useState<Bed[]>([]);
    const [formData, setFormData] = useState<Bed>({ id: 0, identifier: "", floor: { id: 0, identifier: "" }, user: { id: 0, fullName: "", email: "", phoneNumber: "", username: "", password: "" }, patient: { id: 0, fullName: "" } });
    
    const [viewModalForm, setViewModalForm] = useState(false);
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const Service = new AdminServices<Bed>();
    const [errors, setErrors] = useState<{ identifier?: string; floor?: Floor, user?: User, patient?: Patient }>({});
    
    const secretaryService = new AdminServices<User>();
    const nursesService = new AdminServices<User>();
    const floorService = new AdminServices<Floor>();
    const [secretary, setSecretarys] = useState<User[]>([]);
    const [nurses, setNurses] = useState<User[]>([]);
    const [floors, setfloors] = useState<Floor[]>([]);

    const isEdit = formData.id !== 0;  


    const fetchBeds = async () => {
        setLoading(true);
        try {
            const response = await Service.getAllBeds();
            const bedArray: Bed[] = response.data;
            setbeds(bedArray);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const fetchSecretarys = async () => { 
        try {
            const response = await secretaryService.getAllSecretary();
            const secretaryArray: User[] = response.data;
            setSecretarys(secretaryArray);
        } catch (error) {
            console.error(error)
        }
    };

    const fetchNurses = async () => { 
        try {
            const response = await nursesService.getAllSecretary();
            const secretaryArray: User[] = response.data;
            setNurses(secretaryArray);
        } catch (error) {
            console.error(error)
        }
    };

    const fetchFloors = async () => { 
        try {
            const response = await floorService.getAllFloor();
            const floorArray: Floor[] = response.data;
            setfloors(floorArray);
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        fetchBeds();
        fetchSecretarys();
        fetchNurses();
        fetchFloors();
    }, []);

    const validateForm = () => {
        let newErrors: { identifier?: string; } = {};
        if (!formData.identifier.trim()) newErrors.identifier = "El nombre es obligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setErrorMessage("");
        try {
            const editNewBeds = {
                identifier: formData.identifier,
                floor: {
                    id: formData.floor?.id,
                    identifier: formData.floor?.identifier,
                },
                user: {
                    id: formData.user?.id,
                    fullName: formData.user?.fullName,
                    email: formData.user?.email,
                    phoneNumber: formData.user?.phoneNumber,
                    username: formData.user?.username,
                    password: formData.user?.password,
                },
                patient: {
                    id: formData.patient?.id,
                    fullName: formData.patient?.fullName,
                },
            };
            if (formData.id === 0) {
                await Service.createBed(editNewBeds as Bed);
                setSuccessMessage("Cama creada exitosamente");
            } else {
                await Service.updateBeds(formData.id, editNewBeds as Bed);
                setSuccessMessage("Cama editada exitosamente");
            }
            setAlertMessage(false);
            toggleModalForm();
            fetchBeds();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const handleDelete = (bed: Bed) => {
        setSelectedBed(bed);
        setAlertMessage(true);
    };

    const confirmDelete = async () => {
        setErrorMessage("");
        try {
            if (selectedBed) {
                await Service.deleteBed(selectedBed.id)
                setSuccessMessage("Eliminación exitosamente");
                fetchBeds();
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

    const handleChange = (key: keyof Bed, value: string | number | Floor | User | Patient | undefined) => {
        setFormData({ ...formData, [key]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [key]: undefined }));
    };

    return (
        <div className="pt-4 w-full ">

            <div className="w-full h-15 rounded-lg bg-[#34495E] text-white mb-2 flex justify-center items-center">
                <h2 className="text-2xl font-bold text-center font-serif">Camas</h2>
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
                            <th className="px-6 py-3">Enfermera</th>
                            <th className="px-6 py-3">Piso</th>
                            <th className="px-6 py-3">Paciente</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beds.map((bed) => (
                            <tr key={bed.id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{bed.id}</td>
                                <td className="px-6 py-4">{bed.identifier}</td>
                                <td className="px-6 py-4">{bed.user?.fullName ?? "Sin asignar"}</td>
                                <td className="px-6 py-4">{bed.floor?.identifier}</td>
                                <td className="px-6 py-4">{bed.patient?.fullName ?? "Sin paciente"}</td>
                                {isSecretary() && (
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
                                            onClick={() => { setFormData(bed); toggleModalForm(); }}
                                        >
                                            <FaPen size={18} />
                                        </button>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-700 transition cursor-pointer"
                                            onClick={() => handleDelete(bed)}>
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
                    setFormData({ id: 0, identifier: "", floor: { id: 0, identifier: "" }, user: { id: 0, fullName: "", email: "", phoneNumber: "", username: "", password: "" }, patient: { id: 0, fullName: "" } });
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
                title={isEdit ? "Editar Camilla" : "Registrar Camilla"}
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

                            <div>
                                <label className="block text-sm font-medium">Enfermera asignada</label>
                                <select
                                    value={formData.user?.id || 0}
                                    onChange={(e) => {
                                        const selectedNurseId = parseInt(e.target.value);
                                        const selectedNurse = nurses.find(f => f.id === selectedNurseId);
                                        if (selectedNurse) {
                                            setFormData({
                                                ...formData,
                                                user: {
                                                    id: selectedNurse.id,
                                                    fullName: selectedNurse.fullName,
                                                    email: selectedNurse.email,
                                                    phoneNumber: selectedNurse.phoneNumber,
                                                    username: selectedNurse.username,
                                                    password: selectedNurse.password,
                                                }
                                            });
                                            setErrors(prev => ({ ...prev, floor: undefined }));
                                        }
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2"
                                >
                                    <option value="0" disabled hidden>Seleccionar enfermera</option>
                                    {nurses.map(nurse => (
                                        <option key={nurse.id} value={nurse.id}>
                                            {nurse.fullName}
                                        </option>
                                    ))}
                                </select>
                                {errors.user && <p className="text-red-500 text-sm">{errors.user.fullName ?? "Sin identificar"}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Piso asignado</label>
                                <select
                                    value={formData.floor?.id || 0}
                                    onChange={(e) => {
                                        const selectedFloorId = parseInt(e.target.value);
                                        const selectedFloor = floors.find(f => f.id === selectedFloorId);
                                        if (selectedFloor) {
                                            setFormData({
                                                ...formData,
                                                floor: {
                                                    id: selectedFloor.id,
                                                    identifier: selectedFloor.identifier,
                                                }
                                            });
                                            setErrors(prev => ({ ...prev, floor: undefined }));
                                        }
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2"
                                >
                                    <option value="0" disabled hidden>Seleccionar piso</option>
                                    {floors.map(floor => (
                                        <option key={floor.id} value={floor.id}>
                                            {floor.identifier}
                                        </option>
                                    ))}
                                </select>
                                {errors.floor && <p className="text-red-500 text-sm">{errors.floor?.identifier}</p>}
                            </div>

                        </div>
                    </>
                }
                textConfirm={isEdit ? "Confirmación actualización" : "Confirmación registro"}
                textBodyConfirm={`¿Estás seguro de que deseas ${isEdit ? "actualizar la información de la" : "registrar la nueva"} Camilla?`}
            />

            {/* ErrorMessage */}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            {/* SuccessMessage */}
            {successMessage && <SuccessMessage message={successMessage} />}

        </div>
    );


}

export default ListBeds;

