function menuTop() {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="text-xl font-bold">MiLogo</div>                  
                <div className="hidden md:flex space-x-6">
                    <a href="#" className="hover:text-gray-300">Inicio</a>
                    <a href="#" className="hover:text-gray-300">Productos</a>
                    <a href="#" className="hover:text-gray-300">Servicios</a>
                    <a href="#" className="hover:text-gray-300">Contacto</a>
                </div>
        </nav>
    );
}

export default menuTop;