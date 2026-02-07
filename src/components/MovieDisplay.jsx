import "../css/MovieDisplay.css";
import {useMovieContext} from "../contexts/MovieContext"

function MovieDisplay({movie}) {
    /*similar to a class/component*/
    const {isLiked, addToLikes, removeFromLikes} = useMovieContext()
    const liked = isLiked(movie.id)
    
    /*javascript function that runs when you click the like button*/
    function likeMovie(e) { 
        e.preventDefault()
        if (liked) removeFromLikes(movie.id)
        else addToLikes(movie)
    }
    /*css class*/
    /*braces mean variables like f strings in python*/
    /*Display image with data*/
    return <div className={`movie-display ${liked ? "liked" : ""}`}>
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
            <div className="movie-overlay">
                <button className={`like-button ${liked ? "active" : ""}`} onClick={likeMovie}>
                    ♡
                </button>
            </div>
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p className="release-date">{new Date(movie.release_date).getFullYear()}</p>
            <p className="rating">★ {movie.vote_average?.toFixed(1)}</p>
            {movie.runtime && <p className="runtime">{movie.runtime} min</p>}
        </div>
    </div>

}

export default MovieDisplay;