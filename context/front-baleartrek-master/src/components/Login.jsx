import { Link } from "react-router-dom"

export default function Login(){
    return(
        
        <div className="bt-auth-wrap d-flex align-items-center justify-content-center p-3">
        <div className="bt-auth-card">
            <div className="text-center mb-4">
            <a href="index.html" className="text-decoration-none d-inline-block mb-3">
                <span className="font-serif fs-2 text-dark">Balear<span className="text-gold">Trek</span></span>
            </a>
            <h2 className="font-serif text-dark">Iniciar sesión</h2>
            </div>

            <div className="bg-white shadow-sm p-4">
            <form action="#" method="post">
                <div className="mb-3">
                <label className="bt-filter-label" for="email">Correo electrónico</label>
                <input type="email" className="form-control" id="email" placeholder="correo@ejemplo.com" />
                </div>
                <div className="mb-2">
                <label className="bt-filter-label" for="password">Contraseña</label>
                <input type="password" className="form-control" id="password" placeholder="••••••••" />
                </div>
                <div className="text-end mb-4">
                        <Link 
                            to="/contact" 
                            className="text-success small text-decoration-none"
                        >
                            ¿Olvidé mi contraseña?
                        </Link>    
                </div>
                <button type="submit" className="btn btn-dark fw-semibold w-100">Entrar</button>
            </form>
            </div>

            <p className="text-center text-stone small mt-3">
            ¿No tienes cuenta?
                <Link 
                    to="/register" 
                    className="text-success text-decoration-none fw-semibold"
                >
                    Registrarse
                </Link>    
            </p>
        </div>
        </div>
       
    )
}