import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function FeaturedBanner({ cart, addToCart, removeFromCart }) {
	const [games, setGames] = useState([null, null, null]);

	useEffect(() => {
		async function fetchOne(seen) {
			while (true) {
				try {
					const r = await axios.get("/api/title/random");
					const g = r.data;
					if (!seen.has(g.name)) {
						seen.add(g.name);
						return g;
					}
				} catch {
					return null;
				}
			}
		}
		async function loadRandom() {
			const seen = new Set();
			const results = [];
			for (let i = 0; i < 3; i++) {
				results.push(await fetchOne(seen));
			}
			setGames(results);
		}
		loadRandom();
	}, []);

	return (
		<div className="mb-10">
			<p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-burnt-faint">
				Puede que te guste
			</p>
			<div className="grid grid-cols-3 gap-4">
				{games.map((game, i) => (
					<FeaturedCard
						key={game?.name ?? i}
						game={game}
						cart={cart}
						addToCart={addToCart}
						removeFromCart={removeFromCart}
					/>
				))}
			</div>
		</div>
	);
}

function FeaturedCard({ game, cart, addToCart, removeFromCart }) {
	if (!game) return null;

	const base = parseFloat(game.release_price);
	const discount = game.actual_discount ?? 0;
	const finalUsd = discount ? base * (1 - discount / 100) : base;
	const inCart = cart?.some((item) => item.name === game.name);

	function handleCart(e) {
		e.preventDefault();
		e.stopPropagation();
		if (inCart) removeFromCart?.(game.name);
		else addToCart?.(game);
	}

	return (
		<div className="group flex flex-col overflow-hidden rounded-lg border border-burnt-border bg-burnt-card">
			<Link
				to={`/shop/${encodeURIComponent(game.name)}`}
				className="block aspect-2/3 overflow-hidden bg-burnt-panel"
			>
				<img
					src={`/api/title/${encodeURIComponent(game.name)}/media/capsule`}
					alt={game.name}
					loading="lazy"
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					onError={(e) => {
						e.target.style.display = "none";
					}}
				/>
			</Link>

			<div className="flex flex-1 flex-col p-4">
				{game.developer_name && (
					<p className="mb-0.5 truncate text-[11px] text-burnt-faint">{game.developer_name}</p>
				)}
				<h3 className="mb-1 truncate text-sm font-semibold text-burnt-text">{game.name}</h3>
				{game.genres?.length > 0 && (
					<p className="mb-3 truncate text-xs text-burnt-muted">
						{game.genres.map((g) => g.name).join(" · ")}
					</p>
				)}

				<div className="mt-auto space-y-2">
					<div className="flex items-center gap-2">
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

					<div className="flex gap-2">
						<Link
							to={`/shop/${encodeURIComponent(game.name)}`}
							className="flex-1 rounded bg-burnt-accent py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
						>
							Dale una oportunidad
						</Link>
						{addToCart && (
							<button
								type="button"
								onClick={handleCart}
								title={inCart ? "Quitar del carrito" : "Añadir al carrito"}
								className={`rounded border px-3 py-2 text-xs font-medium transition-colors ${
									inCart
										? "border-burnt-accent/40 bg-burnt-accent/10 text-burnt-accent hover:border-burnt-red/40 hover:bg-burnt-red/10 hover:text-burnt-red"
										: "border-burnt-border text-burnt-muted hover:border-burnt-accent/50 hover:text-burnt-text"
								}`}
							>
								{inCart ? "En carrito" : "+ Carrito"}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
