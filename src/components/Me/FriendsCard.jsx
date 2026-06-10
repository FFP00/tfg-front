import axios from "axios";
import { Check, UserMinus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FriendsCard({ token, customerName }) {
	const [friends, setFriends] = useState([]);
	const [pending, setPending] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState("friends");
	const [actionError, setActionError] = useState({});

	useEffect(() => {
		async function load() {
			try {
				const [friendsRes, pendingRes] = await Promise.all([
					axios.get(`/api/customer/${encodeURIComponent(customerName)}/friends`),
					axios.get("/api/friendship/pending", {
						headers: { Authorization: `Bearer ${token}` }
					})
				]);
				setFriends(friendsRes.data);
				setPending(pendingRes.data);
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		}
		load();
	}, [token, customerName]);

	async function handleAccept(name) {
		setActionError((prev) => ({ ...prev, [name]: null }));
		try {
			await axios.patch(
				`/api/friendship/${encodeURIComponent(name)}`,
				{ status: "accepted" },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setPending((prev) => prev.filter((p) => p.from_name !== name));
			setFriends((prev) => [...prev, { name }]);
		} catch (error) {
			setActionError((prev) => ({
				...prev,
				[name]: error.response?.data?.detail ?? "Error"
			}));
		}
	}

	async function handleDecline(name) {
		setActionError((prev) => ({ ...prev, [name]: null }));
		try {
			await axios.delete(`/api/friendship/${encodeURIComponent(name)}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setPending((prev) => prev.filter((p) => p.from_name !== name));
		} catch (error) {
			setActionError((prev) => ({
				...prev,
				[name]: error.response?.data?.detail ?? "Error"
			}));
		}
	}

	async function handleRemove(name) {
		setActionError((prev) => ({ ...prev, [name]: null }));
		try {
			await axios.delete(`/api/friendship/${encodeURIComponent(name)}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setFriends((prev) => prev.filter((f) => f.name !== name));
		} catch (error) {
			setActionError((prev) => ({
				...prev,
				[name]: error.response?.data?.detail ?? "Error"
			}));
		}
	}

	return (
		<div className="rounded-lg border border-burnt-border bg-burnt-card">
			<div className="flex items-center gap-2 px-5 py-4">
				<Users size={16} strokeWidth={1.75} className="text-burnt-muted" />
				<span className="font-semibold text-burnt-text">Amigos</span>
			</div>

			<div className="flex border-t border-burnt-border">
				<button
					type="button"
					onClick={() => setTab("friends")}
					className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
						tab === "friends"
							? "border-b-2 border-burnt-accent text-burnt-text"
							: "text-burnt-faint hover:text-burnt-muted"
					}`}
				>
					Amigos
					{!loading && friends.length > 0 && (
						<span className="rounded-full bg-burnt-panel px-1.5 py-0.5 text-xs text-burnt-faint">
							{friends.length}
						</span>
					)}
				</button>
				<button
					type="button"
					onClick={() => setTab("pending")}
					className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
						tab === "pending"
							? "border-b-2 border-burnt-accent text-burnt-text"
							: "text-burnt-faint hover:text-burnt-muted"
					}`}
				>
					Pendientes
					{!loading && pending.length > 0 && (
						<span className="rounded-full bg-burnt-accent/20 px-1.5 py-0.5 text-xs text-burnt-accent">
							{pending.length}
						</span>
					)}
				</button>
			</div>

			<div className="border-t border-burnt-border">
				{loading ? (
					<div className="flex justify-center py-8">
						<div className="h-5 w-5 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
					</div>
				) : tab === "friends" ? (
					friends.length === 0 ? (
						<p className="px-5 py-8 text-center text-sm text-burnt-faint">Sin amigos todavía</p>
					) : (
						<div className="divide-y divide-burnt-border/50">
							{friends.map((f) => (
								<div key={f.name} className="flex items-center justify-between px-5 py-3">
									<Link
										to={`/customer/${encodeURIComponent(f.name)}`}
										className="text-sm font-medium text-burnt-text transition-colors hover:text-burnt-accent"
									>
										{f.name}
									</Link>
									<div className="flex flex-col items-end gap-1">
										<button
											type="button"
											onClick={() => handleRemove(f.name)}
											title="Eliminar amigo"
											className="text-burnt-faint transition-colors hover:text-burnt-red"
										>
											<UserMinus size={15} strokeWidth={1.75} />
										</button>
										{actionError[f.name] && <p className="text-xs text-burnt-red">{actionError[f.name]}</p>}
									</div>
								</div>
							))}
						</div>
					)
				) : pending.length === 0 ? (
					<p className="px-5 py-8 text-center text-sm text-burnt-faint">Sin solicitudes pendientes</p>
				) : (
					<div className="divide-y divide-burnt-border/50">
						{pending.map((p) => (
							<div key={p.from_name} className="px-5 py-3">
								<div className="flex items-center justify-between gap-3">
									<Link
										to={`/customer/${encodeURIComponent(p.from_name)}`}
										className="text-sm font-medium text-burnt-text transition-colors hover:text-burnt-accent"
									>
										{p.from_name}
									</Link>
									<div className="flex items-center gap-1.5">
										<button
											type="button"
											onClick={() => handleAccept(p.from_name)}
											className="flex items-center gap-1 rounded-md border border-burnt-green/40 px-2.5 py-1 text-xs text-burnt-green transition-colors hover:bg-burnt-green/10"
										>
											<Check size={12} strokeWidth={2} />
											Aceptar
										</button>
										<button
											type="button"
											onClick={() => handleDecline(p.from_name)}
											className="rounded-md border border-burnt-border px-2.5 py-1 text-xs text-burnt-muted transition-colors hover:border-burnt-red/40 hover:text-burnt-red"
										>
											Rechazar
										</button>
									</div>
								</div>
								{actionError[p.from_name] && (
									<p className="mt-1 text-xs text-burnt-red">{actionError[p.from_name]}</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
