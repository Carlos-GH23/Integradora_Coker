
function HomeNurses() {

    const data = [
        { id: 1, nombre: 'Juan Perez', correo: 'juan@email.com', telefono: '123-456-7890', piso: 3, cama: 12 },
        { id: 2, nombre: 'Maria Lopez', correo: 'maria@email.com', telefono: '987-654-3210', piso: 2, cama: 5 },
        { id: 3, nombre: 'Carlos Diaz', correo: 'carlos@email.com', telefono: '456-789-0123', piso: 1, cama: 8 },
    ];

    return (
        <div className="h-[20vh]">
            <div className="w-full bg-[#0077B6] rounded-lg text-center mb-4 h-12 ">
                <h1 className="text-xl text-white pt-2">Camas asignados</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {data.map((paciente) => (
                    <div key={paciente.id} className="rounded-xl shadow-lg bg-white overflow-hidden min-h-[120px] transition-transform transform hover:scale-105">

                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Cama: {paciente.cama}</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <p><span className="font-semibold text-gray-800">Nombre:</span> {paciente.nombre}</p>
                                <p><span className="font-semibold text-gray-800">Correo:</span> {paciente.correo}</p>
                                <p><span className="font-semibold text-gray-800">Telefono:</span> {paciente.telefono}</p>
                                <p><span className="font-semibold text-gray-800">Piso:</span> {paciente.piso}</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button className="bg-[#52B788] hover:bg-[#52B788] text-white font-bold py-2 px-4 rounded-lg w-2/4 text-sm transition">
                                    Dar de alta
                                </button>
                                <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg w-2/4 text-sm transition">
                                    Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomeNurses;
