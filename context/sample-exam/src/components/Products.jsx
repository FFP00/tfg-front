export default function Products({productos,handleDelete}){
    return(
        <>
        {productos.map(products => 
            <article className="card">
                <div className="offer">{products.offer}%</div>
                <div className="info-1">
                <img src={products.img} alt=""/>
                <h3>{products.type}</h3>
                <h4>{products.name}</h4>
            </div>
            <div className="info2">
                <div className="showcase-rating">
                    {products.stars.map(estrellas =>
                        {estrellas}
                    )}
                </div>
                <div className="price-box">
                <p className="price">{products.price - (products.price * products.offer / 100 )} &euro; <del>{products.price} &euro;</del> </p>
                <button>Add</button>
                <button onClick={() => handleDelete(products.id)}>Delete</button>
                </div>
            </div>
            </article>
        )}
        </>
    )
}