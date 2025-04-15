
function Tablepacients() {
    const data = [
        { id: 1, nombre: 'Juan Perez', correo: 'juan@email.com', telefono: '123-456-7890', piso: 3, cama: 12 },
        { id: 2, nombre: 'Maria Lopez', correo: 'maria@email.com', telefono: '987-654-3210', piso: 2, cama: 5 },
        { id: 3, nombre: 'Carlos Diaz', correo: 'carlos@email.com', telefono: '456-789-0123', piso: 1, cama: 8 },
    ];

    return (
        <div className="w-full">
            <div className="w-full bg-[#0077B6] rounded-t-lg text-center mb-4 h-12 ">
                <h1 className="text-xl text-white pt-2">Lista de Pacientes asignados</h1>
            </div>

            <div className="w-full text-center mb-4 h-10 grid md:grid-cols-6 md:gap-4 grid-cols-3 gap-2">
                <input 
                    type="text"
                    placeholder="Buscar paciente"
                    className="w-full pl-4 sm:col-span-5 grid-span-2 h-10 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:bg-white transition-all duration-300"
                />
                <button className="bg-[#0077B6] px-2 hover:bg-[#005f8e] h-10 col-span-1 text-white font-semibold rounded-xl shadow-md transition-all duration-300">
                    Añadir Paciente
                </button>
            </div>

            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-[#99CCFF] text-white text-center">
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Nombre</th>
                        <th className="px-4 py-2 text-left">Correo</th>
                        <th className="px-4 py-2 text-left">Teléfono</th>
                        <th className="px-4 py-2 text-left">Piso</th>
                        <th className="px-4 py-2 text-left">Cama</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="border-b">
                            <td className="px-4 py-2">{row.id}</td>
                            <td className="px-4 py-2">{row.nombre}</td>
                            <td className="px-4 py-2">{row.correo}</td>
                            <td className="px-4 py-2">{row.telefono}</td>
                            <td className="px-4 py-2">{row.piso}</td>
                            <td className="px-4 py-2">{row.cama}</td>
                            <td className="px-4 py-2 flex space-x-2">
                                {/* Botón Editar */}
                                <button
                                    className="px-4 py-2 bg-[#99CCFF] text-white rounded hover:bg-[#0077B6]">
                                    Editar
                                </button>
                                {/* Botón Dar de alta (puedes agregar más funcionalidades aquí) */}
                                <button
                                    onClick={() => console.log('Dar de alta el registro con ID:', row.id)}
                                    className="px-4 py-2 bg-[#52B788] text-white rounded hover:bg-green-600">
                                    Dar de alta
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export default Tablepacients;
