import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const STORE_FIELDS = ["store_1", "store_2", "store_3", "store_4", "store_5", "store_6"];

export default function GameDetail() {
	const { name } = useParams();
	const navigate = useNavigate();
	const [game, setGame] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [activeMedia, setActiveMedia] = useState("header");
	const [buying, setBuying] = useState(false);
	const [msg, setMsg] = useState(null);

	const token = localStorage.getItem("burnt_token");
	const decodedName = decodeURIComponent(name);

	useEffect(() => {
		async function load() {
			const [gameRes, reviewsRes] = await Promise.all([
				fetch(`/api/title/${name}`),
				fetch(`/api/title/${name}/reviews`),
			]);
			if (!gameRes.ok) {
				navigate("/");
				return;
			}
			setGame(await gameRes.json());
			if (reviewsRes.ok) setReviews(await reviewsRes.json());
		}
		load();
	}, [name, navigate]);

	async function handleBuy() {
		if (!token) {
			navigate("/login");
			return;
		}
		setBuying(true);
		setMsg(null);
		const res = await fetch("/api/transaction/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ titles: [decodedName] }),
		});
		const data = await res.json();
		if (res.ok) {
			setMsg({
				type: "ok",
				text: `Comprado por $${data.total_spent}. Saldo restante: $${data.wallet_balance}`,
			});
		} else {
			setMsg({ type: "err", text: data.detail ?? "Error al comprar" });
		}
		setBuying(false);
	}

	if (!game) {
		return <div className="py-40 text-center text-burnt-muted">Cargando...</div>;
	}

	const base = parseFloat(game.release_price);
	const discount = game.actual_discount;
	const final = discount ? (base * (1 - discount / 100)).toFixed(2) : base.toFixed(2);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6 aspect-video overflow-hidden rounded-xl bg-burnt-panel">
				{activeMedia === "trailer" ? (
					// biome-ignore lint/a11y/useMediaCaption: game trailers have no captions
					<video className="h-full w-full object-cover" controls autoPlay>
						<source src={`/api/title/${name}/media/trailer`} type="video/mp4" />
					</video>
				) : (
					<img
						src={`/api/title/${name}/media/${activeMedia}`}
						alt={decodedName}
						className="h-full w-full object-cover"
					/>
				)}
			</div>

			<div className="mb-8 flex gap-2 overflow-x-auto pb-1">
				{STORE_FIELDS.map((field) => (
					<button
						key={field}
						type="button"
						onClick={() => setActiveMedia(field)}
						className={`h-16 w-28 flex-none overflow-hidden rounded border-2 transition-colors ${
							activeMedia === field ? "border-burnt-accent" : "border-transparent"
						}`}
					>
						<img
							src={`/api/title/${name}/media/${field}`}
							alt={field}
							className="h-full w-full object-cover"
							onError={(e) => {
								e.target.parentElement.style.display = "none";
							}}
						/>
					</button>
				))}
				<button
					type="button"
					onClick={() => setActiveMedia("trailer")}
					className={`flex h-16 w-28 flex-none items-center justify-center rounded border-2 bg-burnt-panel text-xs text-burnt-muted transition-colors ${
						activeMedia === "trailer" ? "border-burnt-accent" : "border-burnt-border"
					}`}
				>
					Trailer
				</button>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<h1 className="mb-2 text-3xl font-bold text-burnt-text">{decodedName}</h1>
					<div className="mb-4 flex flex-wrap gap-2">
						{game.genres.map((g) => (
							<span
								key={g.name}
								className="rounded border border-burnt-border bg-burnt-panel px-2 py-0.5 text-xs text-burnt-muted"
							>
								{g.name}
							</span>
						))}
					</div>
					<p className="mb-1 text-sm text-burnt-muted">
						Desarrollador: <span className="text-burnt-text">{game.developer?.name ?? "—"}</span>
					</p>
					<p className="mb-6 text-sm text-burnt-muted">
						Lanzamiento: <span className="text-burnt-text">{game.release_date}</span>
					</p>

					<h2 className="mb-4 text-xl font-semibold text-burnt-text">Reseñas</h2>
					{reviews.length === 0 ? (
						<p className="text-sm text-burnt-muted">Sin reseñas todavía</p>
					) : (
						<div className="space-y-4">
							{reviews.map((r) => (
								<div
									key={`${r.customer_name}-${r.created_at}`}
									className="rounded-lg border border-burnt-border bg-burnt-card p-4"
								>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm font-semibold text-burnt-text">{r.customer_name}</span>
										<span
											className={`rounded px-2 py-0.5 text-xs ${
												r.recommends
													? "bg-green-900/40 text-green-400"
													: "bg-red-900/40 text-red-400"
											}`}
										>
											{r.recommends ? "Recomienda" : "No recomienda"}
										</span>
									</div>
									<p className="text-sm text-burnt-muted">{r.content}</p>
									<p className="mt-2 text-xs text-burnt-muted/60">
										{new Date(r.created_at).toLocaleDateString("es-ES")}
									</p>
								</div>
							))}
						</div>
					)}
				</div>

				<div>
					<div className="sticky top-24 rounded-xl border border-burnt-border bg-burnt-card p-6">
						<img
							src={`/api/title/${name}/media/capsule`}
							alt={decodedName}
							className="mb-4 w-full rounded-lg"
							onError={(e) => {
								e.target.style.display = "none";
							}}
						/>
						<div className="mb-4">
							{discount > 0 && (
								<div className="mb-1 flex items-center gap-2">
									<span className="rounded bg-burnt-accent px-2 py-0.5 text-sm font-bold text-white">
										-{discount}%
									</span>
									<span className="text-sm text-burnt-muted line-through">${base.toFixed(2)}</span>
								</div>
							)}
							<p className="text-3xl font-bold text-burnt-text">${final}</p>
						</div>
						{msg && (
							<div
								className={`mb-4 rounded p-3 text-sm ${
									msg.type === "ok"
										? "border border-green-800 bg-green-900/30 text-green-400"
										: "border border-red-800 bg-red-900/30 text-red-400"
								}`}
							>
								{msg.text}
							</div>
						)}
						<button
							type="button"
							onClick={handleBuy}
							disabled={buying}
							className="w-full rounded-lg bg-burnt-accent py-3 font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
						>
							{buying ? "Comprando..." : "Comprar ahora"}
						</button>
						{!token && (
							<p className="mt-3 text-center text-xs text-burnt-muted">
								Necesitas iniciar sesión para comprar
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
