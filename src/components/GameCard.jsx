import { Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function GameCard({ game, cart, addToCart, removeFromCart }) {
	const type = localStorage.getItem("burnt_type");
	const base = parseFloat(game.release_price);
	const discount = game.actual_discount;
	const finalUsd = discount ? base * (1 - discount / 100) : base;
	const inCart = cart?.some((item) => item.name === game.name);

	function handleCart(e) {
		e.preventDefault();
		e.stopPropagation();
		if (inCart) removeFromCart?.(game.name);
		else addToCart?.(game);
	}

	return (
		<Link
			to={`/shop/${encodeURIComponent(game.name)}`}
			className="group relative flex flex-col overflow-hidden rounded-md border border-burnt-border bg-burnt-card transition-all duration-200 hover:border-burnt-accent/50 hover:shadow-lg hover:shadow-burnt-accent/5"
		>
			<div className="aspect-2/3 overflow-hidden bg-burnt-panel">
				<img
					src={`/api/title/${encodeURIComponent(game.name)}/media/capsule`}
					alt={game.name}
					loading="lazy"
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					onError={(e) => {
						e.target.parentElement.className =
							"aspect-2/3 bg-burnt-panel flex items-center justify-center";
						e.target.style.display = "none";
					}}
				/>
			</div>

			<div className="flex flex-1 flex-col p-3">
				<h3 className="mb-0.5 truncate text-sm font-semibold text-burnt-text">{game.name}</h3>
				<p className="mb-3 truncate text-xs text-burnt-muted">{game.developer_name ?? "—"}</p>
				<div className="mt-auto flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5">
						{discount > 0 && (
							<span className="rounded bg-burnt-accent px-1.5 py-0.5 text-xs font-bold text-white">
								−{discount}%
							</span>
						)}
						<span className="text-sm font-bold text-burnt-text">${finalUsd.toFixed(2)}</span>
						{discount > 0 && (
							<span className="text-xs text-burnt-faint line-through">${base.toFixed(2)}</span>
						)}
					</div>
					{addToCart && type !== "developer" && (
						<button
							type="button"
							onClick={handleCart}
							title={inCart ? "Quitar del carrito" : "Añadir al carrito"}
							className={`flex-none rounded-lg p-1.5 transition-colors ${
								inCart
									? "bg-burnt-accent/20 text-burnt-accent hover:bg-burnt-red/20 hover:text-burnt-red"
									: "border border-burnt-border text-burnt-faint opacity-0 group-hover:opacity-100 hover:border-burnt-accent/50 hover:text-burnt-text"
							}`}
						>
							{inCart ? <X size={14} strokeWidth={1.75} /> : <Plus size={14} strokeWidth={1.75} />}
						</button>
					)}
				</div>
			</div>
		</Link>
	);
}
