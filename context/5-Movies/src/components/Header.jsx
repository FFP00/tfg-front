import app from "../modules/App.module.css"

import { Link } from "react-router"

export default function Header(){
    return(
         <header>
            <Link to="/">
               <h1 className={app}>
                    Movies
               </h1>
            </Link>
         </header>        
    )
}