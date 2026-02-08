import "../css/TopGenres.css";
import { useState, useEffect } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import { fetchMoviesByGenre } from "../services/api";
import MovieDisplay from "../components/MovieDisplay";


function TopGenres() {
    /*state management*/
    const [topGenres, setTopGenres] = useState([]);
    const [topLanguages, setTopLanguages] = useState([]);
    const [topDecades, setTopDecades] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalLikes, setTotalLikes] = useState(0);
    const { likes } = useMovieContext();

    useEffect(() => {
        const syncAndFetchData = async () => {
            try {
                setLoading(true);
                
                /*sync likes to django*/
                await fetch('http://localhost:8000/api/sync-likes/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ likes })
                });

                /*get top genres*/
                const genresResponse = await fetch('http://localhost:8000/api/top-genres/');
                const genresData = await genresResponse.json();
                
                /*get top languages*/
                const languagesResponse = await fetch('http://localhost:8000/api/top-languages/');
                const languagesData = await languagesResponse.json();
                
                /*get top decades*/
                const decadesResponse = await fetch('http://localhost:8000/api/decade-stats/');
                const decadesData = await decadesResponse.json();
                
                if (genresData.top_genres) {
                    setTopGenres(genresData.top_genres);
                    setTotalLikes(genresData.total_likes || 0);
                    
                    /*get recommendations for #1 genre*/
                    if (genresData.top_genres.length > 0) {
                        const topGenreId = genresData.top_genres[0].id;
                        const movies = await fetchMoviesByGenre(topGenreId);
                        setRecommendations(movies);
                    }
                }
                
                if (languagesData.top_languages) {
                    setTopLanguages(languagesData.top_languages);
                }
                
                if (decadesData.top_decades) {
                    setTopDecades(decadesData.top_decades);
                }
            } catch (err) {
                setError('Failed to load data. Make sure Django server is running on port 8000.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        syncAndFetchData();
    }, [likes]);

    /*loading state*/
    if (loading) {
        return (
            <div className="top-genres">
                <h2>Loading your Movie Wrapped...</h2>
            </div>
        );
    }

    /*empty or error state*/
    if (error || topGenres.length === 0) {
        return (
            <div className="top-genres-empty">
                <h2>No data yet</h2>
                <p>{error || "Like some movies to see your Movie Wrapped!"}</p>
            </div>
        );
    }

    /*success state*/
    return (
        <div className="top-genres">
            <h1 className="wrapped-title">🎬 Movie Wrapped 🎬</h1>
            <p className="subtitle">Based on {totalLikes} liked movies</p>
            
            {/*top 3 Genres */}
            <section className="wrapped-section">
                <h2>Your Top 3 Genres</h2>
                <div className="genres-list">
                    {topGenres.map((genre, index) => (
                        <div key={genre.id} className="genre-card">
                            <div className="rank">#{index + 1}</div>
                            <div className="genre-info">
                                <h3>{genre.name}</h3>
                                <p>{genre.count} {genre.count === 1 ? 'movie' : 'movies'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* top 3 Languages */}
            {topLanguages.length > 0 && (
                <section className="wrapped-section">
                    <h2>Your Top 3 Languages</h2>
                    <div className="languages-list">
                        {topLanguages.map((language, index) => (
                            <div key={language.code} className="language-card">
                                <div className="rank">#{index + 1}</div>
                                <div className="language-info">
                                    <h3>{language.name}</h3>
                                    <p>{language.count} {language.count === 1 ? 'movie' : 'movies'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* top 3 Decades */}
            {topDecades.length > 0 && (
                <section className="wrapped-section">
                    <h2>Your Favorite Decades</h2>
                    <div className="decades-list">
                        {topDecades.map((decade, index) => (
                            <div key={decade.decade} className="decade-card">
                                <div className="rank">#{index + 1}</div>
                                <div className="decade-info">
                                    <h3>{decade.decade}</h3>
                                    <p>{decade.count} {decade.count === 1 ? 'movie' : 'movies'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* recommendations based on 1st genre */}
            {recommendations.length > 0 && (
                <section className="wrapped-section">
                    <h2>Recommended {topGenres[0]?.name} Movies</h2>
                    <p className="recommendations-subtitle">Since you love {topGenres[0]?.name}, you might enjoy these:</p>
                    <div className="recommendations-grid">
                        {recommendations.map(movie => (
                            <MovieDisplay key={movie.id} movie={movie} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default TopGenres;
