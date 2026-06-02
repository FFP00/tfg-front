import {useState} from 'react';

export default function Tour({ id, image, info, name, price,removeTour}){
  // TODO: Set state 'readMore'
  const [readMore,setReadMore] = useState(false);

  return (
    <article className="single-tour">
      <img src={image} alt={name} />
      <footer>
        <div className="tour-info">
          <h4>{name}</h4>
          <h4 className="tour-price">{price}€</h4>
        </div>
        <p>
          {/* TODO: code "read more" funcionality */}
          {readMore ? info : info.substring(0,200)+"..."}
          <button className="on" onClick={() => setReadMore(!readMore)}>
            {readMore ? "Less" : "More"}
          </button>
        </p>
        {/* TODO: code click function (maybe with the name removeTour), in order to delete Tour */}
        <button className="delete-btn" onClick={() => removeTour(id)}>
          not interested
        </button>
      </footer>
    </article>
  );
}

