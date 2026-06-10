import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function GenreRow({ genre, cart, addToCart, removeFromCart }) {
	const scrollRef = useRef(null);

	const games = genre.games ?? [];
	const looped = [...games, ...games, ...games];

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		requestAnimationFrame(() => {
			if (el) el.scrollLeft = el.scrollWidth / 3;
		});
	}, []);

	function scroll(dir) {
		const el = scrollRef.current;
		if (!el) return;
		const third = el.scrollWidth / 3;
		if (dir > 0 && el.scrollLeft > third * 2 - 440) {
			el.scrollLeft -= third;
		} else if (dir < 0 && el.scrollLeft < third + 440) {
			el.scrollLeft += third;
		}
		el.scrollBy({ left: dir * 440, behavior: "smooth" });
	}

	if (games.length < 3) return null;

	function handleCart(e, game) {
		e.preventDefault();
		e.stopPropagation();
		if (cart?.some((item) => item.name === game.name)) {
			removeFromCart(game.name);
		} else {
			addToCart(game);
		}
	}

	const inCart = (name) => cart?.some((item) => item.name === name);

	return (
		<section className="mb-10">
			<h2 className="mb-3 text-base font-semibold tracking-tight text-burnt-text">{genre.name}</h2>

			<div className="relative rounded-lg bg-burnt-panel p-3">
				<div
					ref={scrollRef}
					className="grid auto-cols-[13rem] grid-flow-col grid-rows-2 gap-3 overflow-x-auto scrollbar-none"
				>
					{looped.map((game, i) => {
						const base = parseFloat(game.release_price);
						const discount = game.actual_discount;
						const finalUsd = discount ? base * (1 - discount / 100) : base;
						const already = inCart(game.name);

						return (
							<Link
								// biome-ignore lint/suspicious/noArrayIndexKey: infinite loop intentional duplicates
								key={`${game.name}-${i}`}
								to={`/shop/${encodeURIComponent(game.name)}`}
								className="group flex flex-col overflow-hidden rounded-md border border-burnt-border bg-burnt-card transition-colors hover:border-burnt-accent/50"
							>
								<div className="aspect-460/215 overflow-hidden bg-burnt-surface">
									<img
										src={`/api/title/${encodeURIComponent(game.name)}/media/header`}
										alt={game.name}
										loading="lazy"
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										onError={(e) => {
											e.target.parentElement.className =
												"aspect-460/215 bg-burnt-surface flex items-center justify-center";
											e.target.style.display = "none";
										}}
									/>
								</div>

								<div className="flex flex-1 flex-col p-3">
									<h3 className="mb-0.5 truncate text-sm font-semibold text-burnt-text">{game.name}</h3>
									<p className="mb-2 truncate text-xs text-burnt-muted">{game.developer_name ?? "—"}</p>
									<div className="mt-auto flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5">
											{discount > 0 && (
												<span className="rounded bg-burnt-accent px-1.5 py-0.5 text-xs font-bold text-white">
													−{discount}%
												</span>
											)}
											<span className="text-sm font-bold text-burnt-text">
												${finalUsd.toFixed(2)}
											</span>
										</div>
										{addToCart && (
											<button
												type="button"
												onClick={(e) => handleCart(e, game)}
												title={already ? "Quitar del carrito" : "Añadir al carrito"}
												className={`flex-none rounded-lg p-1.5 transition-colors ${
													already
														? "bg-burnt-accent/20 text-burnt-accent hover:bg-burnt-red/20 hover:text-burnt-red"
														: "border border-burnt-border text-burnt-faint opacity-0 group-hover:opacity-100 hover:border-burnt-accent/50 hover:text-burnt-text"
												}`}
											>
												{already ? <X size={14} strokeWidth={1.75} /> : <Plus size={14} strokeWidth={1.75} />}
											</button>
										)}
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				<div className="pointer-events-none absolute inset-y-0 left-0 w-20 rounded-l-lg bg-linear-to-r from-burnt-panel to-transparent" />
				<button
					type="button"
					onClick={() => scroll(-1)}
					className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-burnt-border bg-burnt-card text-burnt-muted shadow-lg transition-colors hover:text-burnt-text"
				>
					<ChevronLeft size={16} strokeWidth={1.75} />
				</button>

				<div className="pointer-events-none absolute inset-y-0 right-0 w-20 rounded-r-lg bg-linear-to-l from-burnt-panel to-transparent" />
				<button
					type="button"
					onClick={() => scroll(1)}
					className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-burnt-border bg-burnt-card text-burnt-muted shadow-lg transition-colors hover:text-burnt-text"
				>
					<ChevronRight size={16} strokeWidth={1.75} />
				</button>
			</div>
		</section>
	);
}
