import {Link} from "react-router-dom";
import "../css/NavigationBar.css"

function NavigationBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">Movie App</Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/likes" className="nav-link">Likes</Link>

        </div>
    </nav>
}

export default NavigationBar;