const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

// Check if API key is available
if (!API_KEY) {
    console.error('TMDB API key is not configured.')
}


export const fetchPopularMovies = async() => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    const data = await response.json()
    return data.results
};

export const findMovies = async(query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    const data = await response.json()
    return data.results
};

export const fetchMoviesByGenre = async(genreId) => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`)
    const data = await response.json()
    return data.results.slice(0, 5) // Return only top 5 movies
};

