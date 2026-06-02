export default function Header(){
    return(
        <header>
            <h1 style={{textTransform: "uppercase", letterSpacing: "0.6px"}}>🧀 Welcome to the Cheese Shop</h1>
            <nav className="site-nav">
                <ul>
                    <li><a className="site-nav__link site-nav__link--current" href="/">All</a></li>
                    <li><a className="site-nav__link" href="/aged">Aged</a></li>
                    <li><a className="site-nav__link" href="/blue">Blue</a></li>
                    <li><a className="site-nav__link" href="/brined">Brined</a></li>
                    <li><a className="site-nav__link" href="/fresh">Fresh</a></li>
                    <li><a className="site-nav__link" href="/hard">Hard</a></li>
                    <li><a className="site-nav__link" href="/semi-soft">Semi-soft</a></li>
                    <li><a className="site-nav__link" href="/soft">Soft</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}