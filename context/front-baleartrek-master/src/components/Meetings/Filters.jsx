import { useState } from "react";

export default function Filters({ onApplyFilters }) {
    // Estado interno para manejar los valores de los inputs antes de enviar
    const [criteria, setCriteria] = useState({
        order: "name",
        island: "Todas",
        zone: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCriteria(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Ejecuta la función del padre pasando los datos seleccionados
        onApplyFilters(criteria);
    };

    return (
        <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm p-3 bt-filter-sidebar">
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-gold">
                    <span className="bt-filter-title">⚙ Filtrajes</span>
                </div>

                <div className="mb-3">
                    <label className="bt-filter-label">Ordenar</label>
                    <select 
                        name="order" 
                        className="form-select form-select-sm" 
                        value={criteria.order}
                        onChange={handleChange}
                    >
                        <option value="name">Nombre A–Z</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>


                <button 
                    type="button" 
                    className="btn btn-primary w-100" 
                    onClick={handleSubmit}
                >
                    Buscar
                </button>
            </div>
        </div>
    );
}