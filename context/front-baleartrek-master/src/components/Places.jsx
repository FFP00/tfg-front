import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";

export default function Places() {
    const [places, setPlaces] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 6; 

    console.log(places)

    async function getData() {
        try {
            // URL de tu API de Laravel
            const res = await axios.get("http://localhost/api/place");
            // Si tu API devuelve el array directamente (como el JSON que pasaste)
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            const data = await getData();
            setPlaces(data || []);
        }
        fetchData();
    }, []);

    // Lógica de Paginación
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = places.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(places.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % places.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
        <div class="bt-detail-hero bt-hero-sm"><div class="container"><h1 class="font-serif display-5 text-white mb-1">Lugares</h1></div></div>
        
            <br />
            <div className="container">
                <div class="d-flex justify-content-between align-items-baseline flex-wrap gap-2 mb-4"><h1 class="font-serif h2 mb-0">Catálogo de Lugares</h1></div>
                <div className="d-flex flex-column gap-3">
                    {/* ESTE ES EL OBJETO QUE SE REPITE CON TU ESTILO EXACTO */}
                    {currentItems.map((place) => (
                        <Link to={`/place/?id=${place.id}`} className="text-decoration-none">
                        <div key={place.id} className="bg-white shadow-sm p-3 bt-place-card">
                            <div className="d-flex align-items-start gap-3 flex-wrap">
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                        <span className="font-serif text-dark fw-semibold">
                                            {place.name}
                                        </span>
                                    </div>
                                    <div className="bt-gps text-muted small">
                                        GPS: {place.gps}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </Link>
                    ))}
                </div>

                {/* Paginación (opcional, pero recomendada por el volumen de datos) */}
                <div className="mt-5 d-flex justify-content-center">
                    <ReactPaginate
                        breakLabel={null}
                        pageRangeDisplayed={2}
                        marginPagesDisplayed={0}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        previousLabel="« Anterior"
                        nextLabel="Siguiente »"
                        containerClassName="pagination shadow-sm"
                        pageClassName="page-item"
                        pageLinkClassName="page-link text-dark"
                        previousClassName="page-item"
                        previousLinkClassName="page-link text-dark fw-bold"
                        nextClassName="page-item"
                        nextLinkClassName="page-link text-dark fw-bold"
                        activeClassName="active"
                    />
                </div>
            </div>
        </>
    );
}