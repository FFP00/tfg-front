import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import Filters from "./Meetings/Filters";

export default function Meetings() {
    const [meetings, setMeetings] = useState([]); // Datos originales de la API
    const [filteredMeetings, setFilteredMeetings] = useState([]); // Datos que se muestran
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;

    // Obtener datos iniciales
    async function getData() {
        try {
            const res = await axios.get("http://localhost/api/meeting");
            return res.data.data;
        } catch (error) {
            console.error("Error cargando encuentros:", error);
            return [];
        }
    };

    useEffect(() => {
        async function fetchData() {
            const data = await getData();
            setMeetings(data);
            setFilteredMeetings(data);
        }
        fetchData();
    }, []);

    // Función que recibe los filtros desde el componente hijo
    const handleFilter = (filterCriteria) => {
        let result = [...meetings];

        // 1. Filtrar por Isla
        if (filterCriteria.island !== "Todas") {
            // Asumiendo que meeting.trek.island contiene el nombre de la isla
            result = result.filter(m => m.trek.island === filterCriteria.island);
        }

        // 2. Ordenar
        if (filterCriteria.order === "name") {
            result.sort((a, b) => a.trek.name.localeCompare(b.trek.name));
        } else if (filterCriteria.order === "rating") {
            result.sort((a, b) => {
                const rateA = a.countScore > 0 ? (a.totalScore / a.countScore) : 0;
                const rateB = b.countScore > 0 ? (b.totalScore / b.countScore) : 0;
                return rateB - rateA; // De mayor a menor
            });
        }

        setFilteredMeetings(result);
        setItemOffset(0); // Reiniciamos a la primera página tras filtrar
    };

    // Lógica de Paginación calculada sobre los datos filtrados
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredMeetings.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredMeetings.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredMeetings.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="bt-detail-hero bt-hero-sm">
                <div className="container">
                    <h1 className="font-serif display-5 text-white mb-1">Encuentros</h1>
                </div>
            </div>

            <div className="container py-4">
                <div className="row g-4 align-items-start">
                    
                    {/* Componente de Filtros */}
                    <Filters onApplyFilters={handleFilter} />

                    <div className="col-12 col-md-9">
                        <div className="d-flex justify-content-between align-items-baseline flex-wrap gap-2 mb-4">
                            <h1 className="font-serif h2 mb-0">
                                Catálogo de encuentros
                            </h1>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            {currentItems.map((meeting) => {
                                const dateObj = new Date(meeting.day);
                                const day = dateObj.getDate();
                                const monthYear = dateObj.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
                                const rating = meeting.countScore > 0 
                                    ? (meeting.totalScore / meeting.countScore).toFixed(1) 
                                    : "N/A";

                                return (
                                    <Link key={meeting.id} to={`/meeting/?id=${meeting.id}`} className="text-decoration-none">
                                        <div className="card border-0 shadow-sm bt-card-hover">
                                            <div className="card-body p-3">
                                                <div className="d-flex gap-3 align-items-start">
                                                    <div className="bt-date-box p-2 text-center" style={{ minWidth: '80px' }}>
                                                        <div className="bt-date-day fw-bold fs-4">{day}</div>
                                                        <div className="bt-date-month small text-uppercase">{monthYear}</div>
                                                    </div>

                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-serif text-dark fs-5 fw-bold">{meeting.trek.name}</span>
                                                            <span className={`badge ${meeting.trek.status === 'y' ? 'bg-success' : 'bg-secondary'}`}>
                                                                {meeting.trek.status === 'y' ? 'Inscripción abierta' : 'Cerrado'}
                                                            </span>
                                                        </div>
                                                        <div className="row g-2 small text-stone">
                                                            <div className="col-auto">👤 Guía: <strong>{meeting.user.name} {meeting.user.lastname}</strong></div>
                                                            <div className="col-auto">🕐 Hora: <strong>{meeting.time.substring(0, 5)}</strong></div>
                                                            <div className="col-auto">⭐ Rating: <strong>{rating}</strong></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Paginación solo si hay más de una página */}
                        {pageCount > 1 && (
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
                                    forcePage={Math.floor(itemOffset / itemsPerPage)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}