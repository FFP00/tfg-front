import empty from "../modules/Empty.module.css";
import moviesGrid from "../modules/MoviesGrid.module.css";

import { useEffect, useState } from "react";
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component";

import MovieCard from "./MovieCard";
import Spinner from "./Spinner";

export default function MoviesGrid(){

    const [movies,setMovies] = useState([])
    const [filteredMovies,setFilteredMovies] = useState([])
    const [hasMore,setHasMore] = useState(true);
    const [next,setNext] = useState(4)

    function handleLoad() {
        const newNext = next + 4;

        setFilteredMovies(movies.slice(0, newNext));
        setNext(newNext);

        if (newNext >= movies.length) {
            setHasMore(false);
        }
    }


    async function getData(){
        try {
        const res = await axios.get(
            "/data/movies.json"
        );

        return res.data;

        } catch (error) {
        console.error(error);
        }
    };

    useEffect(()=>{
        
        async function fetchData() {
        const data = await getData(); 
        setMovies(data); 
        setFilteredMovies(data.slice(0, 4))
        }

        fetchData();   

    },[])    

    return(
        <>

            <InfiniteScroll 
                dataLength={filteredMovies.length} 
                next={handleLoad} 
                hasMore={hasMore} 
                loader={<Spinner />}>

                <ul className={moviesGrid.moviesGrid}>
                    <MovieCard movies={filteredMovies}/>
                </ul>

            </InfiniteScroll>        
        </>
    )
}



