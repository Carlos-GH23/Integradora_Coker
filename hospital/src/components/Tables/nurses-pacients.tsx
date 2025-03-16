
function Tablepacients() {
    const data = [
        { id: 1, nombre: 'Juan Perez', correo: 'juan@email.com', telefono: '123-456-7890', piso: 3, cama: 12 },
        { id: 2, nombre: 'Maria Lopez', correo: 'maria@email.com', telefono: '987-654-3210', piso: 2, cama: 5 },
        { id: 3, nombre: 'Carlos Diaz', correo: 'carlos@email.com', telefono: '456-789-0123', piso: 1, cama: 8 },
    ];

    return (
        <div className="pt-4 w-full">
            <div className="flex justify-end mb-4">
                {/* Botón para agregar nuevo registro */}
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Dar de alta
                </button>
            </div>

            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100">
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
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                    Editar
                                </button>
                                {/* Botón Dar de alta (puedes agregar más funcionalidades aquí) */}
                                <button
                                    onClick={() => console.log('Dar de alta el registro con ID:', row.id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
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
