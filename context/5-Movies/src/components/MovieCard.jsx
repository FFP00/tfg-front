import movieCard from "../modules/MovieCard.module.css";

import { Link } from "react-router-dom";

export default function MovieCard({movies}){
    return(
        <>
            {movies.map( (movie) => 
                <li class={movieCard.movieCard}>
                    <Link to={`/movies?id=${movie.id}`} >
                        <img width="230" height="345" className={movieCard.movieImage} src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                        <div>{movie.title}</div>
                    </Link>
                </li>
            )}
        </>
    )
}