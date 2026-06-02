import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const [tab, setTab] = useState("customer");
	const [form, setForm] = useState({ username: "", password: "" });
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		setForm({ ...form, [e.target.id]: e.target.value });
	}

	function handleTab(t) {
		setTab(t);
		setError(null);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const body = new URLSearchParams({ username: form.username, password: form.password });
		const res = await fetch(`/auth/${tab}/login`, { method: "POST", body });
		const data = await res.json();
		if (res.ok) {
			localStorage.setItem("burnt_token", data.access_token);
			localStorage.setItem("burnt_type", tab);
			navigate("/");
		} else {
			setError(data.detail ?? "Error al iniciar sesión");
		}
		setLoading(false);
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4">
			<div className="w-full max-w-md">
				<h1 className="mb-2 text-center text-3xl font-bold text-burnt-text">Burnt</h1>
				<p className="mb-8 text-center text-sm text-burnt-muted">La tienda de juegos open-source</p>

				<div className="mb-6 flex overflow-hidden rounded-lg border border-burnt-border">
					{["customer", "developer"].map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => handleTab(t)}
							className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
								tab === t
									? "bg-burnt-accent text-white"
									: "bg-burnt-card text-burnt-muted hover:text-burnt-text"
							}`}
						>
							{t === "customer" ? "Jugador" : "Desarrollador"}
						</button>
					))}
				</div>

				<div className="rounded-xl border border-burnt-border bg-burnt-card p-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="username">
								{tab === "customer" ? "Nombre de usuario o email" : "Email"}
							</label>
							<input
								id="username"
								type="text"
								value={form.username}
								onChange={handleChange}
								required
								placeholder={tab === "customer" ? "usuario o correo" : "correo@estudio.com"}
								className="w-full rounded-lg border border-burnt-border bg-burnt-bg px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
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
								placeholder="••••••••"
								className="w-full rounded-lg border border-burnt-border bg-burnt-bg px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
							/>
						</div>
						{error && (
							<p className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-2.5 text-sm text-red-400">
								{error}
							</p>
						)}
						<button
							type="submit"
							disabled={loading}
							className="mt-2 w-full rounded-lg bg-burnt-accent py-2.5 font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
						>
							{loading ? "Entrando..." : "Iniciar sesión"}
						</button>
					</form>
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
