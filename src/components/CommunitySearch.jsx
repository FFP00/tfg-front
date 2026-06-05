import { useState } from "react";
import { Link } from "react-router-dom";
import AvatarImage from "./ui/AvatarImage";

export default function CommunitySearch() {
	const [tab, setTab] = useState("players");
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);

	async function doSearch(query, type) {
		if (!query.trim()) {
			setResults([]);
			setSearched(false);
			return;
		}
		setLoading(true);
		setSearched(true);
		const endpoint = type === "players" ? "/api/customer/" : "/api/developer/";
		const res = await fetch(`${endpoint}?search=${encodeURIComponent(query.trim())}`);
		setResults(res.ok ? await res.json() : []);
		setLoading(false);
	}

	function handleSearch(e) {
		const q = e.target.value;
		setSearch(q);
		doSearch(q, tab);
	}

	function handleTab(t) {
		setTab(t);
		setResults([]);
		setSearched(false);
		if (search.trim()) doSearch(search, t);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6">
				<p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-burnt-accent">
					Comunidad
				</p>
				<h1 className="mb-5 text-2xl font-bold tracking-tight text-burnt-text">Buscar comunidad</h1>

				<div className="mb-4 flex overflow-hidden rounded-md border border-burnt-border bg-burnt-surface">
					{[
						{ id: "players", label: "Jugadores" },
						{ id: "developers", label: "Desarrolladoras" },
					].map(({ id, label }) => (
						<button
							key={id}
							type="button"
							onClick={() => handleTab(id)}
							className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
								tab === id ? "bg-burnt-accent text-white" : "text-burnt-muted hover:text-burnt-text"
							}`}
						>
							{label}
						</button>
					))}
				</div>

				<input
					type="text"
					value={search}
					onChange={handleSearch}
					placeholder={
						tab === "players"
							? "Buscar jugador por nombre o email..."
							: "Buscar estudio por nombre..."
					}
					className="w-full rounded-md border border-burnt-border bg-burnt-panel px-4 py-3 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
				/>
			</div>

			{loading ? (
				<div className="flex justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
				</div>
			) : !searched ? (
				<div className="py-16 text-center">
					<p className="text-burnt-muted text-sm">
						Escribe para buscar {tab === "players" ? "jugadores" : "estudios"}
					</p>
				</div>
			) : results.length === 0 ? (
				<div className="py-16 text-center">
					<p className="mb-1 text-lg font-semibold text-burnt-text">Sin resultados</p>
					<p className="text-sm text-burnt-muted">
						No hay {tab === "players" ? "jugadores" : "estudios"} con ese nombre
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{results.map((item) => (
						<Link
							key={item.name}
							to={
								tab === "players"
									? `/customer/${encodeURIComponent(item.name)}`
									: `/developer/${encodeURIComponent(item.name)}`
							}
							className="flex items-center gap-4 rounded-md border border-burnt-border bg-burnt-card p-4 transition-all hover:border-burnt-accent/50 hover:bg-burnt-panel"
						>
							<div className="h-10 w-10 flex-none overflow-hidden rounded-md">
								<AvatarImage
									src={`/api/${tab === "players" ? "customer" : "developer"}/${encodeURIComponent(item.name)}/image/profile`}
									alt={item.name}
									name={item.name}
								/>
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate font-semibold text-burnt-text">{item.name}</p>
								{item.country && (
									<p className="text-xs text-burnt-muted">{item.country.native_name}</p>
								)}
								{tab === "developers" && item.website_url && (
									<p className="truncate text-xs text-burnt-accent">{item.website_url}</p>
								)}
							</div>
							<p className="flex-none text-xs text-burnt-faint">
								Desde{" "}
								{item.created_at
									? new Date(item.created_at).toLocaleDateString("es-ES", {
											year: "numeric",
											month: "short",
										})
									: "—"}
							</p>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
