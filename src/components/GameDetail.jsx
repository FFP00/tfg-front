import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MediaViewer from "./GameDetail/MediaViewer.jsx";
import PurchaseCard from "./GameDetail/PurchaseCard.jsx";
import ReviewList from "./GameDetail/ReviewList.jsx";

export default function GameDetail({ cart, addToCart, removeFromCart }) {
	const { name } = useParams();
	const navigate = useNavigate();
	const [game, setGame] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [activeMedia, setActiveMedia] = useState("store_1");
	const [owned, setOwned] = useState(false);

	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const encodedName = name;
	const decodedName = decodeURIComponent(name);

	useEffect(() => {
		async function load() {
			try {
				const [gameRes, reviewsRes] = await Promise.all([
					axios.get(`/api/title/${name}`),
					axios.get(`/api/title/${name}/reviews`)
				]);
				setGame(gameRes.data);
				setReviews(reviewsRes.data);
			} catch {
				navigate("/");
			}
		}
		load();
	}, [name, navigate]);

	useEffect(() => {
		if (type !== "customer" || !token) return;
		const user = JSON.parse(localStorage.getItem("burnt_user") ?? "null");
		if (!user?.name) return;
		async function checkOwned() {
			try {
				const res = await axios.get(`/api/customer/${encodeURIComponent(user.name)}/library`);
				setOwned(res.data.some((t) => t.name === decodeURIComponent(name)));
			} catch {
				// ignore
			}
		}
		checkOwned();
	}, [token, type, name]);

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
						<Link
							to={`/developer/${encodeURIComponent(game.developer.name)}`}
							className="text-burnt-accent transition-colors hover:text-burnt-accent-hover"
						>
							{game.developer.name}
						</Link>
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
				owned={owned}
			/>
		</div>
	);
}
