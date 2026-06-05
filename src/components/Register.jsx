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
		password_confirm: "",
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

		if (form.password !== form.password_confirm) {
			setError("Las contraseñas no coinciden");
			setLoading(false);
			return;
		}

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
						country_code: form.country_code,
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
		<div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-burnt-text">
						<span className="text-burnt-accent">Burnt</span>
					</h1>
					<p className="mt-1 text-sm text-burnt-muted">Crea tu cuenta gratuita</p>
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
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* 1. Nombre */}
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
								placeholder="Nombre visible en la plataforma"
								className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
							/>
						</div>

						{/* 2. Email principal */}
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="email">
								{tab === "customer" ? "Correo electrónico" : "Correo electrónico (acceso privado)"}
							</label>
							<input
								id="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								required
								placeholder="Dirección de correo electrónico"
								className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
							/>
						</div>

						{/* 3. Contraseña */}
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
								autoComplete="new-password"
								placeholder="••••••••"
								className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
							/>
						</div>

						{/* 4. Confirmar contraseña + info requisitos */}
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="password_confirm">
								Confirmar contraseña
							</label>
							<input
								id="password_confirm"
								type="password"
								value={form.password_confirm}
								onChange={handleChange}
								required
								autoComplete="new-password"
								placeholder="••••••••"
								className={`w-full rounded-lg border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:outline-none ${
									form.password_confirm && form.password !== form.password_confirm
										? "border-burnt-red focus:border-burnt-red"
										: "border-burnt-border focus:border-burnt-accent"
								}`}
							/>
							{form.password_confirm && form.password !== form.password_confirm ? (
								<p className="mt-1 text-xs text-burnt-red">Las contraseñas no coinciden</p>
							) : (
								<p className="mt-1 text-xs text-burnt-faint">
									Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 especial
								</p>
							)}
						</div>

						{/* 5. País */}
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="country_code">
								País
							</label>
							<select
								id="country_code"
								value={form.country_code}
								onChange={handleChange}
								required
								className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
							>
								<option value="">Selecciona tu país</option>
								{countries.map((c) => (
									<option key={c.code} value={c.code}>
										{c.native_name} ({c.english_name})
									</option>
								))}
							</select>
						</div>

						{/* 6. Campos específicos del desarrollador */}
						{tab === "developer" && (
							<>
								<div>
									<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="support_email">
										Correo de soporte (público)
									</label>
									<input
										id="support_email"
										type="email"
										value={form.support_email}
										onChange={handleChange}
										required
										placeholder="Correo de atención al público"
										className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
									/>
								</div>
								<div>
									<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="website_url">
										Sitio web <span className="text-burnt-faint">(opcional)</span>
									</label>
									<input
										id="website_url"
										type="url"
										value={form.website_url}
										onChange={handleChange}
										placeholder="https://tu-estudio.com"
										className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
									/>
								</div>
							</>
						)}

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
