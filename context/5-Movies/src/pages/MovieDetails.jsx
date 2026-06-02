import movieDetails from "../modules/MovieDetails.module.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import Spinner from "../components/Spinner";

export default function MovieDetails(){

    const [params] = useSearchParams(); 
    const id = params.get("id");

    return(
        <>
        
        </>
    )
}
