import { useEffect, useState } from "react";
import { Bed, Patient } from "../models/UserModels";
import { AdminServices } from "../services/Services";
import { getUser } from "../services/LoginServices";
import ErrorMessage from "../custom/ErrorMessage";
import SuccessMessage from "../custom/SuccessMessage";
import AlertMessage from "../custom/AlertMessage";

function HomeNurses() {
    const [loading, setLoading] = useState(true);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const bedService = new AdminServices<Bed>();
    const patientService = new AdminServices<Patient>();
    const [alertMessage, setAlertMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bedResponse, patientResponse] = await Promise.all([
                bedService.getAllBeds(),
                patientService.getAllPatients()
            ]);
            setBeds(bedResponse.data);
            setPatients(patientResponse.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const nurseName = getUser()?.name ?? "Sin nombre";

    // 🔍 Filtrar pacientes cuya cama:
    // - esté ocupada
    // - tenga una enfermera asignada
    // - esa enfermera coincida con la actual
    // - y coincida con la cama asignada en la cama
    const filteredPatients = patients.filter((patient) => {
        const bed = beds.find((b) => b.id === patient.bed.id);
        return (
            bed &&
            bed.occupied &&
            bed.patient &&
            bed.user &&
            bed.user.fullName === nurseName &&
            bed.patient.id === patient.id
        );
    });

    const handleDelete = (patient: Patient) => {
        setSelectedPatient(patient);
        setAlertMessage(true);
    };

    const confirmDelete = async () => {
        setErrorMessage("");
        try {
            if (selectedPatient) {
                await bedService.unassignBedPatient(selectedPatient.id);
                await patientService.deletePatient(selectedPatient.id)
                setSuccessMessage("Paciente curado");
                fetchData();
            }
        } catch (error) {
            setErrorMessage(`${error}`);
        } finally {
            setAlertMessage(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    return (
        <div className="h-[20vh]">
            <div className="w-full bg-[#0077B6] rounded-lg text-center mb-4 h-12 ">
                <h1 className="text-xl text-white pt-2">Camas asignadas</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {filteredPatients.map((patient) => {
                    const bed = beds.find((b) => b.id === patient.bed.id)!;
                    return (
                        <div key={patient.id} className="rounded-xl shadow-lg bg-white overflow-hidden min-h-[120px] transition-transform transform hover:scale-105">
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Cama: {bed.identifier}</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <p><span className="font-semibold text-gray-800">Nombre:</span> {patient.fullName}</p>
                                    <p><span className="font-semibold text-gray-800">Correo:</span> {bed.user?.email}</p>
                                    <p><span className="font-semibold text-gray-800">Teléfono:</span> {bed.user?.phoneNumber}</p>
                                    <p><span className="font-semibold text-gray-800">Piso:</span> {bed.floor.identifier}</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="bg-[#52B788] hover:bg-[#52B788] text-white font-bold py-2 px-4 rounded-lg w-2/4 text-sm transition"
                                        onClick={() => handleDelete(patient)}>
                                        Dar de alta
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

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

export default HomeNurses;
