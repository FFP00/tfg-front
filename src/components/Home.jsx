import { useEffect, useState } from "react";
import FeaturedBanner from "./Home/FeaturedBanner";
import GameGrid from "./Home/GameGrid";
import GenreRow from "./Home/GenreRow";
import SearchBar from "./Home/SearchBar";

export default function Home({ cart, addToCart, removeFromCart }) {
	const [genres] = useState(() => JSON.parse(localStorage.getItem("burnt_genres") ?? "[]"));

	const [search, setSearch] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [genreGames, setGenreGames] = useState({});
	const [genresLoading, setGenresLoading] = useState(true);

	const isFiltering = search.trim() !== "" || selectedGenre !== "";

	useEffect(() => {
		async function loadGenres() {
			if (genres.length === 0) {
				setGenresLoading(false);
				return;
			}
			setGenresLoading(true);
			const results = await Promise.all(
				genres.map((g) =>
					fetch(`/api/title/?genre=${encodeURIComponent(g.name)}`)
						.then((r) => (r.ok ? r.json() : []))
						.catch(() => []),
				),
			);
			const map = {};
			genres.forEach((g, i) => {
				map[g.name] = results[i];
			});
			setGenreGames(map);
			setGenresLoading(false);
		}
		loadGenres();
	}, [genres]);

	useEffect(() => {
		if (!isFiltering) return;
		async function doSearch() {
			setSearchLoading(true);
			const params = new URLSearchParams();
			if (search.trim()) params.set("search", search.trim());
			if (selectedGenre) params.set("genre", selectedGenre);
			const res = await fetch(`/api/title/?${params}`);
			if (res.ok) setSearchResults(await res.json());
			else setSearchResults([]);
			setSearchLoading(false);
		}
		doSearch();
	}, [search, selectedGenre, isFiltering]);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<FeaturedBanner cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />

			<SearchBar
				search={search}
				onSearch={setSearch}
				genres={genres}
				selectedGenre={selectedGenre}
				onGenreChange={setSelectedGenre}
			/>

			{isFiltering ? (
				<div>
					<p className="mb-6 text-sm text-burnt-muted">
						{searchLoading
							? "Buscando..."
							: `${searchResults.length} resultado${searchResults.length !== 1 ? "s" : ""}`}
						{search.trim() && (
							<span>
								{" "}
								para <span className="font-medium text-burnt-text">"{search}"</span>
							</span>
						)}
					</p>
					<GameGrid
						games={searchResults}
						loading={searchLoading}
						cart={cart}
						addToCart={addToCart}
						removeFromCart={removeFromCart}
					/>
				</div>
			) : (
				<div>
					{!genresLoading &&
						genres.map((g) => (
							<GenreRow
								key={g.name}
								genre={{ name: g.name, games: genreGames[g.name] ?? [] }}
								cart={cart}
								addToCart={addToCart}
								removeFromCart={removeFromCart}
							/>
						))}
				</div>
			)}
		</div>
	);
}
