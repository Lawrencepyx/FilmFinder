# FilmFinder
A React web app displaying a database of movies using The Movie Database (TMDB) API.

## Features
- Browse popular movies
- Search for movies
- Like/unlike movies with heart button
- Persistent likes stored in localStorage
- Movie information including ratings, release year, and runtime
- Responsive design with compact movie cards

## Technologies Used
- React + Vite
- The Movie Database (TMDB) API
- React Router for navigation
- Context API for state management
- CSS3 for styling

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Add your TMDB API key to `.env` file:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```
4. Run the development server: `npm run dev`

## API Key
This app uses The Movie Database (TMDB) API. Get your free API key at [themoviedb.org](https://www.themoviedb.org/documentation/api).