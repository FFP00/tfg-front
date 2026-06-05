import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MediaViewer from "./GameDetail/MediaViewer";
import ReviewList from "./GameDetail/ReviewList";

export default function GameOwned() {
	const { name } = useParams();
	const navigate = useNavigate();
	const [game, setGame] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [activeMedia, setActiveMedia] = useState("store_1");
	const [playing, setPlaying] = useState(false);

	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const user = JSON.parse(localStorage.getItem("burnt_user") ?? "null");
	const encodedName = name;
	const decodedName = decodeURIComponent(name);

	useEffect(() => {
		if (!token || type !== "customer") {
			navigate("/login");
			return;
		}
		async function load() {
			const [gameRes, reviewsRes] = await Promise.all([
				fetch(`/api/title/${name}`),
				fetch(`/api/title/${name}/reviews`),
			]);
			if (!gameRes.ok) {
				navigate("/me/library");
				return;
			}
			setGame(await gameRes.json());
			if (reviewsRes.ok) setReviews(await reviewsRes.json());
		}
		load();
	}, [name, token, type, navigate]);

	if (!game) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-5 flex items-center gap-3 text-sm text-burnt-muted">
				<Link to="/me/library" className="transition-colors hover:text-burnt-text">
					← Biblioteca
				</Link>
				<span className="text-burnt-faint">/</span>
				<span className="text-burnt-text">{decodedName}</span>
			</div>

			{/* Hero section */}
			<div className="relative mb-8 overflow-hidden rounded-lg border border-burnt-border">
				<img
					src={`/api/title/${encodedName}/media/header`}
					alt={decodedName}
					className="h-52 w-full object-cover"
					onError={(e) => {
						e.target.style.display = "none";
					}}
				/>
				<div className="absolute inset-0 bg-linear-to-r from-burnt-bg/95 via-burnt-bg/60 to-transparent" />
				<div className="absolute inset-0 flex items-end p-6">
					<div className="flex items-end gap-5">
						<div className="hidden h-28 w-20 overflow-hidden rounded-md border border-burnt-border shadow-xl sm:block">
							<img
								src={`/api/title/${encodedName}/media/capsule`}
								alt={decodedName}
								className="h-full w-full object-cover"
							/>
						</div>
						<div>
							<p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-burnt-accent">
								En tu biblioteca
							</p>
							<h1 className="mb-1 text-3xl font-bold leading-tight text-white drop-shadow">
								{decodedName}
							</h1>
							{game.developer && (
								<p className="text-sm text-burnt-muted">
									por{" "}
									<Link
										to={`/developer/${encodeURIComponent(game.developer.name)}`}
										className="text-burnt-text transition-colors hover:text-burnt-accent"
									>
										{game.developer.name}
									</Link>
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Main: media + reviews */}
				<div className="lg:col-span-2">
					<MediaViewer
						encodedName={encodedName}
						activeMedia={activeMedia}
						onSelect={setActiveMedia}
						capsule={`/api/title/${encodedName}/media/capsule`}
					/>

					<div className="mb-4 flex flex-wrap gap-2">
						{game.genres.map((g) => (
							<span
								key={g.name}
								className="rounded-full border border-burnt-border bg-burnt-panel px-3 py-1 text-xs font-medium text-burnt-muted"
							>
								{g.name}
							</span>
						))}
					</div>

					<ReviewList
						reviews={reviews}
						setReviews={setReviews}
						token={token}
						encodedName={encodedName}
					/>
				</div>

				{/* Side panel */}
				<div className="space-y-4">
					{/* Play card */}
					<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
						<div className="mb-5 text-center">
							<p className="text-3xl font-bold text-burnt-text">0</p>
							<p className="text-xs text-burnt-muted">horas en la última semana</p>
							<p className="mt-1 text-xs text-burnt-faint">
								Última vez jugado: <span className="text-burnt-muted">Nunca</span>
							</p>
						</div>

						{playing ? (
							<div className="rounded-md border border-burnt-green/30 bg-burnt-green/10 px-4 py-3 text-center text-sm font-semibold text-burnt-green">
								Lanzando {decodedName}…
							</div>
						) : (
							<button
								type="button"
								onClick={() => setPlaying(true)}
								className="w-full rounded-md bg-burnt-accent py-3 text-center font-bold text-white transition-colors hover:bg-burnt-accent-hover"
							>
								Jugar
							</button>
						)}

						<div className="mt-4 border-t border-burnt-border pt-4">
							<div className="flex items-center justify-between text-xs text-burnt-muted">
								<span>Lanzamiento</span>
								<span className="text-burnt-text">{game.release_date ?? "—"}</span>
							</div>
						</div>
					</div>

					{/* Account info */}
					{user && (
						<div className="rounded-lg border border-burnt-border bg-burnt-card p-4 text-xs text-burnt-muted">
							<p className="mb-1 font-semibold text-burnt-text">{user.name}</p>
							<p>Juego en tu biblioteca</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
