import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function DepositSuccess() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get("session_id");

	const token = localStorage.getItem("burnt_token");
	const type = localStorage.getItem("burnt_type");

	const [status, setStatus] = useState("loading");
	const [wallet, setWallet] = useState(null);
	const [error, setError] = useState(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only verify
	useEffect(() => {
		if (!token || type !== "customer") {
			navigate("/login");
			return;
		}
		if (!sessionId) {
			navigate("/me/deposit");
			return;
		}
		async function verify() {
			let res;
			let data;
			try {
				res = await fetch(`/api/stripe/success?session_id=${sessionId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				data = await res.json();
			} catch {
				setError("Error de conexión con el servidor (500). Comprueba los logs del backend.");
				setStatus("error");
				return;
			}
			if (res.ok) {
				setWallet(data);
				localStorage.setItem("burnt_wallet", JSON.stringify(data));
				setStatus("ok");
				if (window.opener) {
					window.opener.postMessage(
						{ type: "stripe_success", wallet: data },
						window.location.origin,
					);
					setTimeout(() => window.close(), 1200);
				}
			} else {
				setError(data.detail ?? `Error ${res.status} al verificar el pago`);
				setStatus("error");
			}
		}
		verify();
	}, []);

	if (status === "loading") {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="text-center">
					<div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-burnt-border border-t-burnt-accent" />
					<p className="text-sm text-burnt-muted">Verificando pago...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-[60vh] items-center justify-center px-4">
			<div className="w-full max-w-sm">
				{status === "ok" ? (
					<div className="rounded-lg border border-burnt-green/30 bg-burnt-card p-8 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-burnt-green/15">
							<span className="text-3xl">✓</span>
						</div>
						<h1 className="mb-2 text-2xl font-bold text-burnt-green">¡Pago completado!</h1>
						<p className="mb-1 text-sm text-burnt-muted">Nuevo saldo en tu wallet</p>
						<p className="mb-6 text-4xl font-bold text-burnt-text">
							${parseFloat(wallet?.balance ?? 0).toFixed(2)}
						</p>
						<div className="flex gap-3">
							<Link
								to="/"
								className="flex-1 rounded-md border border-burnt-border py-2.5 text-center text-sm font-medium text-burnt-muted transition-colors hover:text-burnt-text"
							>
								Catálogo
							</Link>
							<Link
								to="/me"
								className="flex-1 rounded-md bg-burnt-accent py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
							>
								Mi cuenta
							</Link>
						</div>
					</div>
				) : (
					<div className="rounded-lg border border-burnt-red/30 bg-burnt-card p-8 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-burnt-red/15">
							<span className="text-3xl">✗</span>
						</div>
						<h1 className="mb-2 text-2xl font-bold text-burnt-red">Error en el pago</h1>
						<p className="mb-6 text-sm text-burnt-muted">{error}</p>
						<Link
							to="/me/deposit"
							className="block w-full rounded-md bg-burnt-accent py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover"
						>
							Intentar de nuevo
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
