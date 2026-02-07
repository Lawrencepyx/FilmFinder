import MovieDisplay from "../components/MovieDisplay";
import {useState, useEffect} from "react";
import {findMovies, fetchPopularMovies} from "../services/api";
import "../css/Home.css";

function Home() {
    /*always like this live updates when you change the state*/
    /*everytime we type something in the search bar, this updates*/
    /*when a state changes occurs, the entire components reran or re-rendered*/
    /*whenever rerendered, if not using in state, it will be lost*/
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]); // Store original list
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default"); // default, rating, release_date

    /*use effect is a hook that runs a function when the component loads or when a dependency changes*/
    /*if changed*/
    useEffect(() => {
        /*fetch popular movies when the component loads*/
        const loadPopularMovies = async() => {
            try {
                const popularMovies = await fetchPopularMovies()
                setAllMovies(popularMovies)
                setMovies(popularMovies)

            } catch (error) {
                console.log(error)
                setError("Failed to load popular movies")
            }
            finally {
                setLoading(false)
            }
        }
    loadPopularMovies()
    }, [])
    const handleSearch = async (e) =>{
        e.preventDefault()

        if (!searchQuery.trim()) return
        setLoading(true)
        if (loading) return

        setSearchQuery("")
        try{
            const searchResults = await findMovies(searchQuery)
            setAllMovies(searchResults)
            setMovies(searchResults)
            setError(null)

        }catch (error) {
            console.log(error)
            setError("Failed to search for movies")

        } finally{
            setLoading(false)
        }
        setSearchQuery("")

    };
    
    // Sort function
    const handleSort = (sortType) => {
        setSortBy(sortType)
        let sortedMovies = [...allMovies]
        
        switch(sortType) {
            case 'rating':
                sortedMovies.sort((a, b) => b.vote_average - a.vote_average)
                break
            case 'rating_low':
                sortedMovies.sort((a, b) => a.vote_average - b.vote_average)
                break
            case 'release_date':
                sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                break
            case 'release_date_old':
                sortedMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                break
            default:
                sortedMovies = [...allMovies] // Keep original order
        }
        
        setMovies(sortedMovies)
    };
    /*map is a function that takes in a array and iterates and deals with every element the function is a jsx code*/
    /*dynamical rendering*/
    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for movies..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            
            {/* Filter Section */}
            <div className="filter-section">
                <label htmlFor="sort-select" className="filter-label">Sort by:</label>
                <select 
                    id="sort-select"
                    className="filter-select" 
                    value={sortBy} 
                    onChange={(e) => handleSort(e.target.value)}
                >
                    <option value="default">Default</option>
                    <option value="rating">Rating (High to Low)</option>
                    <option value="rating_low">Rating (Low to High)</option>
                    <option value="release_date">Release Date (Newest)</option>
                    <option value="release_date_old">Release Date (Oldest)</option>
                </select>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-array">
                    <div className="movie-array">
                        {movies.map((movie) => (
                            <MovieDisplay movie={movie} key={movie.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;