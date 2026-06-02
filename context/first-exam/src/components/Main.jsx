import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";

export default function Main({quesos,handleDelete,handleFilter,selectRef,minRef,maxRef}){
    return(
      <main>

        <div className="panel">
          <div className="panel__row">
            <input className="panel__field" id="min-price" placeholder="Min Price" type="number" ref={minRef}/>
            <input className="panel__field" id="max-price" placeholder="Max Price" type="number" ref={maxRef}/>
            <select className="panel__field" id="fat-filter" ref={selectRef}>
                <option value="">Fat Content (All)</option>
                <option value="low">Low (≤ 25%)</option>
                <option value="medium">Medium (&lt; 30%)</option>
                <option value="high">High (≥ 30%)</option>
            </select>
            <button className="btn-action" id="apply-filters" onClick={() => handleFilter()}>Filter</button></div>
          <div className="panel__row"><input className="panel__field" id="pairing-search" placeholder="Search by Pairing" type="text"/></div>
        </div>

        <section className="product-matrix" id="grid-cheeses">
            {quesos.map( queso => 
                <article className="product-tile">
                    <img alt="Brie" src={queso.img}/>
                    <h3>Name: {queso.name}</h3>
                    <h4>Origin: {queso.origin}</h4>
                    <h4>Pairing: {queso.characteristics.pairing}</h4>
                    <h4>Age: {queso.characteristics.age}</h4>
                    <h4>Fat Content: {queso.characteristics.content}%</h4>
                    <div className="item-price">
                        <span className="item-price__label">Price:</span>
                        <span className="item-price__old">€{queso.price.price}</span>
                        <span className="item-price__new">€{Math.round(queso.price.price - (queso.price.price  * queso.price.discount / 100))}</span>
                        <span className="item-price__badge">-{queso.price.discount}%</span>
                    </div>
                    <div className="star">
                      {queso.stars.map(element => {
                        if(element == 1){
                          return <FaStar color="yellow" />
                        }else if(element == 0.5){
                          return <FaStarHalfStroke color="yellow" />
                        }else{
                          return <FaRegStar />
                        }
                      })}
                    </div>
                    <div className="scoreline">
                    </div>
                    <button className="btn-action" onClick={() => handleDelete(queso.id)}>Delete</button>
                </article>
            
            )}
        </section>

      </main>
    )
}