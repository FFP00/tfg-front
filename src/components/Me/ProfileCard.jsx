import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import AvatarImage from "../ui/AvatarImage";

export default function ProfileCard({ customer, token, onUpdate }) {
	const profileRef = useRef(null);
	const bannerRef = useRef(null);
	const [uploading, setUploading] = useState(false);
	const [bannerError, setBannerError] = useState(false);
	const [imgVersion, setImgVersion] = useState(Date.now());

	async function handleImageUpload(field, file) {
		setUploading(true);
		const form = new FormData();
		form.append(field, file);
		await fetch("/api/customer/me/image", {
			method: "PATCH",
			headers: { Authorization: `Bearer ${token}` },
			body: form,
		});
		setUploading(false);
		if (field === "banner") setBannerError(false);
		setImgVersion(Date.now());
		onUpdate();
	}

	return (
		<div className="overflow-hidden rounded-lg border border-burnt-border bg-burnt-card">
			<button
				type="button"
				className="group relative h-36 w-full cursor-pointer overflow-hidden bg-burnt-panel"
				onClick={() => bannerRef.current?.click()}
			>
				{bannerError ? (
					<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-burnt-panel to-burnt-surface">
						<span className="text-xs text-burnt-faint">Subir banner</span>
					</div>
				) : (
					<img
						src={`/api/customer/${customer.name}/image/banner?v=${imgVersion}`}
						alt="Banner"
						className="h-full w-full object-cover"
						onError={() => setBannerError(true)}
					/>
				)}
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

			<div className="px-6 pb-6">
				<button
					type="button"
					className="group relative -mt-10 mb-4 h-20 w-20 cursor-pointer overflow-hidden rounded-md border-4 border-burnt-card"
					onClick={() => profileRef.current?.click()}
				>
					<AvatarImage
						src={`/api/customer/${customer.name}/image/profile?v=${imgVersion}`}
						alt={customer.name}
						name={customer.name}
					/>
					<div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50">
						<Pencil size={18} strokeWidth={1.75} className="hidden text-white group-hover:block" />
					</div>
					<input
						ref={profileRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => e.target.files[0] && handleImageUpload("profile", e.target.files[0])}
					/>
				</button>

				{uploading && <p className="mb-2 text-xs text-burnt-muted">Subiendo imagen...</p>}

				<h2 className="text-xl font-bold text-burnt-text">{customer.name}</h2>
				<p className="text-sm text-burnt-muted">{customer.email}</p>
				{customer.country && (
					<p className="mt-1 text-xs text-burnt-faint">
						{customer.country.native_name} · {customer.country.currency?.symbol ?? ""}
					</p>
				)}
				<p className="mt-1 text-xs text-burnt-faint">
					Miembro desde{" "}
					{customer.created_at
						? new Date(customer.created_at).toLocaleDateString("es-ES", {
								year: "numeric",
								month: "long",
							})
						: "—"}
				</p>
			</div>
		</div>
	);
}
