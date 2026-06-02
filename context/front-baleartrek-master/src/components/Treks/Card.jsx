import { Link } from "react-router-dom";

export default function Card({ treks }) {
    return (
        <div className="w-100"> {/* Usamos w-100 en lugar de col-md-9 */}
            <div className="d-flex justify-content-between align-items-baseline flex-wrap gap-2 mb-4">
                <h1 className="font-serif h2 mb-0">Catálogo de treks</h1>
            </div>

            <div className="tab-content">
                <div className="tab-pane fade show active" id="gridView">
                    <div className="row g-4"> {/* Aumentado el gutter a 4 para mejor espacio */}
                        {treks.map((trek) => (
                            <div className="col-sm-6 col-lg-4" key={trek.id}>
                                <Link to={`/trek/?id=${trek.id}`} className="text-decoration-none">
                                    <div className="card border-0 shadow-sm h-100 bt-card-hover">
                                        <div className="bt-trek-img bg-t1">
                                            <span className="bt-card-icon">🏔️</span>
                                            <span className="island-pill">
                                                {trek.municipality.island.name}
                                            </span>
                                        </div>

                                        <div className="card-body">
                                            <div className="bt-card-meta text-stone mb-1">
                                                {trek.municipality.name}
                                            </div>
                                            <h5 className="font-serif text-dark mb-2">{trek.name}</h5>
                                            <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-warning small">
                                                {'★'.repeat(Math.floor(parseFloat(trek.rating) / 2))}
                                                {'☆'.repeat(5 - Math.floor(parseFloat(trek.rating) / 2))}
                                            </span>
                                                <span className="text-stone small">📋 {trek.regNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Nota: He omitido la tabla por brevedad, pero asegúrate de que no tenga col-md-9 alrededor */}
            </div>
        </div>
    );
}