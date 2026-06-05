import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
	{
		q: "¿Cómo funciona la compra de juegos?",
		a: "Los juegos se pagan con el saldo de tu wallet. Recarga tu saldo con Stripe y luego compra los juegos que quieras desde su ficha o desde el carrito. Una vez comprado, el juego es tuyo para siempre y aparece en tu biblioteca.",
	},
	{
		q: "¿Qué métodos de pago aceptáis para recargar saldo?",
		a: "Actualmente aceptamos tarjetas de crédito y débito a través de Stripe (Visa, Mastercard, American Express). El saldo se añade a tu wallet de forma instantánea tras el pago.",
	},
	{
		q: "¿Puedo pedir un reembolso?",
		a: "Las compras en Burnt son definitivas una vez procesadas. Si tienes un problema con un juego (no funciona, contenido engañoso), contacta con nosotros a través del formulario y lo evaluaremos caso a caso.",
	},
	{
		q: "¿Cómo publico un juego como desarrolladora?",
		a: "Crea una cuenta de desarrolladora, rellena los datos de tu estudio y espera la aprobación del equipo de Burnt (normalmente menos de 48h). Una vez aprobada, puedes crear títulos, subir multimedia y gestionar precios desde tu Dashboard.",
	},
	{
		q: "¿Los juegos tienen DRM?",
		a: "No. Burnt no impone ningún tipo de gestión de derechos digitales. Los desarrolladores son libres de añadir sus propios sistemas si lo desean, pero la plataforma no lo exige ni lo facilita.",
	},
	{
		q: "¿Qué comisión cobra Burnt a los desarrolladores?",
		a: "Burnt está en fase de desarrollo y actualmente opera sin comisión. En el futuro, la estructura de comisiones se publicará de forma transparente en esta misma página y en el repositorio del proyecto.",
	},
	{
		q: "¿Cómo funciona el sistema de reseñas?",
		a: "Solo los jugadores que poseen un juego pueden dejar una reseña. Cada reseña pasa por un proceso de moderación antes de ser visible públicamente. Otros jugadores pueden marcar reseñas como 'útiles'.",
	},
	{
		q: "¿El código de Burnt es realmente open-source?",
		a: "Sí. Tanto el frontend como el backend de Burnt son software libre. Puedes auditar el código, reportar vulnerabilidades o contribuir con mejoras a través de nuestro repositorio en GitHub.",
	},
	{
		q: "¿Cómo funciona el sistema de amigos?",
		a: "Puedes buscar a otros jugadores por nombre y enviarles una solicitud de amistad. Cuando la acepten, podréis ver vuestras bibliotecas y reseñas mutuamente desde vuestros perfiles públicos.",
	},
	{
		q: "¿Qué pasa si olvido mi contraseña?",
		a: "El login de Burnt usa verificación en dos pasos: tras introducir tu contraseña, recibirás un código de un solo uso en tu email. Si no recuerdas tu contraseña, usa el formulario de contacto para que el equipo te ayude.",
	},
];

export default function FAQ() {
	const [open, setOpen] = useState(null);

	function toggle(i) {
		setOpen(open === i ? null : i);
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-16">
			<div className="mb-12 text-center">
				<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-burnt-accent">
					Preguntas frecuentes
				</p>
				<h1 className="text-4xl font-bold tracking-tight text-burnt-text">FAQ</h1>
			</div>

			<div className="space-y-2">
				{FAQS.map((faq, i) => (
					<div
						key={faq.q}
						className="overflow-hidden rounded-md border border-burnt-border bg-burnt-card"
					>
						<button
							type="button"
							onClick={() => toggle(i)}
							className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
						>
							<span className="text-sm font-medium text-burnt-text">{faq.q}</span>
							<ChevronDown
								size={16}
								strokeWidth={1.75}
								className="flex-none text-burnt-faint transition-transform duration-200"
								style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
							/>
						</button>
						{open === i && (
							<div className="border-t border-burnt-border px-5 pb-5 pt-4">
								<p className="text-sm leading-relaxed text-burnt-muted">{faq.a}</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
