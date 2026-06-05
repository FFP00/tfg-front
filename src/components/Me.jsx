import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "./Me/EditProfile";
import FriendsCard from "./Me/FriendsCard";
import ProfileCard from "./Me/ProfileCard";
import WalletCard from "./Me/WalletCard";

export default function Me() {
	const navigate = useNavigate();
	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");

	const [customer, setCustomer] = useState(null);
	const [wallet, setWallet] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deactivating, setDeactivating] = useState(false);
	const [confirmDeactivate, setConfirmDeactivate] = useState(false);

	async function handleDeactivate() {
		setDeactivating(true);
		const res = await fetch("/api/customer/me", {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (res.status === 204) {
			localStorage.removeItem("burnt_token");
			localStorage.removeItem("burnt_type");
			localStorage.removeItem("burnt_user");
			localStorage.removeItem("burnt_wallet");
			navigate("/");
		}
		setDeactivating(false);
	}

	async function fetchMe() {
		const res = await fetch("/api/customer/me", {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) {
			navigate("/login");
			return;
		}
		const data = await res.json();
		setCustomer(data.customer);
		setWallet(data.wallet);
		localStorage.setItem("burnt_user", JSON.stringify(data.customer));
		if (data.wallet) localStorage.setItem("burnt_wallet", JSON.stringify(data.wallet));
		setLoading(false);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only auth redirect
	useEffect(() => {
		if (!token || type !== "customer") {
			navigate("/login");
			return;
		}
		fetchMe();
	}, []);

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold text-burnt-text">Mi cuenta</h1>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-1">
					<ProfileCard customer={customer} token={token} onUpdate={fetchMe} />
					<WalletCard wallet={wallet} />
				</div>

				<div className="space-y-6 lg:col-span-2">
					<EditProfile customer={customer} token={token} onUpdate={fetchMe} />
					<FriendsCard token={token} customerName={customer.name} />

					<div className="rounded-lg border border-burnt-red/20 bg-burnt-card p-5">
						<p className="mb-4 text-sm font-semibold text-burnt-text">Zona de peligro</p>

						{confirmDeactivate ? (
							<div className="flex gap-3">
								<button
									type="button"
									onClick={handleDeactivate}
									disabled={deactivating}
									className="flex items-center gap-2 rounded-lg bg-burnt-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burnt-red-hover disabled:opacity-50"
								>
									<Trash2 size={16} strokeWidth={1.75} />
									{deactivating ? "Desactivando…" : "Confirmar desactivación"}
								</button>
								<button
									type="button"
									onClick={() => setConfirmDeactivate(false)}
									className="rounded-lg border border-burnt-border px-4 py-2 text-sm text-burnt-muted transition-colors hover:text-burnt-text"
								>
									Cancelar
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => setConfirmDeactivate(true)}
								className="flex items-center gap-2 rounded-lg border border-burnt-red/40 px-4 py-2 text-sm font-medium text-burnt-red transition-colors hover:border-burnt-red hover:bg-burnt-red/10"
							>
								<Trash2 size={16} strokeWidth={1.75} />
								Desactivar cuenta
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
