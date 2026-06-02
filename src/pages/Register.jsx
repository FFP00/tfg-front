import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
	const navigate = useNavigate();
	const [tab, setTab] = useState("customer");
	const [countries, setCountries] = useState([]);
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		country_code: "",
		support_email: "",
		website_url: "",
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetch("/api/country/")
			.then((r) => r.json())
			.then(setCountries);
	}, []);

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

		const body =
			tab === "customer"
				? {
						name: form.name,
						email: form.email,
						password: form.password,
						country_code: form.country_code,
					}
				: {
						name: form.name,
						email: form.email,
						password: form.password,
						support_email: form.support_email,
						website_url: form.website_url || null,
					};

		const res = await fetch(`/auth/${tab}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (res.status === 201) {
			navigate("/login");
		} else {
			const data = await res.json();
			setError(data.detail ?? "Error al registrarse");
		}
		setLoading(false);
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				<h1 className="mb-2 text-center text-3xl font-bold text-burnt-text">Burnt</h1>
				<p className="mb-8 text-center text-sm text-burnt-muted">Crea tu cuenta gratuita</p>

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
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="name">
								{tab === "customer" ? "Nombre de usuario" : "Nombre del estudio"}
							</label>
							<input
								id="name"
								type="text"
								value={form.name}
								onChange={handleChange}
								required
								placeholder={tab === "customer" ? "johndoe" : "Mi Estudio"}
								className="w-full rounded-lg border border-burnt-border bg-burnt-bg px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="email">
								{tab === "customer" ? "Email" : "Email privado (acceso)"}
							</label>
							<input
								id="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								required
								placeholder="correo@ejemplo.com"
								className="w-full rounded-lg border border-burnt-border bg-burnt-bg px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
							/>
						</div>

						{tab === "developer" && (
							<>
								<div>
									<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="support_email">
										Email de soporte (público)
									</label>
									<input
										id="support_email"
										type="email"
										value={form.support_email}
										onChange={handleChange}
										required
										placeholder="soporte@miestudio.com"
										className="w-full rounded-lg border border-burnt-border bg-burnt-bg px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
									/>
								</div>
								<div>
									<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="website_url">
										Sitio web (opcional)
									</label>
									<input
										id="website_url"
										type="url"
										value={form.website_url}
										onChange={handleChange}
										placeholder="https://miestudio.com"
										className="w-full rounded-lg border border-burnt-border bg-burnt-bg px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
									/>
								</div>
							</>
						)}

						{tab === "customer" && (
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="country_code">
									País
								</label>
								<select
									id="country_code"
									value={form.country_code}
									onChange={handleChange}
									required
									className="w-full rounded-lg border border-burnt-border bg-burnt-bg px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
								>
									<option value="">Selecciona tu país</option>
									{countries.map((c) => (
										<option key={c.code} value={c.code}>
											{c.name} ({c.en_name})
										</option>
									))}
								</select>
							</div>
						)}

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
							<p className="mt-1 text-xs text-burnt-muted/60">
								Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 especial
							</p>
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
							{loading ? "Creando cuenta..." : "Crear cuenta"}
						</button>
					</form>
				</div>

				<p className="mt-6 text-center text-sm text-burnt-muted">
					¿Ya tienes cuenta?{" "}
					<Link
						to="/login"
						className="font-medium text-burnt-accent transition-colors hover:text-burnt-accent-hover"
					>
						Iniciar sesión
					</Link>
				</p>
			</div>
		</div>
	);
}
