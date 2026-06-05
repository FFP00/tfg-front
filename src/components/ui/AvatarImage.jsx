import { useState } from "react";

export default function AvatarImage({ src, alt, name, className = "" }) {
	const [error, setError] = useState(false);

	if (error || !src) {
		return (
			<div
				className={`flex h-full w-full items-center justify-center bg-burnt-accent/20 font-bold text-burnt-accent ${className}`}
			>
				{(name?.[0] ?? "?").toUpperCase()}
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
