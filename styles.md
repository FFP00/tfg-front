# Guía de estilo de código

Cualquier código nuevo o refactor debe seguir estas reglas para que parezca escrito por mí.

---

## 1. Filosofía

- Código **directo y legible**, sin abstracciones innecesarias ni "clever code".
- Stack: **React + Vite**, **Tailwind**, **axios**, **react-router-dom**. No usar tecnologías que no estén ya en el proyecto.
- Sin **TypeScript** ni **PropTypes**.

---

## 2. Estructura de archivos

- `src/main.jsx` (entry) · `src/App.jsx` (rutas).
- `src/components/` con componentes en **PascalCase.jsx**.
- Patrón de subcarpeta por página: `PageX.jsx` + `PageX/` con sus subcomponentes.
- Estilos globales en `src/styles/`. Sin barriles `index.js`.

---

## 3. Estructura interna de un componente

Orden fijo:

1. Imports: estilos → librerías externas (`react`, `axios`, `react-router-dom`) → componentes/utilidades locales.
2. `export default function Componente({ props }) {` **inline** (nunca `export` al final).
3. `useState` → `useRef` → handlers → `async getData/fetch` → `useEffect` → `return`.

```jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card.jsx";

export default function Ejemplo({ id }) {
  const [data, setData] = useState([]);

  async function getData() {
    try {
      const res = await axios.get(`/api/algo/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const d = await getData();
      setData(d);
    }
    fetchData();
  }, []);

  return <Card>{/* ... */}</Card>;
}
```

- Componentes y handlers como **`function` / `async function`** (no arrow). Callbacks inline sí pueden ser arrow.
- Props **desestructuradas** en los parámetros.

---

## 4. Convenciones de nombres

- Componentes: `PascalCase`. Variables/funciones: `camelCase`. **En inglés.**
- Handlers: `handleX` (`handleSubmit`, `handleDelete`).
- Refs: `xRef` (`inputRef`, `mapRef`).
- Fetching: `getData` / `fetchData`.
- Clases CSS de utilidades JS reutilizables: constantes en `UPPER_SNAKE` solo cuando son datos/estructuras reales, no para alias triviales.

---

## 5. Reglas duras de sintaxis (lo que NUNCA hago)

- **Sin doble negación `!!`.** Uso `Boolean(x)` o comparación explícita (`x !== null`).
- **Sin concatenar strings con `+`.** Uso **template literals** cuando hay interpolación (`` `Bearer ${token}` ``); para texto estático, un único string literal.
- **Sin constantes de módulo triviales** (p. ej. `const TOKEN_KEY = "..."`): inline el valor (`localStorage.getItem("gv_jwt")`).
- **Sin helpers de una línea que sean alias** (p. ej. `isAuthed()` que solo envuelve otra cosa): inline en el sitio de uso.

---

## 6. Estado y hooks

- Estado reactivo con **`useState`** (controlado) cuando el valor afecta al render.
- **`useRef`** para: referencias a DOM, valores mutables que no deben re-renderizar, e inputs **no controlados** de lectura-en-submit (leer `ref.current.value` en el handler). No forzar `useRef` donde el valor sí dirige el render.
- `useEffect` con función `async` anidada para cargar datos; dependencias mínimas.

---

## 7. Datos / HTTP

- **Siempre axios**, nunca `fetch` nativo.
- Patrón base: `const res = await axios.get(url); return res.data;` dentro de `try/catch` con `console.error(error)`.

---

## 8. Navegación

- **Toda la navegación con React Router**: `<Link>` / `<NavLink>` para enlaces, `useNavigate` para navegación programática. Nunca `<a href>` interno ni `window.location`.
- Las tarjetas/filas clicables son `<Link>` reales (dan clic-central / ctrl-clic / "abrir en pestaña nueva" nativos).

---

## 9. Estilado / Tailwind

- **Sin responsividad.** La app se usa solo a **1920×1080 (16:9)**: nada de prefijos `sm:`/`md:`/`lg:`/`xl:`/`2xl:`. Para cada propiedad se deja el valor que se ve a 1920x1080.

---

## 10. Formato (biome)

- Comillas **dobles**, **punto y coma** siempre, indentación de **2 espacios**, ancho de línea **100**.

---

## 11. Código muerto

- Eliminación **agresiva**: imports/variables/funciones sin usar, exports nunca consumidos, props que el hijo ya no usa, archivos huérfanos. Antes de borrar archivos, listarlos.

---

## 12. Resumen de "nunca"

`!!` · concatenar con `+` · constantes de módulo triviales · helpers alias de una línea · spreads condicionales · `fetch` nativo · `window.location` · `<a>` interno · prefijos responsive · TypeScript/PropTypes · componentes con arrow function.
