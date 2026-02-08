import "../css/MovieDisplay.css";
import {useMovieContext} from "../contexts/MovieContext"
import { useState } from "react";

function MovieDisplay({movie}) {
    /*similar to a class/component*/
    const {isLiked, addToLikes, removeFromLikes} = useMovieContext()
    const liked = isLiked(movie.id)
    
    // State to track if description is shown
    const [showDescription, setShowDescription] = useState(false)
    
    /*javascript function that runs when you click the like button*/
    function likeMovie(e) { 
        e.stopPropagation()  // Prevent card click when clicking like button
        if (liked) removeFromLikes(movie.id)
        else addToLikes(movie)
    }
    
    // Toggle description visibility when card is clicked
    function toggleDescription() {
        setShowDescription(!showDescription)
    }
    /*css class*/
    /*braces mean variables like f strings in python*/
    /*Display image with data*/
    return <div className={`movie-display ${liked ? "liked" : ""} ${showDescription ? "expanded" : ""}`}>
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
            <div className="movie-overlay">
                <button className={`like-button ${liked ? "active" : ""}`} onClick={likeMovie}>
                    ♡
                </button>
            </div>
        </div>
        <div className="movie-info" onClick={toggleDescription}>
            <h3>{movie.title}</h3>
            <p className="release-date">{new Date(movie.release_date).getFullYear()}</p>
            <p className="rating">★ {movie.vote_average?.toFixed(1)}</p>
            {movie.runtime && <p className="runtime">{movie.runtime} min</p>}
            <p className="view-description">{showDescription ? "Hide Description" : "View Description"}</p>
        </div>
        
        {/* Show description when card is clicked */}
        {showDescription && (
            <div className="movie-description">
                <p>{movie.overview || "No description available."}</p>
            </div>
        )}
    </div>

}

export default MovieDisplay;