export default function Button({handleLoad}){
    return(
        <>
            <button onClick={handleLoad} className="button">
                Load More
            </button>
        </>
    )
}