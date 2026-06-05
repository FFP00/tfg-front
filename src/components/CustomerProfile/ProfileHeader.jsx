import AvatarImage from "../ui/AvatarImage";
import MediaImage from "../ui/MediaImage";

export default function ProfileHeader({ customer }) {
	return (
		<div className="overflow-hidden rounded-lg border border-burnt-border bg-burnt-card">
			{/* Banner */}
			<div className="relative h-36 overflow-hidden bg-burnt-panel">
				<MediaImage src={`/api/customer/${customer.name}/image/banner`} alt="Banner" />
				<div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-burnt-card to-transparent" />
			</div>

			{/* Info */}
			<div className="px-5 pb-5">
				<div className="relative z-10 -mt-10 mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-burnt-card">
					<AvatarImage
						src={`/api/customer/${customer.name}/image/profile`}
						alt={customer.name}
						name={customer.name}
					/>
				</div>
				<h1 className="text-xl font-bold text-burnt-text">{customer.name}</h1>
				{customer.country && (
					<p className="mt-1 text-sm text-burnt-muted">{customer.country.native_name}</p>
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
