import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Library from "./CustomerProfile/Library.jsx";
import ProfileHeader from "./CustomerProfile/ProfileHeader.jsx";
import ReviewsList from "./CustomerProfile/ReviewsList.jsx";
import AvatarImage from "./ui/AvatarImage.jsx";

export default function CustomerProfile() {
	const { name } = useParams();
	const navigate = useNavigate();

	const [customer, setCustomer] = useState(null);
	const [library, setLibrary] = useState([]);
	const [friends, setFriends] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [activeTab, setActiveTab] = useState("library");
	const [loading, setLoading] = useState(true);
	const [friendMsg, setFriendMsg] = useState(null);

	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");
	const me = JSON.parse(localStorage.getItem("burnt_user") ?? "null");

	useEffect(() => {
		async function load() {
			try {
				const [profileRes, libraryRes, friendsRes, reviewsRes] = await Promise.all([
					axios.get(`/api/customer/${name}`),
					axios.get(`/api/customer/${name}/library`).catch(() => ({ data: [] })),
					axios.get(`/api/customer/${name}/friends`).catch(() => ({ data: [] })),
					axios.get(`/api/customer/${name}/reviews`).catch(() => ({ data: [] }))
				]);
				setCustomer(profileRes.data);
				setLibrary(libraryRes.data);
				setFriends(friendsRes.data);
				setReviews(reviewsRes.data);
			} catch {
				navigate("/");
				return;
			}
			setLoading(false);
		}
		load();
	}, [name, navigate]);

	async function handleAddFriend() {
		if (!token || type !== "customer") return;
		setFriendMsg(null);
		try {
			const res = await axios.post(`/api/friendship/${encodeURIComponent(name)}`, null, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (res.status === 201) {
				setFriendMsg({ type: "ok", text: "Solicitud enviada" });
			}
		} catch (err) {
			setFriendMsg({
				type: "err",
				text: err.response?.data?.detail ?? "No se pudo enviar la solicitud"
			});
		}
	}

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
			</div>
		);
	}

	const tabs = [
		{ id: "library", label: `Biblioteca (${library.length})` },
		{ id: "friends", label: `Amigos (${friends.length})` },
		{ id: "reviews", label: `Reseñas (${reviews.length})` }
	];

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6 grid grid-cols-3 gap-6">
				<div className="col-span-1">
					<ProfileHeader customer={customer} />
					{token && type === "customer" && me?.name !== name && (
						<div className="mt-3 space-y-2">
							<button
								type="button"
								onClick={handleAddFriend}
								disabled={friendMsg?.type === "ok"}
								className="w-full rounded-md border border-burnt-border py-2.5 text-sm font-medium text-burnt-muted transition-colors hover:border-burnt-accent hover:text-burnt-text disabled:opacity-50"
							>
								{friendMsg?.type === "ok" ? "✓ Solicitud enviada" : "+ Añadir amigo"}
							</button>
						</div>
					)}
				</div>

				<div className="col-span-2">
					<div className="mb-4 flex gap-1 rounded-md border border-burnt-border bg-burnt-surface p-1">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
									activeTab === tab.id
										? "bg-burnt-card text-burnt-text"
										: "text-burnt-muted hover:text-burnt-text"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>

					<div className="rounded-lg border border-burnt-border bg-burnt-card p-5">
						{activeTab === "library" && <Library titles={library} />}
						{activeTab === "friends" && (
							<div className="space-y-2">
								{friends.length === 0 ? (
									<p className="py-4 text-center text-sm text-burnt-muted">Sin amigos</p>
								) : (
									friends.map((f) => (
										<Link
											key={f.name}
											to={`/customer/${f.name}`}
											className="flex items-center gap-3 rounded-md border border-burnt-border p-3 transition-colors hover:border-burnt-accent/50"
										>
											<div className="h-8 w-8 flex-none overflow-hidden rounded-md">
												<AvatarImage src={`/api/customer/${f.name}/image/profile`} alt={f.name} name={f.name} />
											</div>
											<span className="text-sm font-medium text-burnt-text">{f.name}</span>
										</Link>
									))
								)}
							</div>
						)}
						{activeTab === "reviews" && <ReviewsList reviews={reviews} />}
					</div>
				</div>
			</div>
		</div>
	);
}
