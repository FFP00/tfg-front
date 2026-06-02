export default function Formulario({handleSubmit,productRef,codeRef}){
    return(
     <form onSubmit={() => handleSubmit()} style={{ margin: "20px 0" }}>
        <input ref={productRef} type="text" name="product" placeholder="Enter your product name..." />
        <input ref={codeRef} type="text" name="code" placeholder="Enter your code name..." />
        <button type="submit">Enviar</button>
      </form>
    )
}