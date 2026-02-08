import "../css/Watched.css";
import {useMovieContext} from "../contexts/MovieContext"    
import MovieDisplay from "../components/MovieDisplay"

function Watched(){
    const {watched} = useMovieContext()
    
    /*display watched movies, if no watched movies, display message*/
    if (watched && watched.length > 0) {
        return (
            <div className="watched">
                <h2>Your Watched Movies</h2>
                    <div className="movies-array">
                            <div className="movie-array">
                                {watched.map((movie) => (
                                    <MovieDisplay movie={movie} key={movie.id} />
                                ))}
                            </div>
                </div>
            </div>
        );
    }
    return (
    <div className="watched-empty">
        <h2>You haven't marked any movies as watched yet.</h2>
        <p>Click on the 👁 button to mark movies as watched.</p>
    </div>
    );
}

export default Watched;
