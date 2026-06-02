import { Link } from "react-router-dom"

export default function SimpleTreks({treks}){
    return(
        <section className="py-5 bg-cream">
        <div className="container">
            <div className="mb-5">
            <h2 className="font-serif display-5">Treks <em className="fst-italic text-gold">destacados</em></h2>
            </div>

            <div className="row g-4">

            {treks.map( (trek) =>
                
                    <div className="col-sm-6 col-lg-4" key={trek.id}>
                        <Link to={`/trek/?id=${trek.id}`} className="text-decoration-none">
                            <div className="card border-0 shadow-sm h-100 bt-card-hover">
                                {/* Imagen/Header de la card */}
                                <div className="bt-trek-img bg-t1">
                                    <span className="bt-card-icon">🏔️</span>
                                    <span className="island-pill">
                                        {trek.municipality.island.name}
                                    </span>
                                    <span className={`badge ${trek.status === 'y' ? 'bg-success' : 'bg-secondary'} status-pill`}>
                                        {trek.status === 'y' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                <div className="card-body">
                                    {/* Meta info: Usamos el nombre del municipio */}
                                    <div className="bt-card-meta text-stone mb-1">
                                        {trek.municipality.name}
                                    </div>

                                    {/* Nombre del Trek */}
                                    <h5 className="font-serif text-dark mb-2">{trek.name}</h5>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            {/* Estrellas visuales basadas en el rating (ejemplo simplificado) */}
                                            <span className="text-warning small">
                                                {'★'.repeat(Math.floor(parseFloat(trek.rating) / 2))}
                                                {'☆'.repeat(5 - Math.floor(parseFloat(trek.rating) / 2))}
                                            </span>
                                        </div>
                                        
                                        {/* Número de Registro */}
                                        <span className="text-stone small">📋 {trek.regNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                
            )}

            </div>
            <div className="text-center mt-5">

                <Link 
                    to="/treks"
                    className="btn btn-warning fw-semibold px-4 text-uppercase"
                >
                    Todos los Treks
                </Link>
            
            </div>
        </div>
        </section>
    )
}