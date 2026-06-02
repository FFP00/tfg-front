export default function Card({casas,load}){
    return(
        <>
            <ul className="card-grid">
            {casas.slice(0,load).map( (casa) =>  
                <li>
                    <article className="card">
                        <div className="card-image">
                        <img alt="Mallorca cube" src={"/assets/" + casa.photo} />
                        </div>
                        <div className="card-content">
                        <h2 className="card-name">{casa.name}</h2>
                        <h2 className="card-name">{casa.price}€</h2>
                        </div>
                    </article>
                </li>
            )}
            </ul>  
        </>
    )
}   