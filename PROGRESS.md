# Burnt Frontend - COMPLETADO

## Estilo adoptado
- function declarations (no arrow functions para componentes/handlers)
- handleChange genérico: `setForm({ ...form, [e.target.id]: e.target.value })`
- Sin Context API / sin Redux: estado local + localStorage
- Sin TypeScript / sin PropTypes
- Tailwind CSS con tokens burnt-*

## Decisiones de arquitectura
- **Cart**: estado en App.jsx (useState), persistido en localStorage "burnt_cart"
  - addToCart(game), removeFromCart(name), clearCart() definidas en App.jsx
  - Pasadas como props a Home, GameDetail, Cart
- **Datos globales**: preloaded en App.jsx useEffect → localStorage "burnt_genres", "burnt_countries", "burnt_currencies"
- **Navegación**: sidebar siempre (colapsable 16px/240px)
- **Home**: sin filtro → filas por género con scroll horizontal; con filtro → grid flat

## Archivos creados
- src/components/About.jsx
- src/components/FAQ.jsx
- src/components/Contact.jsx
- src/components/Cart.jsx
- src/components/Library.jsx (/me/library)
- src/components/CustomerSearch.jsx (/search/customers)
- src/components/DeveloperSearch.jsx (/search/developers)
- src/components/Home/GenreRow.jsx
- src/components/Dashboard/EditDeveloperProfile.jsx

## Archivos modificados
- src/App.jsx (cart state, preload, 9 rutas nuevas)
- src/components/Header.jsx (secciones Mi cuenta / Explorar / Info, badge carrito)
- src/components/Footer.jsx (3 columnas con links)
- src/components/Home.jsx (filas géneros + búsqueda)
- src/components/Home/FeaturedBanner.jsx (hero h-104, gradientes, botón carrito)
- src/components/Home/GameGrid.jsx (props cart/addToCart)
- src/components/GameCard.jsx (botón carrito on hover)
- src/components/GameDetail.jsx (props cart/addToCart a PurchaseCard)
- src/components/GameDetail/PurchaseCard.jsx (botón "Añadir al carrito" + "Comprar ahora")
- src/components/GameDetail/ReviewList.jsx (sort por created_at desc)
- src/components/Dashboard.jsx (layout 3 col con EditDeveloperProfile)

## Rutas disponibles
| Ruta | Componente | Auth |
|------|------------|------|
| / | Home | público |
| /game/:name | GameDetail | público |
| /login | Login | público |
| /register | Register | público |
| /me | Me | customer |
| /me/library | Library | customer |
| /me/deposit | Deposit | customer |
| /me/deposit/success | DepositSuccess | customer |
| /me/history | History | customer |
| /me/friends | Friends | customer |
| /cart | Cart | público (checkout requiere customer) |
| /customer/:name | CustomerProfile | público |
| /developer/:name | DeveloperProfile | público |
| /dashboard | Dashboard | developer |
| /about | About | público |
| /faq | FAQ | público |
| /contact | Contact | público |
| /search/customers | CustomerSearch | público |
| /search/developers | DeveloperSearch | público |

## Estado: ✅ COMPLETO - sin errores de lint
