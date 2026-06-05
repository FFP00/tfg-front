import AuthImage from "../ui/AuthImage";

export default function MyTitles({ titles, onEdit }) {
	if (titles.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="mb-2 text-4xl">🎮</p>
				<p className="text-sm font-semibold text-burnt-text">Sin títulos publicados</p>
				<p className="mt-1 text-xs text-burnt-muted">Crea tu primer título con el botón de arriba</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
			{titles.map((title) => (
				<div
					key={title.name}
					className="group flex flex-col overflow-hidden rounded-md border border-burnt-border bg-burnt-card transition-all hover:border-burnt-accent/50 hover:shadow-lg hover:shadow-burnt-accent/5"
				>
					<div className="relative aspect-2/3 overflow-hidden bg-burnt-panel">
						<AuthImage
							src={`/api/title/${encodeURIComponent(title.name)}/media/capsule`}
							alt={title.name}
							className="transition-transform duration-300 group-hover:scale-105"
						/>
						<button
							type="button"
							onClick={() => onEdit(title)}
							className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<span className="rounded-lg border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
								Editar
							</span>
						</button>
					</div>
					<div className="p-2">
						<h3 className="truncate text-xs font-semibold text-burnt-text">{title.name}</h3>
						<p className={`text-xs font-medium ${title.status ? "text-burnt-green" : "text-burnt-yellow"}`}>
							{title.status ? "Publicado" : "Pendiente"}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
