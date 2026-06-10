import { Code2, Home, Users } from "lucide-react";

export default function About() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-16">
			<div className="mb-16 text-center">
				<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-burnt-accent">
					Sobre nosotros
				</p>
				<h1 className="mb-4 text-5xl font-bold tracking-tight text-burnt-text">
					Distribución digital <span className="text-burnt-accent">sin ataduras</span>
				</h1>
				<p className="mx-auto max-w-xl text-base leading-relaxed text-burnt-muted">
					Burnt nació de una idea sencilla: los juegos independientes merecen una plataforma que los
					trate con respeto. Sin algoritmos opacos, sin condiciones leoninas, sin intermediarios
					innecesarios.
				</p>
			</div>

			<div className="mb-16 grid grid-cols-3 gap-4">
				<div className="rounded-lg border border-burnt-border bg-burnt-card p-6 text-center">
					<p className="mb-1 text-4xl font-bold text-burnt-accent">0%</p>
					<p className="text-sm text-burnt-muted">Comisión para desarrolladores indie</p>
				</div>
				<div className="rounded-lg border border-burnt-border bg-burnt-card p-6 text-center">
					<p className="mb-1 text-4xl font-bold text-burnt-accent">100%</p>
					<p className="text-sm text-burnt-muted">Open-source y auditable</p>
				</div>
				<div className="rounded-lg border border-burnt-border bg-burnt-card p-6 text-center">
					<p className="mb-1 text-4xl font-bold text-burnt-accent">∞</p>
					<p className="text-sm text-burnt-muted">Juegos en tu biblioteca para siempre</p>
				</div>
			</div>

			<div className="mb-16 space-y-4">
				<h2 className="mb-6 text-xl font-bold tracking-tight text-burnt-text">En qué creemos</h2>
				<div className="flex gap-5 rounded-lg border border-burnt-border bg-burnt-card p-6">
					<Home size={20} strokeWidth={1.75} className="mt-0.5 flex-none text-burnt-accent" />
					<div>
						<h3 className="mb-1 font-semibold text-burnt-text">Distribución justa</h3>
						<p className="text-sm leading-relaxed text-burnt-muted">
							Creemos que los desarrolladores merecen quedarse con el fruto de su trabajo. Nuestra
							plataforma cobra una comisión mínima y transparente, sin cargos ocultos ni restricciones
							de DRM agresivas.
						</p>
					</div>
				</div>
				<div className="flex gap-5 rounded-lg border border-burnt-border bg-burnt-card p-6">
					<Users size={20} strokeWidth={1.75} className="mt-0.5 flex-none text-burnt-accent" />
					<div>
						<h3 className="mb-1 font-semibold text-burnt-text">Comunidad primero</h3>
						<p className="text-sm leading-relaxed text-burnt-muted">
							Burnt no es solo una tienda: es un espacio donde jugadores y desarrolladores se conectan,
							comparten reseñas y construyen relaciones duraderas más allá de la transacción económica.
						</p>
					</div>
				</div>
				<div className="flex gap-5 rounded-lg border border-burnt-border bg-burnt-card p-6">
					<Code2 size={20} strokeWidth={1.75} className="mt-0.5 flex-none text-burnt-accent" />
					<div>
						<h3 className="mb-1 font-semibold text-burnt-text">Código abierto</h3>
						<p className="text-sm leading-relaxed text-burnt-muted">
							Toda la plataforma —frontend, backend y API— es software libre. Cualquiera puede
							auditarla, contribuir o desplegarla. La transparencia no es una promesa: está en el
							código.
						</p>
					</div>
				</div>
			</div>

			<div className="mb-16 rounded-lg border border-burnt-border bg-burnt-card p-8">
				<h2 className="mb-4 text-xl font-bold tracking-tight text-burnt-text">Nuestra historia</h2>
				<div className="space-y-4 text-sm leading-relaxed text-burnt-muted">
					<p>
						Burnt empezó como un proyecto universitario en 2024. Un grupo de desarrolladores frustrados
						con las condiciones de las grandes plataformas decidieron crear una alternativa: una tienda
						donde el código fuera público, las reglas estuvieran claras y los creadores pudieran publicar
						sin depender de la aprobación de ningún comité corporativo.
					</p>
					<p>
						Hoy Burnt es una plataforma funcional con un sistema de autenticación en dos pasos, wallet
						integrada, soporte para Stripe, sistema de reseñas con moderación, biblioteca personal, red de
						amigos y un panel completo para desarrolladoras. Y seguimos creciendo.
					</p>
					<p>
						Si quieres participar —como jugador, como desarrolladora o como colaborador del proyecto— eres
						bienvenido/a. Esta plataforma es de todos.
					</p>
				</div>
			</div>
		</div>
	);
}
