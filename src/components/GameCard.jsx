import { Link } from "react-router-dom";

export default function GameCard({ game }) {
	const base = parseFloat(game.release_price);
	const discount = game.actual_discount;
	const final = discount ? (base * (1 - discount / 100)).toFixed(2) : base.toFixed(2);

	return (
		<Link
			to={`/game/${encodeURIComponent(game.name)}`}
			className="group overflow-hidden rounded-lg border border-burnt-border bg-burnt-card transition-colors hover:border-burnt-accent"
		>
			<div className="aspect-[3/4] overflow-hidden bg-burnt-panel">
				<img
					src={`/api/title/${encodeURIComponent(game.name)}/media/capsule`}
					alt={game.name}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					onError={(e) => {
						e.target.style.display = "none";
					}}
				/>
			</div>
			<div className="p-3">
				<h3 className="truncate text-sm font-semibold text-burnt-text">{game.name}</h3>
				<p className="mb-2 truncate text-xs text-burnt-muted">{game.developer_name}</p>
				<div className="flex items-center gap-2">
					{discount > 0 && (
						<span className="rounded bg-burnt-accent px-1.5 py-0.5 text-xs font-bold text-white">
							-{discount}%
						</span>
					)}
					<span className="text-sm font-semibold text-burnt-text">${final}</span>
					{discount > 0 && (
						<span className="text-xs text-burnt-muted line-through">${base.toFixed(2)}</span>
					)}
				</div>
			</div>
		</Link>
	);
}
