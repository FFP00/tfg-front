import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTitle from "./Dashboard/CreateTitle";
import EditDeveloperProfile from "./Dashboard/EditDeveloperProfile";
import MyTitles from "./Dashboard/MyTitles";

export default function Dashboard() {
	const navigate = useNavigate();
	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const developer = JSON.parse(localStorage.getItem("burnt_user") ?? "null");

	const [titles, setTitles] = useState([]);
	const [genres, setGenres] = useState([]);
	const [loading, setLoading] = useState(true);

	async function loadTitles() {
		const res = await fetch("/api/title/me", {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (res.ok) setTitles(await res.json());
	}

	useEffect(() => {
		if (!token || type !== "developer") {
			navigate("/login");
			return;
		}
		async function init() {
			const [genresRes] = await Promise.all([fetch("/api/genre/"), loadTitles()]);
			if (genresRes.ok) setGenres(await genresRes.json());
			setLoading(false);
		}
		init();
	}, []);

	function handleTitleCreated(newTitle) {
		setTitles((prev) => [newTitle, ...prev]);
	}

	function handleTitleUpdated(updated) {
		setTitles((prev) => prev.map((t) => (t.name === updated.name ? updated : t)));
	}

	const published = titles.filter((t) => t.status);
	const pending = titles.filter((t) => !t.status);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-8 flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-burnt-text">Dashboard</h1>
					<p className="mt-1 text-sm text-burnt-muted">{developer?.name ?? "Desarrollador"}</p>
				</div>
				<div className="flex gap-3 text-center">
					<div className="rounded-md border border-burnt-border bg-burnt-card px-4 py-3">
						<p className="text-2xl font-bold text-burnt-text">{published.length}</p>
						<p className="text-xs text-burnt-muted">Publicados</p>
					</div>
					<div className="rounded-md border border-burnt-border bg-burnt-card px-4 py-3">
						<p className="text-2xl font-bold text-burnt-yellow">{pending.length}</p>
						<p className="text-xs text-burnt-muted">Pendientes</p>
					</div>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div className="lg:col-span-1">
						{developer && (
							<EditDeveloperProfile
								developer={developer}
								token={token}
								onUpdate={() => {
									const updated = JSON.parse(localStorage.getItem("burnt_user") ?? "null");
									if (updated) window.location.reload();
								}}
							/>
						)}
					</div>

					<div className="space-y-6 lg:col-span-2">
						<CreateTitle token={token} onCreated={handleTitleCreated} />

						<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
							<h2 className="mb-5 text-base font-semibold text-burnt-text">Mis títulos</h2>
							<MyTitles
								titles={titles}
								genres={genres}
								token={token}
								onUpdate={handleTitleUpdated}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
