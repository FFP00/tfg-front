import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const [tab, setTab] = useState("customer");
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState("");
	const [form, setForm] = useState({ username: "", password: "" });
	const [code, setCode] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		setForm({ ...form, [e.target.id]: e.target.value });
	}

	function handleTab(t) {
		setTab(t);
		setStep(1);
		setError(null);
		setCode("");
	}

	async function handleStep1(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const body = new URLSearchParams({ username: form.username, password: form.password });
			const res = await axios.post(`/auth/${tab}/login`, body);
			if (res.status === 202) {
				setEmail(form.username);
				setStep(2);
			}
		} catch (error) {
			setError(error.response?.data?.detail ?? "Error al iniciar sesión");
		}
		setLoading(false);
	}

	async function handleStep2(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await axios.post(`/auth/${tab}/verify`, { email, code });
			const data = res.data;
			localStorage.setItem("burnt_token", data.access_token);
			localStorage.setItem("burnt_type", tab);
			if (tab === "customer") {
				localStorage.setItem("burnt_user", JSON.stringify(data.customer));
				if (data.wallet) {
					localStorage.setItem("burnt_wallet", JSON.stringify(data.wallet));
				}
			} else {
				localStorage.setItem("burnt_user", JSON.stringify(data.developer));
			}
			navigate(tab === "developer" ? "/dashboard" : "/");
		} catch (error) {
			setError(error.response?.data?.detail ?? "Código incorrecto. Vuelve a iniciar sesión.");
			if (error.response?.status === 400) {
				setStep(1);
				setCode("");
			}
		}
		setLoading(false);
	}

	return (
		<div className="flex min-h-[85vh] items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-burnt-text">
						<span className="text-burnt-accent">Burnt</span>
					</h1>
					<p className="mt-1 text-sm text-burnt-muted">La tienda de juegos Open-Source</p>
				</div>

				<div className="mb-4 flex overflow-hidden rounded-md border border-burnt-border bg-burnt-surface">
					{["customer", "developer"].map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => handleTab(t)}
							className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
								tab === t ? "bg-burnt-accent text-white" : "text-burnt-muted hover:text-burnt-text"
							}`}
						>
							{t === "customer" ? "Jugador" : "Desarrollador"}
						</button>
					))}
				</div>

				<div className="rounded-md border border-burnt-border bg-burnt-card p-6 shadow-xl shadow-black/30">
					{step === 1 ? (
						<form onSubmit={handleStep1} className="space-y-4">
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="username">
									Usuario o correo electrónico
								</label>
								<input
									id="username"
									type="text"
									value={form.username}
									onChange={handleChange}
									required
									autoComplete="username"
									placeholder="Nombre de usuario o dirección de correo"
									className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
								/>
							</div>
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="password">
									Contraseña
								</label>
								<input
									id="password"
									type="password"
									value={form.password}
									onChange={handleChange}
									required
									autoComplete="current-password"
									placeholder="••••••••"
									className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
								/>
							</div>
							{error && (
								<p className="rounded-lg border border-burnt-red/30 bg-burnt-red/10 px-4 py-2.5 text-sm text-burnt-red">
									{error}
								</p>
							)}
							<button
								type="submit"
								disabled={loading}
								className="mt-2 w-full rounded-lg bg-burnt-accent py-2.5 font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
							>
								{loading ? "Verificando..." : "Continuar"}
							</button>
						</form>
					) : (
						<form onSubmit={handleStep2} className="space-y-4">
							<div className="rounded-lg border border-burnt-border bg-burnt-panel px-4 py-3 text-center text-sm text-burnt-muted">
								Código enviado al correo
							</div>
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="code">
									Código de verificación
								</label>
								<input
									id="code"
									type="text"
									value={code}
									onChange={(e) => setCode(e.target.value.toUpperCase())}
									required
									maxLength={4}
									autoComplete="one-time-code"
									placeholder="————"
									className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-center text-xl font-bold tracking-[0.5em] text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
								/>
								<p className="mt-1 text-xs text-burnt-faint">El código es insensible a mayúsculas</p>
							</div>
							{error && (
								<p className="rounded-lg border border-burnt-red/30 bg-burnt-red/10 px-4 py-2.5 text-sm text-burnt-red">
									{error}
								</p>
							)}
							<button
								type="submit"
								disabled={loading}
								className="mt-2 w-full rounded-lg bg-burnt-accent py-2.5 font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
							>
								{loading ? "Verificando..." : "Iniciar sesión"}
							</button>
							<button
								type="button"
								onClick={() => {
									setStep(1);
									setError(null);
									setCode("");
								}}
								className="w-full rounded-lg border border-burnt-border py-2.5 text-sm text-burnt-muted transition-colors hover:text-burnt-text"
							>
								← Volver e intentar de nuevo
							</button>
						</form>
					)}
				</div>

				<p className="mt-6 text-center text-sm text-burnt-muted">
					¿No tienes cuenta?{" "}
					<Link
						to="/register"
						className="font-medium text-burnt-accent transition-colors hover:text-burnt-accent-hover"
					>
						Registrarse
					</Link>
				</p>
			</div>
		</div>
	);
}
