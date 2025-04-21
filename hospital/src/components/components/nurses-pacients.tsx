import { useEffect, useState } from "react";
import { Bed, Patient, User } from "../models/UserModels";
import { AdminServices } from "../services/Services";
import ModalForm from "../custom/ModalForm";
import AlertMessage from "../custom/AlertMessage";
import ErrorMessage from "../custom/ErrorMessage";
import SuccessMessage from "../custom/SuccessMessage";
import { getUser, isNurse } from "../services/LoginServices";

function Tablepacients() {
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [formData, setFormData] = useState<Patient>({ id: 0, fullName: "", bed: {id: 0, identifier: "", floor: { id: 0, identifier: "", bednumber: 0, occupied: 0 }, occupied: false } });

    const [viewModalForm, setViewModalForm] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const Service = new AdminServices<Patient>();
    const bedService = new AdminServices<Bed>();
    const [beds, setBeds] = useState<Bed[]>([]);
    const [errors, setErrors] = useState<{ fullName?: string; bed?: string }>({});
    const isEdit = formData.id !== 0;
    const [originalBed, setOriginalBed] = useState<Bed | null>(null);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await Service.getAllPatients();
            const patientArray: Patient[] = response.data;
            setPatients(patientArray);
        } catch (error) {
            console.error(error);
            setErrorMessage("Hubo un problema al cargar los pisos. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
            fetchBeds();
        }
    };

    const fetchBeds = async () => {
        try {
            const response = await bedService.getAllBeds();
            const bedsArray: Bed[] = response.data;
            setBeds(bedsArray);
        } catch (error) {
            console.error("Hubo un problema al cargar los pisos. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const validateForm = () => {
        let newErrors: { fullName?: string, bed?: string} = {};
        const regex = /^[a-zA-Z0-9\s]+$/;
    
        if (!formData.fullName.trim()) {
            newErrors.fullName = "El nombre es obligatorio";
        } else if (!regex.test(formData.fullName)) {
            newErrors.fullName = "El nombre no debe contener caracteres especiales";
        }
        if (!formData.bed || formData.bed.id === 0) {
            newErrors.bed = "La cama es obligatorio";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setErrorMessage("");
    
        try {
            const editNewPatient = {
                fullName: formData.fullName,
                bed: formData.bed,
            };
    
            if (!isEdit) {
                const createdResponse = await Service.createPatient(editNewPatient as Patient);
                await bedService.assignBedPatient({
                    bedId: formData.bed.id,
                    patientId: createdResponse.id,
                });
    
                setSuccessMessage("Paciente creado exitosamente y cama asignada.");
            } else {
                if (originalBed && originalBed.id !== formData.bed.id) {
                    await bedService.unassignBedPatient(formData.id);
    
                    await bedService.assignBedPatient({
                        bedId: formData.bed.id,
                        patientId: formData.id,
                    });
                }
                await Service.updatePatient(formData.id, editNewPatient as Patient);
                setSuccessMessage("Paciente actualizado exitosamente.");
            }
    
            setAlertMessage(false);
            toggleModalForm();
            fetchPatients();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };
    

    const handleDelete = (patient: Patient) => {
        setSelectedPatient(patient);
        setAlertMessage(true);
    };

    const confirmDelete = async () => {
        setErrorMessage("");
        try {
            if (selectedPatient) {
                await bedService.unassignBedPatient(selectedPatient.id);
                await Service.deletePatient(selectedPatient.id)
                setSuccessMessage("Paciente curado");
                fetchPatients();
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

    const handleChange = (key: keyof Patient, value: string) => {
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
        <div className="w-full">
            <div className="w-full bg-[#34495E] rounded-t-lg text-center mb-4 h-12 ">
                <h1 className="text-xl text-white pt-2">Pacientes Asignados</h1>
            </div>

            <div className="w-full text-center mb-4 h-10 grid md:grid-cols-6 md:gap-4 grid-cols-3 gap-2">
                <input 
                    type="text"
                    placeholder="Buscar paciente"
                    className="w-full pl-4 sm:col-span-5 grid-span-2 h-10 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:bg-white transition-all duration-300"
                />
                <button className="bg-[#0077B6] px-2 hover:bg-[#005f8e] h-10 col-span-1 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
                    onClick={() => {
                        setFormData({ id: 0, fullName: "", bed: {id: 0, identifier: "", floor: { id: 0, identifier: "", bednumber: 0, occupied: 0 }, occupied: false } });
                        toggleModalForm();
                    }}
                    >
                    Añadir Paciente
                </button>
            </div>

            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-[#99CCFF] text-white text-center">
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Nombre Completo</th>
                        <th className="px-4 py-2 text-left">Cama</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((row) => (
                        <tr key={row.id} className="border-b">
                            <td className="px-4 py-2">{row.id}</td>
                            <td className="px-4 py-2">{row.fullName}</td>
                            <td className="px-4 py-2">{row.bed.identifier}</td>
                            <td className="px-4 py-2 flex space-x-2">
                                {/* Botón Editar */}
                                <button
                                    className="px-4 py-2 bg-[#99CCFF] text-white rounded hover:bg-[#0077B6]"
                                    onClick={() => {
                                        setFormData(row);
                                        setOriginalBed(row.bed);
                                        toggleModalForm();
                                    }}>
                                    Editar
                                </button>
                                {/* Botón Dar de alta (puedes agregar más funcionalidades aquí) */}
                                <button
                                    className="px-4 py-2 bg-[#52B788] text-white rounded hover:bg-green-600"
                                    onClick={() => handleDelete(row)}>
                                    Dar de alta
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalForm
                isOpen={viewModalForm}
                onClose={toggleModalForm}
                onSubmit={handleSubmit}
                validateForm={validateForm}
                title={isEdit ? "Editar Paciente" : "Registrar Paciente"}
                textActionOk={isEdit ? "Actualizar" : "Guardar"}
                isSave={true}
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
                        <div className="mt-4">
                            <label className="block text-sm font-medium">Cama</label>
                            <select
                                value={formData.bed.id}
                                onChange={(e) => {
                                    const selectedBedId = parseInt(e.target.value);
                                    const selectedBed = beds.find(f => f.id === selectedBedId);
                                    if (selectedBed) {
                                        setFormData({
                                            ...formData,
                                            bed: selectedBed,
                                        });
                                        setErrors(prev => ({ ...prev, floor: undefined }));
                                    }
                                }}className="w-full p-3 border border-gray-300 rounded-lg"
                            >
                                <option value="">Asignar cama</option>
                                {beds
                                    .filter((bed) => {
                                        console.log("isNurse(): ", isNurse());
                                        // Mostrar su propia cama en edición, siempre
                                        if (bed.id === formData.bed.id) return true;
                                    
                                        // Si no es secretaria, mostrar todas las camas no ocupadas
                                        if (!isNurse()) return !bed.occupied;
                                    
                                        // Si es secretaria, filtrar camas por nombre del paciente (si tiene uno)
                                        if (bed.user && bed.user.fullName.toLowerCase().includes((getUser()?.name ?? "").toLowerCase())) {
                                            return true;
                                        }
                                    
                                        return false;
                                    })
                                    .map((bed) => (
                                        <option key={bed.id} value={bed.id}>
                                            {bed.identifier}
                                        </option>
                                ))}
                            </select>
                            {errors.bed && <p className="text-red-500 text-sm">{errors.bed}</p>}
                        </div>
                    </>
                }
                textConfirm={isEdit ? "Confirmación actualización" : "Confirmación registro"}
                textBodyConfirm={`¿Estás seguro de que deseas ${isEdit ? "actualizar la información del" : "registrar el nuevo"} piso?`}
            />

            {alertMessage && selectedPatient && (
                <AlertMessage
                    title="Dar de alta"
                    body={`¿Estás seguro de que deseas dar de alta al paciente ${selectedPatient.fullName}?`}
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


export default Tablepacients;
