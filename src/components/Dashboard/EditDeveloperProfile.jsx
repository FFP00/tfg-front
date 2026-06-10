import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

export default function EditDeveloperProfile({ developer, token, onUpdate }) {
	const [countries] = useState(() => JSON.parse(localStorage.getItem("burnt_countries") ?? "[]"));

	const [form, setForm] = useState({
		name: developer.name ?? "",
		email: developer.email ?? "",
		support_email: developer.support_email ?? "",
		website_url: developer.website_url ?? "",
		password: "",
		confirmPassword: "",
		country_code: developer.country?.code ?? ""
	});
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [msg, setMsg] = useState(null);
	const profileRef = useRef(null);
	const bannerRef = useRef(null);

	function handleChange(e) {
		setForm({ ...form, [e.target.id]: e.target.value });
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setMsg(null);

		if (form.password && form.password !== form.confirmPassword) {
			setMsg({ type: "err", text: "Las contraseñas no coinciden" });
			return;
		}

		setLoading(true);

		const body = {};
		if (form.name !== developer.name) body.name = form.name;
		if (form.email !== developer.email) body.email = form.email;
		if (form.support_email !== developer.support_email) body.support_email = form.support_email;
		if (form.website_url !== (developer.website_url ?? ""))
			body.website_url = form.website_url || null;
		if (form.country_code !== (developer.country?.code ?? "")) body.country_code = form.country_code;
		if (form.password) body.password = form.password;

		if (Object.keys(body).length === 0) {
			setMsg({ type: "err", text: "No hay cambios que guardar" });
			setLoading(false);
			return;
		}

		try {
			const res = await axios.patch("/api/developer/me", body, {
				headers: { Authorization: `Bearer ${token}` }
			});
			localStorage.setItem("burnt_user", JSON.stringify(res.data));
			setMsg({ type: "ok", text: "Perfil actualizado correctamente" });
			setForm({ ...form, password: "", confirmPassword: "" });
			onUpdate();
		} catch (error) {
			setMsg({ type: "err", text: error.response?.data?.detail ?? "Error al actualizar" });
		}
		setLoading(false);
	}

	async function handleImageUpload(field, file) {
		setUploading(true);
		const formData = new FormData();
		formData.append(field, file);
		try {
			await axios.patch("/api/developer/me/image", formData, {
				headers: { Authorization: `Bearer ${token}` }
			});
		} catch (error) {
			console.error(error);
		}
		setUploading(false);
		onUpdate();
	}

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-lg border border-burnt-border bg-burnt-card">
				<button
					type="button"
					className="group relative h-32 w-full cursor-pointer bg-burnt-panel"
					onClick={() => bannerRef.current?.click()}
				>
					<img
						src={`/api/developer/${developer.name}/image/banner`}
						alt="Banner"
						className="h-full w-full object-cover"
						onError={(e) => {
							e.target.style.display = "none";
						}}
					/>
					<div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
						<span className="hidden text-sm font-medium text-white group-hover:block">
							Cambiar banner
						</span>
					</div>
					<input
						ref={bannerRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => e.target.files[0] && handleImageUpload("banner", e.target.files[0])}
					/>
				</button>
				<div className="px-5 pb-5">
					<button
						type="button"
						className="group relative -mt-8 mb-3 h-16 w-16 cursor-pointer overflow-hidden rounded-md border-4 border-burnt-card bg-burnt-panel"
						onClick={() => profileRef.current?.click()}
					>
						<img
							src={`/api/developer/${developer.name}/image/profile`}
							alt={developer.name}
							className="h-full w-full object-cover"
							onError={(e) => {
								e.target.style.display = "none";
							}}
						/>
						<div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50">
							<span className="hidden text-xs text-white group-hover:block">✎</span>
						</div>
						<input
							ref={profileRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => e.target.files[0] && handleImageUpload("profile", e.target.files[0])}
						/>
					</button>
					{uploading && <p className="mb-1 text-xs text-burnt-muted">Subiendo imagen...</p>}
					<p className="font-semibold text-burnt-text">{developer.name}</p>
					<p className="text-xs text-burnt-faint">{developer.country?.native_name ?? "—"}</p>
				</div>
			</div>

			<div className="rounded-lg border border-burnt-border bg-burnt-card">
				<div className="px-5 py-4">
					<span className="font-semibold text-burnt-text">Editar perfil del estudio</span>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4 border-t border-burnt-border px-5 pb-5 pt-4">
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="name">
							Nombre del estudio
						</label>
						<input
							id="name"
							type="text"
							value={form.name}
							onChange={handleChange}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="email">
							Email privado (acceso)
						</label>
						<input
							id="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="support_email">
							Email de soporte (público)
						</label>
						<input
							id="support_email"
							type="email"
							value={form.support_email}
							onChange={handleChange}
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
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
							placeholder="https://tu-estudio.com"
							className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="country_code">
							País
						</label>
						<div className="relative">
							<select
								id="country_code"
								value={form.country_code}
								onChange={handleChange}
								className="w-full appearance-none rounded-lg border border-burnt-border bg-burnt-panel py-2.5 pl-4 pr-9 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
							>
								<option value="">Sin especificar</option>
								{countries.map((c) => (
									<option key={c.code} value={c.code}>
										{c.native_name} ({c.english_name})
									</option>
								))}
							</select>
							<ChevronDown
								size={14}
								strokeWidth={1.75}
								className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-burnt-faint"
							/>
						</div>
					</div>

					<div className="border-t border-burnt-border/50 pt-4">
						<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-burnt-faint">
							Cambiar contraseña
						</p>
						<div className="space-y-3">
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="password">
									Nueva contraseña
								</label>
								<input
									id="password"
									type="password"
									value={form.password}
									onChange={handleChange}
									autoComplete="new-password"
									placeholder="••••••••"
									className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:border-burnt-accent focus:outline-none"
								/>
							</div>
							<div>
								<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="confirmPassword">
									Repetir contraseña
								</label>
								<input
									id="confirmPassword"
									type="password"
									value={form.confirmPassword}
									onChange={handleChange}
									autoComplete="new-password"
									placeholder="••••••••"
									className={`w-full rounded-lg border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text placeholder-burnt-faint focus:outline-none ${
										form.confirmPassword && form.password !== form.confirmPassword
											? "border-burnt-red/60 focus:border-burnt-red"
											: "border-burnt-border focus:border-burnt-accent"
									}`}
								/>
								{form.confirmPassword && form.password !== form.confirmPassword && (
									<p className="mt-1 text-xs text-burnt-red">Las contraseñas no coinciden</p>
								)}
							</div>
						</div>
					</div>

					{msg && (
						<p
							className={`rounded-lg px-4 py-2.5 text-sm ${
								msg.type === "ok"
									? "border border-burnt-green/30 bg-burnt-green/10 text-burnt-green"
									: "border border-burnt-red/30 bg-burnt-red/10 text-burnt-red"
							}`}
						>
							{msg.text}
						</p>
					)}
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-burnt-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-accent-hover disabled:opacity-50"
					>
						{loading ? "Guardando..." : "Guardar cambios"}
					</button>
				</form>
			</div>
		</div>
	);
}
