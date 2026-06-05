import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AvatarImage from "./ui/AvatarImage";

export default function DeveloperSearch() {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function doSearch() {
			setLoading(true);
			const params = new URLSearchParams();
			if (search.trim()) params.set("search", search.trim());
			const res = await fetch(`/api/developer/?${params}`);
			if (res.ok) setResults(await res.json());
			else setResults([]);
			setLoading(false);
		}
		doSearch();
	}, [search]);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-8">
				<p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-burnt-accent">
					Comunidad
				</p>
				<h1 className="mb-4 text-2xl font-bold tracking-tight text-burnt-text">Desarrolladoras</h1>
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar estudio por nombre..."
					className="w-full rounded-md border border-burnt-border bg-burnt-panel px-4 py-3 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
				/>
			</div>

			{loading ? (
				<div className="flex justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
				</div>
			) : results.length === 0 ? (
				<div className="py-20 text-center">
					<p className="mb-2 text-4xl">⊕</p>
					<p className="text-lg font-semibold text-burnt-text">
						{search ? "Sin resultados" : "Escribe para buscar estudios"}
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{results.map((dev) => (
						<Link
							key={dev.name}
							to={`/developer/${encodeURIComponent(dev.name)}`}
							className="flex items-center gap-4 rounded-md border border-burnt-border bg-burnt-card p-4 transition-all hover:border-burnt-accent/50"
						>
							<div className="h-10 w-10 flex-none overflow-hidden rounded-full">
								<AvatarImage
									src={`/api/developer/${encodeURIComponent(dev.name)}/image/profile`}
									alt={dev.name}
									name={dev.name}
								/>
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate font-semibold text-burnt-text">{dev.name}</p>
								{dev.country && (
									<p className="text-xs text-burnt-muted">{dev.country.native_name}</p>
								)}
								{dev.website_url && (
									<p className="truncate text-xs text-burnt-accent">{dev.website_url}</p>
								)}
							</div>
							<p className="flex-none text-xs text-burnt-faint">
								Desde{" "}
								{dev.created_at
									? new Date(dev.created_at).toLocaleDateString("es-ES", {
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
