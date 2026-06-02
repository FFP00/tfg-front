export default function Table({monedas}) {
    return(
        <>
                <table className="table table-dark mt-4 table-hover">
                        <thead>
                            <tr>
                            <td>#</td>
                            <td>Coin</td>
                            <td>Price</td>
                            <td>Price Change</td>
                            <td>24h Volume</td>
                        </tr>
                    </thead>        	
                    <tbody>
          { monedas.map( (moneda,index) =>

                        <tr>
                            <td className="text-muted">{index++}</td>
                            <td>
                                <img src={moneda.image} alt="" className="img-fluid me-4" style={{ width: "3%" }} />
                                <span>{moneda.name}</span>
                                <span className="ms-3 text-muted">{moneda.symbol}</span>
                            </td>
                            <td>{moneda.current_price}$</td>
                            <td className="text-success">{moneda.price_change_24h}$</td>
                            <td>{moneda.total_volume}</td>
                        </tr>

            )}  
                    </tbody>
                </table>      
        </>
    )
}