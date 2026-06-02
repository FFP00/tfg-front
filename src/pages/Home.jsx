import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameCard from "../components/GameCard";

export default function Home() {
	const [games, setGames] = useState([]);
	const [featured, setFeatured] = useState(null);
	const [genres, setGenres] = useState([]);
	const [search, setSearch] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadInitial() {
			const [featuredRes, genresRes] = await Promise.all([
				fetch("/api/title/random"),
				fetch("/api/genre/"),
			]);
			if (featuredRes.ok) setFeatured(await featuredRes.json());
			if (genresRes.ok) setGenres(await genresRes.json());
		}
		loadInitial();
	}, []);

	useEffect(() => {
		async function loadGames() {
			setLoading(true);
			const params = new URLSearchParams();
			if (search) params.set("search", search);
			if (selectedGenre) params.set("genre", selectedGenre);
			const res = await fetch(`/api/title/?${params}`);
			if (res.ok) setGames(await res.json());
			setLoading(false);
		}
		loadGames();
	}, [search, selectedGenre]);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			{featured && (
				<Link
					to={`/game/${encodeURIComponent(featured.name)}`}
					className="group relative mb-10 block overflow-hidden rounded-xl"
				>
					<img
						src={`/api/title/${encodeURIComponent(featured.name)}/media/header`}
						alt={featured.name}
						className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
						onError={(e) => {
							e.target.style.display = "none";
						}}
					/>
					<div className="absolute inset-0 flex items-end bg-gradient-to-t from-burnt-bg/90 to-transparent p-6">
						<div>
							<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-burnt-accent">
								Destacado
							</p>
							<h2 className="text-3xl font-bold text-white">{featured.name}</h2>
							<p className="mt-1 text-burnt-muted">{featured.developer_name}</p>
						</div>
					</div>
				</Link>
			)}

			<div className="mb-8 flex flex-wrap gap-3">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar juego..."
					className="min-w-48 flex-1 rounded border border-burnt-border bg-burnt-panel px-4 py-2 text-sm text-burnt-text placeholder-burnt-muted focus:border-burnt-accent focus:outline-none"
				/>
				<select
					value={selectedGenre}
					onChange={(e) => setSelectedGenre(e.target.value)}
					className="rounded border border-burnt-border bg-burnt-panel px-4 py-2 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
				>
					<option value="">Todos los géneros</option>
					{genres.map((g) => (
						<option key={g.name} value={g.name}>
							{g.name}
						</option>
					))}
				</select>
			</div>

			{loading ? (
				<div className="py-20 text-center text-burnt-muted">Cargando...</div>
			) : games.length === 0 ? (
				<div className="py-20 text-center text-burnt-muted">No hay juegos disponibles</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{games.map((game) => (
						<GameCard key={game.name} game={game} />
					))}
				</div>
			)}
		</div>
	);
}
