import { ChevronDown, ChevronUp } from "lucide-react";
import { useRef, useState } from "react";

export default function EditDeveloperProfile({ developer, token, onUpdate }) {
	const [countries] = useState(() => JSON.parse(localStorage.getItem("burnt_countries") ?? "[]"));

	const [form, setForm] = useState({
		name: developer.name ?? "",
		email: developer.email ?? "",
		support_email: developer.support_email ?? "",
		website_url: developer.website_url ?? "",
		password: "",
		country_code: developer.country?.code ?? "",
	});
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [msg, setMsg] = useState(null);
	const [openEdit, setOpenEdit] = useState(false);
	const profileRef = useRef(null);
	const bannerRef = useRef(null);

	function handleChange(e) {
		setForm({ ...form, [e.target.id]: e.target.value });
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);

		const body = {};
		if (form.name !== developer.name) body.name = form.name;
		if (form.email !== developer.email) body.email = form.email;
		if (form.support_email !== developer.support_email) body.support_email = form.support_email;
		if (form.website_url !== (developer.website_url ?? ""))
			body.website_url = form.website_url || null;
		if (form.country_code !== (developer.country?.code ?? ""))
			body.country_code = form.country_code;
		if (form.password) body.password = form.password;

		if (Object.keys(body).length === 0) {
			setMsg({ type: "err", text: "No hay cambios que guardar" });
			setLoading(false);
			return;
		}

		const res = await fetch("/api/developer/me", {
			method: "PATCH",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify(body),
		});
		const data = await res.json();

		if (res.ok) {
			localStorage.setItem("burnt_user", JSON.stringify(data));
			setMsg({ type: "ok", text: "Perfil actualizado correctamente" });
			setForm({ ...form, password: "" });
			onUpdate();
		} else {
			setMsg({ type: "err", text: data.detail ?? "Error al actualizar" });
		}
		setLoading(false);
	}

	async function handleImageUpload(field, file) {
		setUploading(true);
		const formData = new FormData();
		formData.append(field, file);
		await fetch("/api/developer/me/image", {
			method: "PATCH",
			headers: { Authorization: `Bearer ${token}` },
			body: formData,
		});
		setUploading(false);
		onUpdate();
	}

	return (
		<div className="space-y-4">
			{/* Image card */}
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
						className="group relative -mt-8 mb-3 h-16 w-16 cursor-pointer overflow-hidden rounded-full border-4 border-burnt-card bg-burnt-panel"
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

			{/* Edit form */}
			<div className="rounded-lg border border-burnt-border bg-burnt-card">
				<button
					type="button"
					onClick={() => setOpenEdit(!openEdit)}
					className="flex w-full items-center justify-between px-5 py-4 text-left"
				>
					<span className="font-semibold text-burnt-text">Editar perfil del estudio</span>
					{openEdit ? (
						<ChevronUp size={16} strokeWidth={1.75} className="text-burnt-muted" />
					) : (
						<ChevronDown size={16} strokeWidth={1.75} className="text-burnt-muted" />
					)}
				</button>

				{openEdit && (
					<form
						onSubmit={handleSubmit}
						className="space-y-4 border-t border-burnt-border px-5 pb-5 pt-4"
					>
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
							<select
								id="country_code"
								value={form.country_code}
								onChange={handleChange}
								className="w-full rounded-lg border border-burnt-border bg-burnt-panel px-4 py-2.5 text-sm text-burnt-text focus:border-burnt-accent focus:outline-none"
							>
								<option value="">Sin especificar</option>
								{countries.map((c) => (
									<option key={c.code} value={c.code}>
										{c.native_name} ({c.english_name})
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1.5 block text-sm text-burnt-muted" htmlFor="password">
								Nueva contraseña{" "}
								<span className="text-burnt-faint">(dejar vacío para no cambiar)</span>
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
				)}
			</div>
		</div>
	);
}
