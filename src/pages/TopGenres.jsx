import "../css/TopGenres.css";
import { useState, useEffect } from "react";
import { useMovieContext } from "../contexts/MovieContext";

/**
 * TopGenres Component
 * 
 * Displays the user's top 3 favorite movie genres based on their liked movies.
 * Syncs likes to Django backend and fetches genre analytics.
 */
function TopGenres() {
    // State management for genre data and UI states
    const [topGenres, setTopGenres] = useState([]);  // Array of top 3 genres
    const [loading, setLoading] = useState(true);     // Loading indicator
    const [error, setError] = useState(null);         // Error message
    const [totalLikes, setTotalLikes] = useState(0);  // Total count of liked movies
    
    // Get likes from global context (stored in localStorage)
    const { likes } = useMovieContext();

    /**
     * Effect: Sync likes and fetch top genres whenever likes change
     * 
     * Two-step process:
     * 1. POST likes to Django to sync database
     * 2. GET top genres calculated by Django backend
     */
    useEffect(() => {
        const syncAndFetchGenres = async () => {
            try {
                setLoading(true);
                
                // Step 1: Sync current likes from localStorage to Django DB
                await fetch('http://localhost:8000/api/sync-likes/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ likes })  // Send likes array to backend
                });

                // Step 2: Fetch top 3 genres calculated by Django
                const response = await fetch('http://localhost:8000/api/top-genres/');
                const data = await response.json();
                
                // Update state with fetched data
                if (data.top_genres) {
                    setTopGenres(data.top_genres);
                    setTotalLikes(data.total_likes || 0);
                } else {
                    setError(data.message || 'No genres found');
                }
            } catch (err) {
                // Handle network errors (e.g., Django server not running)
                setError('Failed to load top genres. Make sure Django server is running on port 8000.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        syncAndFetchGenres();
    }, [likes]);  // Re-run when likes array changes

    // Loading state: Show loading message while fetching data
    if (loading) {
        return (
            <div className="top-genres">
                <h2>Loading your top genres...</h2>
            </div>
        );
    }

    // Empty/Error state: Show message if no data or error occurred
    if (error || topGenres.length === 0) {
        return (
            <div className="top-genres-empty">
                <h2>No genre data yet</h2>
                <p>{error || "Like some movies to see your top genres!"}</p>
            </div>
        );
    }

    // Success state: Render top 3 genres with gradient cards
    return (
        <div className="top-genres">
            <h2>Your Top 3 Favorite Genres</h2>
            <p className="subtitle">Based on {totalLikes} liked movies</p>
            
            <div className="genres-list">
                {/* Map over top 3 genres and render a card for each */}
                {topGenres.map((genre, index) => (
                    <div key={genre.id} className="genre-card">
                        {/* Rank number (#1, #2, #3) */}
                        <div className="rank">#{index + 1}</div>
                        
                        {/* Genre name and movie count */}
                        <div className="genre-info">
                            <h3>{genre.name}</h3>
                            <p>{genre.count} {genre.count === 1 ? 'movie' : 'movies'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopGenres;
