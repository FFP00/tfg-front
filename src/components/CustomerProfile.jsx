import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Library from "./CustomerProfile/Library";
import ProfileHeader from "./CustomerProfile/ProfileHeader";
import ReviewsList from "./CustomerProfile/ReviewsList";
import AvatarImage from "./ui/AvatarImage";

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
			const [profileRes, libraryRes, friendsRes, reviewsRes] = await Promise.all([
				fetch(`/api/customer/${name}`),
				fetch(`/api/customer/${name}/library`),
				fetch(`/api/customer/${name}/friends`),
				fetch(`/api/customer/${name}/reviews`),
			]);
			if (!profileRes.ok) {
				navigate("/");
				return;
			}
			setCustomer(await profileRes.json());
			if (libraryRes.ok) setLibrary(await libraryRes.json());
			if (friendsRes.ok) setFriends(await friendsRes.json());
			if (reviewsRes.ok) setReviews(await reviewsRes.json());
			setLoading(false);
		}
		load();
	}, [name, navigate]);

	async function handleAddFriend() {
		if (!token || type !== "customer") return;
		setFriendMsg(null);
		try {
			const res = await fetch(`/api/friendship/${encodeURIComponent(name)}`, {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.status === 201) {
				setFriendMsg({ type: "ok", text: "Solicitud enviada" });
			} else {
				const data = await res.json();
				setFriendMsg({ type: "err", text: data.detail ?? "No se pudo enviar la solicitud" });
			}
		} catch {
			setFriendMsg({ type: "err", text: "Error de conexión" });
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
		{ id: "reviews", label: `Reseñas (${reviews.length})` },
	];

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-1">
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

				<div className="lg:col-span-2">
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
												<AvatarImage
													src={`/api/customer/${f.name}/image/profile`}
													alt={f.name}
													name={f.name}
												/>
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
