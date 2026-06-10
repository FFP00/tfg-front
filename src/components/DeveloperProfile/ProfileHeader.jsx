import { useState } from "react";
import AvatarImage from "../ui/AvatarImage.jsx";

export default function ProfileHeader({ developer }) {
	const [bannerError, setBannerError] = useState(false);

	return (
		<div className="overflow-hidden rounded-lg border border-burnt-border bg-burnt-card">
			<div className="relative h-40 overflow-hidden bg-burnt-panel">
				{bannerError ? (
					<div className="h-full w-full bg-linear-to-br from-burnt-panel via-burnt-surface to-burnt-bg" />
				) : (
					<img
						src={`/api/developer/${developer.name}/image/banner`}
						alt="Banner"
						className="h-full w-full object-cover"
						onError={() => setBannerError(true)}
					/>
				)}
				<div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-burnt-card to-transparent" />
			</div>
			<div className="px-6 pb-6">
				<div className="relative z-10 -mt-10 mb-4 h-20 w-20 overflow-hidden rounded-md border-4 border-burnt-card">
					<AvatarImage
						src={`/api/developer/${developer.name}/image/profile`}
						alt={developer.name}
						name={developer.name}
					/>
				</div>
				<h1 className="text-2xl font-bold text-burnt-text">{developer.name}</h1>
				<div className="mt-3 space-y-1.5">
					<a
						href={`mailto:${developer.support_email}`}
						className="flex items-center gap-2 text-sm text-burnt-muted transition-colors hover:text-burnt-text"
					>
						{developer.support_email}
					</a>
					{developer.website_url && (
						<a
							href={developer.website_url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-burnt-accent transition-colors hover:text-burnt-accent-hover"
						>
							{developer.website_url}
						</a>
					)}
				</div>
				<p className="mt-3 text-xs text-burnt-faint">
					Desarrollador desde{" "}
					{developer.created_at
						? new Date(developer.created_at).toLocaleDateString("es-ES", {
								year: "numeric",
								month: "long"
							})
						: "—"}
				</p>
			</div>
		</div>
	);
}
