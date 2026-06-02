import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

import MoviesGrid from "../components/MoviesGrid";
import Search from "../components/Search";


export default function LandingPage(){
    return(
        <>
            <Search />
            <MoviesGrid />
        </>
    )
}