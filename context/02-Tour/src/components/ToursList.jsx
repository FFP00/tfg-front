import Tours from "./Tour.jsx";

export default function ToursList({tours,removeTour}){
  return (
    <section>
      <div className="title">
        <h2>our tours</h2>
        <div className="underline"></div>
      </div>
      <section className="grid-tours">
        {[...tours].flatMap( object => 

          <Tours 
            id={object.id}
            name={object.name}
            info={object.info}
            image={object.image}
            price={object.price}
            removeTour={removeTour}
          />

        )}
      </section>
    </section>
  );
}