import { useRef, useState } from 'react'
import { useEffect } from 'react'

import Top from './components/Top'
import Header from './components/Header'
import Hero from './components/Hero'
import Products from './components/Products'
import Footer from './components/Footer'
import Formulario from './components/Formulario'
import { nanoid } from 'nanoid';

export default function App() {

  const [productos,setProductos] = useState([]);
  const [productosFiltrados,setProductosFiltrados] = useState(null);
  const inputRef = useRef(null)
  const productRef = useRef(null)
  const codeRef = useRef(null)

  function handleChange(){
    setProductosFiltrados(productos.filter( objeto =>
        (objeto.name.toLowerCase().includes(inputRef.current.value.toLowerCase()))
      )
    )
  }

  function handleDelete(id){
    setProductos(
      [...productos].filter( products => !(products.id == id) )
    )
  }

  function handleSubmit(e){
    e.preventDefault();
    setProductos(prev => [...prev,
      {
        id : nanoid(),
        name : productRef.current.value,
        offer : codeRef.current.value
      }])
  }

    async function fetchProducts(){
      const data = await fetch("/data/products.json");
      const json = await data.json()
      setProductos(json)
  }

  useEffect(() => {
    const productosLocal = localStorage.getItem("productosLocal");
    if(productosLocal){
      const parsed = JSON.parse(productosLocal);
      (Array.isArray(parsed) && parsed.length > 0) ? setProductos(parsed) : fetchProducts();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productosLocal",JSON.stringify(productos));
  },[productos]);

  return (
    <>
      <div id="page">
        <Top />
        <Header 
          handleChange={handleChange}
          inputRef={inputRef}
        />
        <Hero />
        <section className="product-grid">
          <Products 
            productos={productosFiltrados ? productosFiltrados : productos }
            handleDelete={handleDelete}
          />
        </section>

        <Formulario 
          productRef={productRef}
          codeRef={codeRef}
          handleSubmit={handleSubmit}
        />
        <Footer />
      </div>
    </>
  )
}
