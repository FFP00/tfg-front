import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MediaImage from "./ui/MediaImage";

export default function Library() {
	const navigate = useNavigate();
	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const user = JSON.parse(localStorage.getItem("burnt_user") ?? "null");
	const [genres] = useState(() => JSON.parse(localStorage.getItem("burnt_genres") ?? "[]"));

	const [library, setLibrary] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [titleDetails, setTitleDetails] = useState({});
	const [search, setSearch] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!token || type !== "customer") {
			navigate("/login");
			return;
		}
		const name = user?.name;
		if (!name) {
			navigate("/login");
			return;
		}
		async function load() {
			const [libRes, revRes] = await Promise.all([
				fetch(`/api/customer/${encodeURIComponent(name)}/library`),
				fetch(`/api/customer/${encodeURIComponent(name)}/reviews`),
			]);
			const libData = libRes.ok ? await libRes.json() : [];
			const revData = revRes.ok ? await revRes.json() : [];
			setLibrary(libData);
			setReviews(revData);

			if (libData.length > 0) {
				const details = await Promise.all(
					libData.map((t) =>
						fetch(`/api/title/${encodeURIComponent(t.name)}`)
							.then((r) => (r.ok ? r.json() : null))
							.catch(() => null),
					),
				);
				const map = {};
				details.forEach((d) => {
					if (d) map[d.name] = d;
				});
				setTitleDetails(map);
			}
			setLoading(false);
		}
		load();
	}, [token, type, user?.name, navigate]);

	const reviewMap = {};
	reviews.forEach((r) => {
		reviewMap[r.title_name] = r;
	});

	const filtered = library
		.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()))
		.filter((t) => {
			if (!selectedGenre) return true;
			const detail = titleDetails[t.name];
			return detail?.genres?.some((g) => g.name === selectedGenre);
		});

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6 flex items-center gap-3">
				<Link to="/me" className="text-sm text-burnt-muted transition-colors hover:text-burnt-text">
					← Mi cuenta
				</Link>
				<span className="text-burnt-faint">/</span>
				<h1 className="text-lg font-bold text-burnt-text">Biblioteca</h1>
				{!loading && (
					<span className="ml-auto text-sm text-burnt-muted">{library.length} juegos</span>
				)}
			</div>

			<div className="mb-6 flex flex-wrap gap-3">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar en biblioteca..."
					className="min-w-48 flex-1 rounded-md border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
				/>
				<select
					value={selectedGenre}
					onChange={(e) => setSelectedGenre(e.target.value)}
					className="rounded-md border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
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
				<div className="flex justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
				</div>
			) : filtered.length === 0 ? (
				<div className="py-20 text-center">
					<p className="mb-2 text-5xl">📚</p>
					<p className="text-lg font-semibold text-burnt-text">
						{library.length === 0 ? "Biblioteca vacía" : "Sin resultados"}
					</p>
					<p className="mt-1 text-sm text-burnt-muted">
						{library.length === 0 ? (
							<>
								Explora el{" "}
								<Link to="/" className="text-burnt-accent hover:text-burnt-accent-hover">
									catálogo
								</Link>
							</>
						) : (
							"Prueba con otros filtros"
						)}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
					{filtered.map((t) => {
						const review = reviewMap[t.name];
						return (
							<Link
								key={t.name}
								to={`/game/${encodeURIComponent(t.name)}/owned`}
								className="group relative flex flex-col overflow-hidden rounded-md border border-burnt-border bg-burnt-card transition-all hover:border-burnt-accent/50 hover:shadow-lg hover:shadow-burnt-accent/5"
							>
								<div className="aspect-2/3 overflow-hidden bg-burnt-panel">
									<MediaImage
										src={`/api/title/${encodeURIComponent(t.name)}/media/capsule`}
										alt={t.name}
										className="transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
								{review && (
									<span
										className={`absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
											review.recommends
												? "bg-burnt-green/90 text-white"
												: "bg-burnt-red/90 text-white"
										}`}
									>
										{review.recommends ? "✓" : "✗"}
									</span>
								)}
								<div className="p-2">
									<h3 className="truncate text-xs font-semibold text-burnt-text">{t.name}</h3>
									<p className="truncate text-xs text-burnt-muted">
										{titleDetails[t.name]?.developer?.name ?? "—"}
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
