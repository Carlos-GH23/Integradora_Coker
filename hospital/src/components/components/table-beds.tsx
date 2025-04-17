import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { FaPen } from 'react-icons/fa';
import { Bed, Floor, Patient, User } from '../models/UserModels';
import { AdminServices } from '../services/Services';
import ErrorMessage from '../custom/ErrorMessage';
import ModalForm from '../custom/ModalForm';
import SuccessMessage from '../custom/SuccessMessage';
import { isSecretary } from '../services/LoginServices';

DataTable.use(DT);
const ListBeds = () => {
    const [formData, setFormData] = useState<Bed>({ id: 0, identifier: "", floor: { id: 0, identifier: "" }, user: { id: 0, fullName: "", email: "", phoneNumber: "", username: "", password: "", floor: '' }, patient: { id: 0, fullName: "" } });
    const [errors, setErrors] = useState<{ identifier?: string; floor?: Floor, user?: User, patient?: Patient }>({});
    const [beds, setbeds] = useState<Bed[]>([]);
    const [nurses, setNurses] = useState<User[]>([]);
    const Service = new AdminServices<Bed>();

    const [viewModalForm, setViewModalForm] = useState(false);
    const isEdit = formData.id !== 0;
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchBeds = async () => {
        try {
            const response = await Service.getAllBeds();
            const bedArray: Bed[] = response.data;
            setbeds(bedArray);
            console.log(bedArray);
        } catch (error) {
            console.error(error)
        } finally {
            console.log("Que bien")
        }
    };

    const fetchNurses = async () => {
        try {
            const response = await Service.getAllNurses();
            const nursesArray: User[] = response.data;
            setNurses(nursesArray);
            console.log(nursesArray);
        } catch (error) {
            console.error(error)
        } finally {
            console.log("Que bien")
        }
    };

    useEffect(() => {
        fetchNurses();
        fetchBeds();
    }, []);

    const validateForm = () => {
        let newErrors: { identifier?: string; } = {};
        if (!formData.identifier.trim()) newErrors.identifier = "El nombre es obligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            const editNewbeds = {
                identifier: formData.identifier,
            };
            Service.updateBeds(formData.id, editNewbeds as Bed)
            setSuccessMessage("Camilla editado exitosamente");
            fetchBeds();
        } catch (error) {
            setErrorMessage(`${error}`);
        } finally {
            setAlertMessage(false);
            toggleModalForm();
        }
    };

    const toggleModalForm = () => {
        setViewModalForm(!viewModalForm);
        setErrors({});
    };

    const handleChange = (key: keyof Bed, value: string | number | Date | Floor | User | Patient | undefined) => {
        setFormData({ ...formData, [key]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [key]: undefined }));
    };

    return (
        <div className="pt-4 w-full ">

            <div className="w-full h-15 rounded-lg bg-gray-900 text-white mb-2 flex justify-center items-center">
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
                                    </td>
                                )}

                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            </div>

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
                                    value={formData.user?.id || ""}
                                    onChange={(e) => {
                                        const selectedNurse = nurses.find(n => n.id === Number(e.target.value));
                                        handleChange("user", selectedNurse);
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                                >
                                    <option value="" disabled hidden>Seleccionar</option>
                                    {nurses.map(nurse => (
                                        <option key={nurse.id} value={nurse.id}>
                                            {nurse.fullName}
                                        </option>
                                    ))}
                                </select>
                                {errors.user && <p className="text-red-500 text-sm">{errors.user?.fullName}</p>}
                            </div>
                        </div>
                        <button onClick={() => { handleSubmit() }}
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 w-full text-white font-bold py-2 px-4 rounded">Confirmar</button>
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

