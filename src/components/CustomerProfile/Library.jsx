import { Link } from "react-router-dom";

export default function Library({ titles }) {
	if (titles.length === 0) {
		return <p className="py-4 text-center text-sm text-burnt-muted">Biblioteca vacía</p>;
	}

	return (
		<div className="grid grid-cols-4 gap-2">
			{titles.map((t) => (
				<Link
					key={t.name}
					to={`/shop/${encodeURIComponent(t.name)}`}
					title={t.name}
					className="group overflow-hidden rounded-md border border-burnt-border transition-colors hover:border-burnt-accent/50"
				>
					<div className="aspect-2/3 overflow-hidden bg-burnt-panel">
						<img
							src={`/api/title/${encodeURIComponent(t.name)}/media/capsule`}
							alt={t.name}
							loading="lazy"
							className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
							onError={(e) => {
								e.target.style.display = "none";
							}}
						/>
					</div>
				</Link>
			))}
		</div>
	);
}
