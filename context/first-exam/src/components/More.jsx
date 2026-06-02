export default function More({ visible, setVisible, total }) {

    function handleLoadMore() {
        setVisible(visible + 4);
    }

    function handleShowLess() {
        setVisible(8);
    }

    if (visible < total) {
        return (
            <section className="morebar" aria-label="Load more">
                <button 
                    className="morebar__btn" 
                    type="button" 
                    style={{minWidth: "180px", letterSpacing: "0.4px"}}
                    onClick={handleLoadMore}
                >
                    Load More
                </button>
            </section>
        );
    }

    if (visible >= total && total > 8) {
        return (
            <section className="morebar" aria-label="Load more">
                <button 
                    className="morebar__btn" 
                    type="button" 
                    style={{minWidth: "180px", letterSpacing: "0.4px"}}
                    onClick={handleShowLess}
                >
                    Show Less
                </button>
            </section>
        );
    }

}

