import "../css/Likes.css";
import {useMovieContext} from "../contexts/MovieContext"    
import MovieDisplay from "../components/MovieDisplay"
/*npm install react-router-dom to use router, to add different pages*/
function Likes(){
    const {likes} = useMovieContext()
    /*display liked movies, if no liked movies, display message*/
    if (likes && likes.length > 0) {
        return (
            <div className="likes">
                <h2>Your Liked Movies</h2>
                    <div className="movies-array">
                            <div className="movie-array">
                                {likes.map((movie) => (
                                    <MovieDisplay movie={movie} key={movie.id} />
                                ))}
                            </div>
                </div>
            </div>
        );
    }
    return (
    <div className="likes-empty">
        <h2>You haven't liked any movies yet.</h2>
        <p>Click on the ♡ button to add movies to your likes.</p>
    </div>
    );
}

export default Likes;