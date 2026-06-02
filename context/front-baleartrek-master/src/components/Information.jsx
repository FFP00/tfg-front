export default function Information(){
    return(
        <>

<div className="bt-detail-hero bt-hero-sm">
  <div className="container">
    <h1 className="font-serif display-5 text-white mb-1">Informacion</h1>
    <p className="text-muted-light mb-0">Normas de inscripción, sistema de puntuación y preguntas frecuentes</p>
  </div>
</div>

<div className="container container-narrower py-5">

  <div className="bg-white shadow-sm p-4 mb-4">
    <h2 className="font-serif h4 mb-4">📋 Normas de inscripción</h2>
    <div className="row g-3">
      <div className="col-sm-6"><div className="bg-cream p-3 h-100 border-top border-4 border-warning"><div className="fs-4 mb-2">📅</div><div className="font-serif text-dark mb-1">Apertura</div><p className="text-stone small mb-0">Las inscripciones se abren <strong>1 mes antes</strong> de la fecha del encuentro.</p></div></div>
      <div className="col-sm-6"><div className="bg-cream p-3 h-100 border-top border-4 border-danger"><div className="fs-4 mb-2">⏰</div><div className="font-serif text-dark mb-1">Cierre</div><p className="text-stone small mb-0">Las inscripciones se cierran <strong>1 semana antes</strong> del encuentro.</p></div></div>
      <div className="col-sm-6"><div className="bg-cream p-3 h-100 border-top border-4 border-success"><div className="fs-4 mb-2">🔄</div><div className="font-serif text-dark mb-1">Cancelación</div><p className="text-stone small mb-0">Puedes cancelar tu inscripción hasta <strong>1 semana antes</strong> de la fecha del encuentro.</p></div></div>
      <div className="col-sm-6"><div className="bg-cream p-3 h-100 border-top border-4 border-secondary"><div className="fs-4 mb-2">🚫</div><div className="font-serif text-dark mb-1">Doble inscripción</div><p className="text-stone small mb-0">No se permite inscribirse más de una vez en el mismo encuentro.</p></div></div>
    </div>
  </div>

  <div className="bg-white shadow-sm p-4 mb-4">
    <h2 className="font-serif h4 mb-4">⭐ Sistema de puntuación (0–5)</h2>
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center gap-3 bg-cream p-3"><span className="bt-score-inline text-warning">★★★★★</span><div><strong>5 — Excelente.</strong> <span className="text-stone">Experiencia inolvidable, recomendada al 100%.</span></div></div>
      <div className="d-flex align-items-center gap-3 bg-cream p-3"><span className="bt-score-inline text-warning">★★★★☆</span><div><strong>4 — Muy buena.</strong> <span className="text-stone">Experiencia satisfactoria con ligeras mejoras posibles.</span></div></div>
      <div className="d-flex align-items-center gap-3 bg-cream p-3"><span className="bt-score-inline text-warning">★★★☆☆</span><div><strong>3 — Buena.</strong> <span className="text-stone">Recomendable, aunque con aspectos a mejorar.</span></div></div>
      <div className="d-flex align-items-center gap-3 bg-cream p-3"><span className="bt-score-inline text-warning">★★☆☆☆</span><div><strong>2 — Regular.</strong> <span className="text-stone">Experiencia por debajo de las expectativas.</span></div></div>
      <div className="d-flex align-items-center gap-3 bg-cream p-3"><span className="bt-score-inline text-warning">★☆☆☆☆</span><div><strong>1 — Mala.</strong> <span className="text-stone">Experiencia decepcionante.</span></div></div>
      <div className="d-flex align-items-center gap-3 bg-cream p-3"><span className="bt-score-inline text-secondary">☆☆☆☆☆</span><div><strong>0 — Muy mala.</strong> <span className="text-stone">No recomendable en ningún caso.</span></div></div>
    </div>
  </div>

  <div className="bg-white shadow-sm p-4 mb-4">
    <h2 className="font-serif h4 mb-3">💬 Normas de publicación</h2>
    <ul className="text-stone bt-rules-list mb-0">
      <li>Los comentarios deben ser respetuosos y constructivos.</li>
      <li>No se aceptan insultos, contenido inapropiado ni comentarios irrelevantes.</li>
      <li>Todos los comentarios pasan por validación antes de publicarse.</li>
      <li>Solo los participantes de un encuentro pueden valorarlo.</li>
      <li>Una única valoración por encuentro y usuario.</li>
    </ul>
  </div>

  <div className="bg-white shadow-sm p-4">
    <h2 className="font-serif h4 mb-4">❓ Preguntas frecuentes</h2>
    <div className="accordion bt-faq" id="faq">
      <div className="accordion-item">
        <h3 className="accordion-header"><button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">¿Cómo me inscribo en un encuentro?</button></h3>
        <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faq"><div className="accordion-body text-stone">Debes tener una cuenta activa e iniciar sesión. Luego accede al encuentro y pulsa "Inscribirme". Solo disponible entre <code>appDateIni</code> y <code>appDateEnd</code>.</div></div>
      </div>
      <div className="accordion-item">
        <h3 className="accordion-header"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">¿Cómo se calcula la puntuación de un trek?</button></h3>
        <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faq"><div className="accordion-body text-stone">La puntuación media es <code>totalScore ÷ countScore</code>. Estos valores se actualizan automáticamente mediante triggers cada vez que se crea, actualiza o elimina un meeting.</div></div>
      </div>
      <div className="accordion-item">
        <h3 className="accordion-header"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">¿Qué significa que un trek esté inactivo?</button></h3>
        <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faq"><div className="accordion-body text-stone">El campo <code>status</code> puede ser <code>y</code> (activo) o <code>n</code> (inactivo). Un trek inactivo no tiene encuentros programados ni acepta inscripciones, pero permanece visible en el catálogo.</div></div>
      </div>
      <div className="accordion-item">
        <h3 className="accordion-header"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">¿Puedo cancelar mi inscripción?</button></h3>
        <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faq"><div className="accordion-body text-stone">Sí, desde tu perfil hasta 1 semana antes de la fecha del encuentro. Pasado ese plazo, la cancelación ya no es posible.</div></div>
      </div>
      <div className="accordion-item">
        <h3 className="accordion-header"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">¿Qué es un lugar de interés?</button></h3>
        <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faq"><div className="accordion-body text-stone">Puntos geográficos identificados por sus coordenadas GPS únicas (<code>gps</code>). Cada lugar tiene un tipo (<code>place_type_id</code>: cima, cala, embalse…) y puede estar asociado a uno o varios treks.</div></div>
      </div>
    </div>
  </div>

</div>

        </>

    )
}