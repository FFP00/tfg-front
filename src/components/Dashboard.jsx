import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTitle from "./Dashboard/CreateTitle.jsx";
import EditDeveloperProfile from "./Dashboard/EditDeveloperProfile.jsx";
import MyTitles from "./Dashboard/MyTitles.jsx";

export default function Dashboard() {
	const navigate = useNavigate();
	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const [developer, setDeveloper] = useState(
		JSON.parse(localStorage.getItem("burnt_user") ?? "null")
	);

	const [titles, setTitles] = useState([]);
	const [genres, setGenres] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState("titles");
	const [editingTitle, setEditingTitle] = useState(null);

	async function loadTitles() {
		try {
			const res = await axios.get("/api/title/me", {
				headers: { Authorization: `Bearer ${token}` }
			});
			setTitles(res.data);
		} catch (error) {
			console.error(error);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only auth redirect
	useEffect(() => {
		if (!token || type !== "developer") {
			navigate("/login");
			return;
		}
		async function init() {
			try {
				const [genresRes] = await Promise.all([axios.get("/api/genre/"), loadTitles()]);
				setGenres(genresRes.data);
			} catch (error) {
				console.error(error);
			}
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

	function handleEdit(title) {
		setEditingTitle(title);
		setTab("create");
	}

	function handleSaved(titleData) {
		if (editingTitle) {
			handleTitleUpdated(titleData);
		} else {
			handleTitleCreated(titleData);
		}
		setEditingTitle(null);
		setTab("titles");
	}

	const tabBar = (
		<div className="mb-6 flex gap-1 border-b border-burnt-border">
			<button
				type="button"
				onClick={() => {
					setEditingTitle(null);
					setTab("titles");
				}}
				className={`px-5 pb-3 text-sm font-medium transition-colors ${
					tab === "titles"
						? "border-b-2 border-burnt-accent text-burnt-text"
						: "text-burnt-faint hover:text-burnt-muted"
				}`}
			>
				Informacion
				{titles.length > 0 && (
					<span className="ml-1.5 rounded-full bg-burnt-panel px-1.5 py-0.5 text-xs text-burnt-faint">
						{titles.length}
					</span>
				)}
			</button>
			<button
				type="button"
				onClick={() => {
					setEditingTitle(null);
					setTab("create");
				}}
				className={`px-5 pb-3 text-sm font-medium transition-colors ${
					tab === "create"
						? "border-b-2 border-burnt-accent text-burnt-text"
						: "text-burnt-faint hover:text-burnt-muted"
				}`}
			>
				{editingTitle ? "Editar título" : "Nuevo título"}
			</button>
		</div>
	);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold text-burnt-text">Dashboard</h1>

			{loading ? (
				<div className="flex justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
				</div>
			) : tab === "create" ? (
				<>
					{tabBar}
					<CreateTitle
						key={editingTitle?.name ?? "new"}
						token={token}
						genres={genres}
						editTitle={editingTitle}
						onCreated={handleSaved}
					/>
				</>
			) : (
				<>
					{tabBar}
					<div className="grid grid-cols-3 gap-6">
						<div className="col-span-1">
							{developer && (
								<EditDeveloperProfile
									developer={developer}
									token={token}
									onUpdate={() => {
										const updated = JSON.parse(localStorage.getItem("burnt_user") ?? "null");
										if (updated) setDeveloper(updated);
									}}
								/>
							)}
						</div>
						<div className="col-span-2 overflow-hidden rounded-lg bg-burnt-panel p-3">
							<MyTitles titles={titles} onEdit={handleEdit} />
						</div>
					</div>
				</>
			)}
		</div>
	);
}
