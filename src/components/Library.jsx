import { ChevronDown } from "lucide-react";
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
			const libRes = await fetch(`/api/customer/${encodeURIComponent(name)}/library`);
			const libData = libRes.ok ? await libRes.json() : [];
			setLibrary(libData);

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


	const filtered = library
		.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()))
		.filter((t) => {
			if (!selectedGenre) return true;
			const detail = titleDetails[t.name];
			return detail?.genres?.some((g) => g.name === selectedGenre);
		});

	return (
		<div className="flex h-screen flex-col overflow-hidden px-4 py-8">
			<div className="mb-4 shrink-0">
				<h1 className="text-lg font-bold text-burnt-text">Biblioteca</h1>
			</div>

			<div className="mb-4 flex shrink-0 flex-wrap gap-3">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar en biblioteca..."
					className="min-w-48 flex-1 rounded-md border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
				/>
				<div className="relative">
					<select
						value={selectedGenre}
						onChange={(e) => setSelectedGenre(e.target.value)}
						className="appearance-none rounded-md border border-burnt-border bg-burnt-panel py-2.5 pl-4 pr-9 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
					>
						<option value="">Todos los géneros</option>
						{genres.map((g) => (
							<option key={g.name} value={g.name}>
								{g.name}
							</option>
						))}
					</select>
					<ChevronDown
						size={14}
						strokeWidth={1.75}
						className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-burnt-faint"
						aria-hidden="true"
					/>
				</div>
			</div>

			<div className="flex-1 overflow-hidden rounded-lg bg-burnt-panel p-3">
				<div className="h-full overflow-y-auto">
					{loading ? (
						<div className="flex h-full items-center justify-center">
							<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
						</div>
					) : filtered.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center text-center">
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
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{filtered.map((t) => (
								<Link
									key={t.name}
									to={`/game/${encodeURIComponent(t.name)}/owned`}
									className="group flex flex-col overflow-hidden rounded-md border border-burnt-border bg-burnt-card transition-all hover:border-burnt-accent/50 hover:shadow-lg hover:shadow-burnt-accent/5"
								>
									<div className="aspect-2/3 overflow-hidden bg-burnt-panel">
										<MediaImage
											src={`/api/title/${encodeURIComponent(t.name)}/media/capsule`}
											alt={t.name}
											className="transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
									<div className="p-2">
										<h3 className="truncate text-xs font-semibold text-burnt-text">{t.name}</h3>
										<p className="truncate text-xs text-burnt-muted">
											{titleDetails[t.name]?.developer?.name ?? "—"}
										</p>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
