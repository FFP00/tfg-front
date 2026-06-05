import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthImage({ src, alt, className, onError }) {
	const [url, setUrl] = useState(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (!src) {
			setFailed(true);
			onError?.();
			return;
		}
		let objectUrl = null;
		setUrl(null);
		setFailed(false);
		const token = localStorage.getItem("burnt_token");
		fetch(src, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
			.then((res) => {
				if (!res.ok) throw new Error("not ok");
				return res.blob();
			})
			.then((blob) => {
				objectUrl = URL.createObjectURL(blob);
				setUrl(objectUrl);
			})
			.catch(() => {
				setFailed(true);
				onError?.();
			});
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [src]);

	if (failed) {
		return (
			<div className={`flex h-full w-full items-center justify-center bg-burnt-panel ${className ?? ""}`}>
				<ImageIcon size={32} strokeWidth={1.5} className="text-burnt-faint" aria-hidden />
			</div>
		);
	}

	if (!url) {
		return <div className={`h-full w-full bg-burnt-panel ${className ?? ""}`} />;
	}

	return <img src={url} alt={alt} className={`h-full w-full object-cover ${className ?? ""}`} />;
}
