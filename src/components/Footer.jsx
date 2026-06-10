import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="mt-24 border-t border-burnt-border">
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid grid-cols-4 gap-8">
					<div className="col-span-1">
						<Link to="/" className="text-lg font-bold text-burnt-accent">
							Burnt
						</Link>
						<p className="mt-2 text-xs leading-relaxed text-burnt-faint">
							Distribución digital open-source para juegos independientes.
						</p>
					</div>

					<div>
						<p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-burnt-faint">
							Tienda
						</p>
						<ul className="space-y-2">
							<li>
								<Link to="/" className="text-sm text-burnt-muted transition-colors hover:text-burnt-text">
									Catálogo
								</Link>
							</li>
							<li>
								<Link
									to="/cart"
									className="text-sm text-burnt-muted transition-colors hover:text-burnt-text"
								>
									Carrito
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-burnt-faint">
							Comunidad
						</p>
						<ul className="space-y-2">
							<li>
								<Link
									to="/community"
									className="text-sm text-burnt-muted transition-colors hover:text-burnt-text"
								>
									Jugadores
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-burnt-faint">
							Plataforma
						</p>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="text-sm text-burnt-muted transition-colors hover:text-burnt-text"
								>
									Nosotros
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-sm text-burnt-muted transition-colors hover:text-burnt-text"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-sm text-burnt-muted transition-colors hover:text-burnt-text"
								>
									Contacto
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-row items-center justify-between gap-3 border-t border-burnt-border pt-8">
					<p className="text-xs text-burnt-faint">
						© {new Date().getFullYear()} Burnt. Software libre bajo licencia MIT.
					</p>
					<p className="text-xs text-burnt-faint">Hecho con React + Tailwind + FastAPI</p>
				</div>
			</div>
		</footer>
	);
}
