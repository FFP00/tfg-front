import { Play } from "lucide-react";
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
			{/* Hero */}
			<div className="relative mb-8 overflow-hidden rounded-xl border border-burnt-border aspect-460/215">
				<img
					src={`/api/title/${encodedName}/media/header`}
					alt={decodedName}
					className="h-full w-full object-cover"
					onError={(e) => {
						e.target.style.display = "none";
					}}
				/>
				<div className="absolute inset-0 bg-linear-to-t from-burnt-bg via-burnt-bg/55 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 p-6">
					<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-burnt-accent">
						En tu biblioteca
					</p>
					<h1 className="mb-1.5 text-3xl font-bold leading-tight text-white drop-shadow-lg">
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

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Main: media + reviews */}
				<div className="lg:col-span-2">
					<div className="mb-8">
						<MediaViewer
							encodedName={encodedName}
							activeMedia={activeMedia}
							onSelect={setActiveMedia}
							capsule={`/api/title/${encodedName}/media/capsule`}
						/>
					</div>

					<ReviewList
						reviews={reviews}
						setReviews={setReviews}
						token={token}
						encodedName={encodedName}
						owned={true}
					/>
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Info */}
					<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
						<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-burnt-faint">
							Información
						</p>
						<div className="space-y-4">
							{game.developer && (
								<div>
									<p className="mb-0.5 text-xs text-burnt-faint">Desarrollador</p>
									<Link
										to={`/developer/${encodeURIComponent(game.developer.name)}`}
										className="text-sm text-burnt-text transition-colors hover:text-burnt-accent"
									>
										{game.developer.name}
									</Link>
								</div>
							)}
							{game.release_date && (
								<div>
									<p className="mb-0.5 text-xs text-burnt-faint">Lanzamiento</p>
									<p className="text-sm text-burnt-text">{game.release_date}</p>
								</div>
							)}
							{game.genres?.length > 0 && (
								<div>
									<p className="mb-1.5 text-xs text-burnt-faint">Géneros</p>
									<div className="flex flex-wrap gap-1.5">
										{game.genres.map((g) => (
											<span
												key={g.name}
												className="rounded-full border border-burnt-border bg-burnt-panel px-2.5 py-0.5 text-xs text-burnt-muted"
											>
												{g.name}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Play */}
					<div className="rounded-lg border border-burnt-border bg-burnt-card p-4">
						{playing ? (
							<div className="flex items-center justify-center gap-2.5 rounded-lg border border-burnt-green/30 bg-burnt-green/10 px-4 py-2.5 text-sm font-semibold text-burnt-green">
								<span className="h-2 w-2 animate-pulse rounded-full bg-burnt-green" />
								Lanzando…
							</div>
						) : (
							<button
								type="button"
								onClick={() => setPlaying(true)}
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-burnt-accent py-2.5 font-bold text-white transition-colors hover:bg-burnt-accent-hover"
							>
								<Play size={15} strokeWidth={1.75} fill="currentColor" />
								Jugar
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
