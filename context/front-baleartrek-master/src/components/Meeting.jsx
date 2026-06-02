import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Meeting() {
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    console.log(meeting)


    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`http://localhost/api/meeting/${id}`);
                setMeeting(res.data.data);
            } catch (error) {
                console.error("Error cargando el meeting:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="container py-5 text-center">Cargando detalles del meeting...</div>;
    if (!meeting) return <div className="container py-5 text-center">No se encontró el meeting.</div>;

    // Cálculo de rating promedio basado en los datos del JSON
    const averageRating = meeting.countScore > 0 ? (meeting.totalScore / meeting.countScore).toFixed(1) : "N/A";

    return (
        <>
            <div className="bt-detail-hero">
                <div className="container">
                    <div className="bt-hero-tag mb-2">ID: <strong>{meeting.id}</strong></div>
                    <h1 className="font-serif display-4 text-white mb-1">{meeting.trek?.name || "Meeting"}</h1>
                    <div className="row g-2">
                        <div className="col-6 col-md-3">
                            <div className="bt-info-item p-3">
                                <div className="bt-info-label">Fecha Inicio Insc.</div>
                                <div className="bt-info-value">{meeting.appDateIni}</div>
                            </div>
                        <span className={`badge ${meeting.trek.status === 'y' ? 'bg-success' : 'bg-secondary'}`}>
                            {meeting.trek.status === 'y' ? 'Abierta' : 'Cerrado'}
                        </span>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="bt-info-item p-3">
                                <div className="bt-info-label">Fecha Encuentro</div>
                                <div className="bt-info-value">{meeting.day}</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="bt-info-item p-3">
                                <div className="bt-info-label">Hora</div>
                                <div className="bt-info-value">{meeting.time.substring(0, 5)}</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="bt-info-item p-3">
                                <div className="bt-info-label">Rating</div>
                                <div className="bt-info-value text-gold-light">{averageRating}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                <div className="row g-4">
                    <div className="col-md-8">
                        <div className="bg-white shadow-sm p-4 mb-4">
                            <h3 className="font-serif h5 mb-3">✍️ Inscripción</h3>
                            <div className="alert alert-warning border-0 mb-3">
                                ⚠️ Debes <Link to="/login" className="fw-semibold text-dark">iniciar sesión</Link> para inscribirte.
                            </div>

                        </div>

                        <h2 className="font-serif h4 mb-3">📌 Lugares de interés</h2>
                        <div className="d-flex flex-column gap-3 mb-5">
                            {meeting.trek.interesting_places?.map((place) => (
                                 <Link to={`/place/?id=${place.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <div className="bg-white shadow-sm p-3 bt-place-card" key={place.id}>
                                    <div className="d-flex align-items-start gap-3 flex-wrap">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                <span className="font-serif text-dark fw-semibold">{place.name}</span>
                                            </div>
                                            <div className="bt-gps text-muted small">GPS: {place.gps}</div>
                                        </div>
                                    </div>
                                </div>
                                </Link>

                            ))}
                        </div>

                        <h2 className="font-serif h4 mb-3">💬 Últimos comentarios</h2>
                        <div className="d-flex flex-column gap-3">
                            {meeting.comments?.map((comment) => (
                                <div className="bg-white shadow-sm p-4 border-start border-4 border-warning" key={comment.id}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <span className="fw-semibold text-uppercase">{comment.user?.name} {comment.user?.lastname}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <span className="text-warning">{'★'.repeat(comment.score)}</span>
                                            <span className="fw-semibold small">{comment.score}</span>
                                        </div>
                                    </div>
                                    <p className="text-stone mb-2">{comment.comment}</p>
                                    {/* Nota: El JSON no incluye imágenes en los comentarios, se omite el mapeo de imágenes aquí */}
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="col-md-4">
                        <div className="bg-white shadow-sm p-3">
                            <div className="font-serif text-dark mb-3">👤 Guia</div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bt-icon-box-lg bg-forest-mid text-white fw-bold fs-4 rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                    {meeting.user?.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="fw-semibold">{meeting.user?.name} {meeting.user?.lastname}</div>
                                    <div className="small text-muted">{meeting.user?.email}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}