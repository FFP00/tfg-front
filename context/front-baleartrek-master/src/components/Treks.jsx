import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import Card from "./Treks/Card";

export default function Treks() {
    const [treks, setTreks] = useState([]);
    const [filteredTreks, setFilteredTreks] = useState(null);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 6;

    async function getData() {
        try {
            const res = await axios.get("http://localhost/api/trek");
            return res.data.data;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const data = await getData();
            setTreks(data || []);
        }
        fetchData();
    }, []);

    const sourceData = filteredTreks ? filteredTreks : treks;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = sourceData.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(sourceData.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % sourceData.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setItemOffset(0);
    }, [filteredTreks]);

    return (
        <>
            <div className="bt-detail-hero bt-hero-sm">
                <div className="container">
                    <h1 className="font-serif display-5 text-white mb-1">Excursiones</h1>
                </div>
            </div>

            <div className="container py-4">
                <div className="row">
                    {/* Cambiado a col-12 para ocupar todo el ancho */}
                    <div className="col-12">
                        <Card treks={currentItems} />

                        {/* Paginación centrada */}
                        {sourceData.length > itemsPerPage && (
                            <nav aria-label="Navegación" className="mt-5 d-flex justify-content-center">
                                <ReactPaginate
                                    breakLabel="..."
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={1}
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
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}