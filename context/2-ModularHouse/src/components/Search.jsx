export default function Search({inputRef,handleFilter,selectRef}){
    return(
        <>
            <div className="search-wrapper">
                <input
                    placeholder="Search for..."
                    className="search-input"
                    type="text"
                    ref={inputRef}
                    onChange={handleFilter}
                />
            </div>

            <div className="select">
                <select className="select" ref={selectRef} onChange={handleFilter}>
                    <option value="">All</option>
                    <option value="wood">Filter by wood</option>
                    <option value="cement">Filter by cement</option>
                    <option value="steel frame">Filter by steel frame</option>
                </select>
            </div>
        </>
    )
}