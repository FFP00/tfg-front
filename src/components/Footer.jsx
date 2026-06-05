import { Link } from "react-router-dom";

const LINKS = [
	{
		label: "Tienda",
		items: [
			{ to: "/", text: "Catálogo" },
			{ to: "/search/developers", text: "Desarrolladoras" },
			{ to: "/cart", text: "Carrito" },
		],
	},
	{
		label: "Comunidad",
		items: [
			{ to: "/search/customers", text: "Jugadores" },
			{ to: "/search/developers", text: "Estudios" },
		],
	},
	{
		label: "Plataforma",
		items: [
			{ to: "/about", text: "Nosotros" },
			{ to: "/faq", text: "FAQ" },
			{ to: "/contact", text: "Contacto" },
		],
	},
];

export default function Footer() {
	return (
		<footer className="mt-24 border-t border-burnt-border">
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
					{/* Brand */}
					<div className="col-span-2 sm:col-span-1">
						<Link to="/" className="text-lg font-bold text-burnt-accent">
							Burnt
						</Link>
						<p className="mt-2 text-xs leading-relaxed text-burnt-faint">
							Distribución digital open-source para juegos independientes.
						</p>
					</div>

					{/* Link columns */}
					{LINKS.map((col) => (
						<div key={col.label}>
							<p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-burnt-faint">
								{col.label}
							</p>
							<ul className="space-y-2">
								{col.items.map((item) => (
									<li key={item.text}>
										<Link
											to={item.to}
											className="text-sm text-burnt-muted transition-colors hover:text-burnt-text"
										>
											{item.text}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-burnt-border pt-8 sm:flex-row">
					<p className="text-xs text-burnt-faint">
						© {new Date().getFullYear()} Burnt. Software libre bajo licencia MIT.
					</p>
					<p className="text-xs text-burnt-faint">Hecho con React + Tailwind + FastAPI</p>
				</div>
			</div>
		</footer>
	);
}
