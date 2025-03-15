
function Nurses() {
    return (
        <div className="container mt-2">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th>Edad</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{ 1 }</td>
                        <td>{ "Sebastián Quintero" }</td>
                        <td>{ "sebastian.quinteromtz@gmail.com" }</td>
                        <td>{ "7775189232" }</td>
                        <td>{ 22 }</td>
                        <td className="">
                            <button className="btn btn-primary mx-1">Editar</button>
                            <button className="btn btn-danger">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Nurses;