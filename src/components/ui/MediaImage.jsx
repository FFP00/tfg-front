import { ImageIcon } from "lucide-react";
import { useState } from "react";

export default function MediaImage({ src, alt, className = "" }) {
	const [error, setError] = useState(false);

	if (error || !src) {
		return (
			<div className={`flex h-full w-full items-center justify-center bg-burnt-panel ${className}`}>
				<ImageIcon size={32} strokeWidth={1.5} className="text-burnt-faint" />
			</div>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			loading="lazy"
			className="h-full w-full object-cover"
			onError={() => setError(true)}
		/>
	);
}
