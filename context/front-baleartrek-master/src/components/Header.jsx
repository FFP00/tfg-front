import { NavLink } from "react-router-dom";

export default function Header(){
    return(
        <nav className="navbar navbar-expand-lg navbar-bt sticky-top">
            <div className="container">
                
                <NavLink 
                    to="/" 
                    className="navbar-brand fw-bold"
                >
                    Balear<span className="text-gold-light">Trek</span>
                </NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="nav">
                <ul className="navbar-nav mx-auto gap-1">
                    
                    <NavLink 
                        to="/meetings" 
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Encuentros
                    </NavLink>

                    <NavLink 
                        to="/treks" 
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Excursiones
                    </NavLink>

                    <NavLink 
                        to="/places" 
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Lugares
                    </NavLink>

                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Contacto
                    </NavLink>

                    <NavLink 
                        to="/information" 
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Informacion
                    </NavLink>

                </ul>
                <div className="d-flex gap-2 align-items-center">

                    <NavLink 
                        to="/login" 
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Iniciar sesión
                    </NavLink>
                    
                </div>
                </div>
            </div>
        </nav>
    )
}