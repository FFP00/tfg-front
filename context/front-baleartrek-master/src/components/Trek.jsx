import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Trek() {
    const [trek, setTrek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`http://localhost/api/trek/find/${id}`);
                setTrek(res.data.data);
            } catch (error) {
                console.error("Error cargando el trek:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="container py-5 text-center">Cargando detalles del trek...</div>;
    if (!trek) return <div className="container py-5 text-center">No se encontró el trek.</div>;

    // Calculamos los comentarios filtrados aquí, una vez sabemos que trek existe
    const activeComments = trek.meetings?.flatMap(m => m.comments).filter(c => c.status === "y") || [];

    return (
        <>
            {/* HERO SECTION */}
            <div className="bt-detail-hero">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                        <div>
                            <div className="bt-hero-tag mb-2">
                                <code className="text-gold-light">regNumber:</code> {trek.regNumber}
                            </div>
                            <h1 className="font-serif display-4 text-white mb-1">{trek.name}</h1>
                            <p className="text-muted-light mb-0">
                                {trek.municipality?.island?.name} · {trek.municipality?.name}
                            </p>
                        </div>
                        <div className="text-end align-self-center">
                            <div className="text-warning fs-5">
                                {'★'.repeat(Math.min(5, Math.max(0, Math.floor(parseFloat(trek.rating) || 0))))}
                                {'☆'.repeat(Math.min(5, Math.max(0, 5 - Math.floor(parseFloat(trek.rating) || 0))))}
                            </div>
                            <span className={`badge ${trek.status === 'y' ? 'bg-success' : 'bg-secondary'}`}>
                                {trek.status === 'y' ? 'Abierta' : 'Cerrado'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">                
                <div className="row g-5">
                    <div className="col-md">
                        
                        {/* 📅 ENCUENTROS */}
                        <h2 className="font-serif h4 mb-3">📅 Encuentros disponibles</h2>
                        <div className="d-flex flex-column gap-3 mb-5">
                            {trek.meetings?.map((meeting, index) => {
                                // Calculamos cuántos comentarios válidos tiene este meeting específico
                                const meetingCommentsCount = meeting.comments?.filter(c => c.status === "y").length || 0;
                                
                                return (
                                    <div className="card border-0 shadow-sm" key={meeting.id}>
                                        <Link to={`/meeting/?id=${meeting.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <div className="card-body p-3">
                                                <div className="d-flex gap-3 align-items-start">
                                                    <div className="bt-date-box p-2 text-center">
                                                        <div className="bt-date-day">{meeting.day.split('-')[2]}</div>
                                                        <div className="bt-date-month">{meeting.day.split('-')[1]} / {meeting.day.split('-')[0].slice(-2)}</div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-semibold mb-2">Encuentro #{index + 1}</div>
                                                        <div className="row g-2 small text-stone">
                                                            <div className="col-auto">🕐 <strong>Hora:</strong> {meeting.time}</div>
                                                            <div className="col-auto">💬 <strong>Comentarios:</strong> {meetingCommentsCount}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 💬 SECCIÓN DE COMENTARIOS FILTRADOS */}
                        <h2 className="font-serif h4 mb-3">💬 Comentarios aprobados ({activeComments.length})</h2>
                        <div className="d-flex flex-column gap-3">
                            {activeComments.length > 0 ? (
                                activeComments.map((c) => (
                                    <div className="bg-white shadow-sm p-4 border-start border-4 border-warning" key={c.id}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="fw-semibold text-uppercase">{c.user || 'Anónimo'}</span>
                                            <div className="d-flex align-items-center gap-1">
                                                <span className="text-warning">{'★'.repeat(c.score)}</span>
                                                <span className="fw-semibold small">{c.score}</span>
                                            </div>
                                        </div>
                                        <p className="text-stone mb-2">{c.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No hay comentarios aprobados para este trek.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}