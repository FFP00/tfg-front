export default function Search({handleFilter, inputRef}){
    return(
        <>
            <input type="text" onChange={handleFilter} ref={inputRef} placeholder="Search a Coin" className="form-control bg-dark text-light border-0 mt-4 text-center" />
        </>
    )
}