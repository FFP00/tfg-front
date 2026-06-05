import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MediaViewer from "./GameDetail/MediaViewer";
import PurchaseCard from "./GameDetail/PurchaseCard";
import ReviewList from "./GameDetail/ReviewList";

export default function GameDetail({ cart, addToCart, removeFromCart }) {
	const { name } = useParams();
	const navigate = useNavigate();
	const [game, setGame] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [activeMedia, setActiveMedia] = useState("store_1");

	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const encodedName = name;
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

	if (!game) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
			</div>
		);
	}

	const purchaseToken = type === "customer" ? token : null;
	const canAddToCart = type === "customer" || !token;

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6">
				<MediaViewer
					encodedName={encodedName}
					activeMedia={activeMedia}
					onSelect={setActiveMedia}
					capsule={`/api/title/${encodedName}/media/capsule`}
				/>
			</div>

			{/* Título a la izquierda, botón carrito a la derecha */}
			<div className="mb-4 flex items-center justify-between gap-4">
				<h1 className="text-3xl font-bold text-burnt-text">{decodedName}</h1>
				<PurchaseCard
					game={game}
					encodedName={encodedName}
					token={purchaseToken}
					cart={cart}
					addToCart={canAddToCart ? addToCart : undefined}
					removeFromCart={removeFromCart}
				/>
			</div>

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

			<div className="mb-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-burnt-muted">
				<span>
					Desarrollador:{" "}
					{game.developer ? (
						<a
							href={`/developer/${encodeURIComponent(game.developer.name)}`}
							className="text-burnt-accent transition-colors hover:text-burnt-accent-hover"
						>
							{game.developer.name}
						</a>
					) : (
						<span className="text-burnt-text">—</span>
					)}
				</span>
				<span>
					Lanzamiento: <span className="text-burnt-text">{game.release_date}</span>
				</span>
			</div>

			<ReviewList
				reviews={reviews}
				setReviews={setReviews}
				token={purchaseToken}
				encodedName={encodedName}
			/>
		</div>
	);
}
