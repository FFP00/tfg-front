export default function Contact(){
    return(
        <>
<div className="bt-detail-hero bt-hero-sm">
  <div className="container">
    <h1 className="font-serif display-5 text-white mb-1">Contactanos</h1>
    <p className="text-muted-light mb-0">Estamos aquí para ayudarte con cualquier duda</p>
  </div>
</div>

<div className="container container-narrow py-5">
  <div className="row g-4">
    <div className="col-lg-7">
      <div className="bg-white shadow-sm p-4">
        <h2 className="font-serif h5 mb-4">Envíanos un mensaje</h2>
        <form>
            <div className="row g-3 mb-3">
                <div className="col-sm-6">
                <label className="bt-filter-label" htmlFor="cNombre">Nombre</label>
                <input type="text" className="form-control" id="cNombre" placeholder="Juan" />
                </div>
                <div className="col-sm-6">
                <label className="bt-filter-label" htmlFor="cApellido">Apellido</label>
                <input type="text" className="form-control" id="cApellido" placeholder="García" />
                </div>
            </div>

            <div className="mb-3">
                <label className="bt-filter-label" htmlFor="cEmail">Correo electrónico</label>
                <input type="email" className="form-control" id="cEmail" placeholder="correo@ejemplo.com" />
            </div>

            <div className="mb-3">
                <label className="bt-filter-label" htmlFor="cAsunto">Asunto</label>
                <select className="form-select" id="cAsunto" defaultValue="Duda sobre inscripción">
                <option>Duda sobre inscripción</option>
                <option>Problema técnico</option>
                <option>Sugerencia</option>
                <option>Información general</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="bt-filter-label" htmlFor="cMensaje">Mensaje</label>
                <textarea className="form-control" id="cMensaje" rows="5" placeholder="Tu mensaje..."></textarea>
            </div>

            <button type="button" className="btn btn-dark fw-semibold w-100">
                Enviar mensaje
            </button>
            </form>
      </div>
    </div>
    <div className="col-lg-5">
      <div className="d-flex flex-column gap-3">
        <div className="bt-contact-block p-4 text-white"><div className="fs-4 mb-2 text-gold-light">📞</div><div className="font-serif mb-1">Teléfono</div><div className="text-muted-light small">+34 971 123 456</div></div>
        <div className="bt-contact-block p-4 text-white"><div className="fs-4 mb-2 text-gold-light">✉️</div><div className="font-serif mb-1">Email</div><div className="text-muted-light small">info@baleartrek.com</div></div>
        <div className="bt-contact-block p-4 text-white"><div className="fs-4 mb-2 text-gold-light">🕐</div><div className="font-serif mb-1">Horario</div><div className="text-muted-light small">Lun–Vie: 09:00 – 18:00<br />Sáb: 10:00 – 14:00</div></div>
      </div>
    </div>
  </div>
</div>

        </>
    )
}