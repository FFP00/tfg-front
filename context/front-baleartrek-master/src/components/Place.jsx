import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Place() {
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        async function fetchData() {
            try {
                // Ajusta la URL a tu endpoint de Laravel para un solo lugar
                const res = await axios.get(`http://localhost/api/place/${id}`);
                // Según tu JSON, los datos vendrían en res.data o res.data.data
                setPlace(res.data); 
            } catch (error) {
                console.error("Error cargando el lugar:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="container py-5 text-center">Cargando detalles del lugar...</div>;
    if (!place) return <div className="container py-5 text-center">No se encontró el lugar.</div>;

    // Lógica para parsear el GPS "39.7928, 2.6948"
    const gpsCoords = place.gps ? place.gps.split(",") : [0, 0];
    const lat = gpsCoords[0]?.trim();
    const lng = gpsCoords[1]?.trim();

    return (
        <>
            {/* HERO SECTION DINÁMICO */}
            <div className="bt-detail-hero">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                        <div>
                            <div className="bt-hero-tag mb-2"><code className="text-gold-light">ID:</code>{place.id}</div>

                            <h1 className="font-serif display-4 text-white mb-1 mt-1">{place.name}</h1>
                        </div>
                    </div>

                    {/* Fila de info técnica */}
                    <div className="row g-2 mt-2">
                        <div className="col-6 col-md-4">
                            <div className="bt-info-item p-3">
                                <div className="bt-info-label">place.name</div>
                                <div className="bt-info-value">{place.name}</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4">
                            <div className="bt-info-item p-3">
                                <div className="bt-info-label">place.gps</div>
                                <div className="bt-info-value bt-gps-value">{place.gps}</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4">
                            <div className="bt-info-item p-3">
                                <div className="bt-info-label">Tipo</div>
                                <div className="bt-info-value">{place.place_type?.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="bg-white shadow-sm p-4 mb-4">                            
                            {/* MAPA: Usando un Embed de Google Maps (el método más fácil sin configurar SDK complejo) */}
                            <div className="bt-map mb-3" style={{ height: '400px', overflow: 'hidden', borderRadius: '8px' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}