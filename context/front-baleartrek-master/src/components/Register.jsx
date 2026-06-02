import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    
    // Estado con las claves exactas que el modelo User de Laravel espera en el $fillable
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        dni: "",
        phone: "",
        password: "",
        password_confirmation: "",
        role_id: 2, // Por defecto 'user' o el ID que corresponda a un usuario normal
        status: "y"  // Tu modelo filtra por status 'y' en el index
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Asegúrate de que la URL coincida con tu api.php (normalmente /api/register)
            const response = await fetch("http://localhost/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Cuenta creada correctamente!");
                navigate("/login");
            } else {
                // Manejo de errores de validación de Laravel (Error 422)
                const errorMsg = data.errors 
                    ? Object.values(data.errors).flat().join("\n") 
                    : data.message || "Error desconocido";
                alert("Error al registrar:\n" + errorMsg);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <div className="bt-auth-wrap d-flex align-items-center justify-content-center p-3 py-5">
            <div className="bt-auth-card-wide" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="text-center mb-4">
                    <span className="font-serif fs-2 text-dark">Balear<span className="text-gold" style={{color: '#d4af37'}}>Trek</span></span>
                    <h2 className="font-serif text-dark">Crear cuenta</h2>
                </div>
                
                <div className="bg-white shadow-sm p-4 rounded">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-3">
                            <div className="col-sm-6">
                                <label className="form-label fw-bold" htmlFor="name">Nombre</label>
                                <input type="text" className="form-control" id="name" value={formData.name} required onChange={handleChange} placeholder="Tu nombre" />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label fw-bold" htmlFor="lastname">Apellidos</label>
                                <input type="text" className="form-control" id="lastname" value={formData.lastname} required onChange={handleChange} placeholder="Tus apellidos" />
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-sm-6">
                                <label className="form-label fw-bold" htmlFor="dni">DNI / NIE</label>
                                <input type="text" className="form-control" id="dni" value={formData.dni} required onChange={handleChange} placeholder="12345678X" />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label fw-bold" htmlFor="phone">Teléfono</label>
                                <input type="tel" className="form-control" id="phone" value={formData.phone} required onChange={handleChange} placeholder="600000000" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold" htmlFor="email">Correo electrónico</label>
                            <input type="email" className="form-control" id="email" value={formData.email} required onChange={handleChange} placeholder="ejemplo@correo.com" />
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-sm-6">
                                <label className="form-label fw-bold" htmlFor="password">Contraseña</label>
                                <input type="password" className="form-control" id="password" value={formData.password} required onChange={handleChange} />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label fw-bold" htmlFor="password_confirmation">Confirmar</label>
                                <input type="password" className="form-control" id="password_confirmation" value={formData.password_confirmation} required onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-dark fw-semibold w-100 py-2">
                            Crear cuenta →
                        </button>

                        <div className="text-center mt-3">
                            <p className="small">¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none fw-bold">Inicia sesión</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}