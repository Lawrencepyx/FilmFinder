# FilmFinder - React Movie App with Django Backend

A movie browsing app that uses The Movie Database (TMDB) API with a Django backend for tracking your favorite genres.

## Features

- Browse popular movies from TMDB
- Search for movies
- Like/unlike movies with heart button
- View your liked movies collection
- **Movie Wrapped** find out your 3 most-liked genres, preferred languages, movie suggestions, and release decades. (powered by Django backend)
- Persistent likes stored in localStorage and synced to backend
- Movie information including ratings, release year, description, and runtime
- Responsive design with compact movie cards

## Tech Stack

- **Frontend:** React + Vite, React Router, Context API for state management
- **Backend:** Django 4.2 + Django CORS Headers
- **Database:** SQLite (development)
- **API:** The Movie Database (TMDB) API
- **Styling:** CSS3

## Prerequisites

- Node.js and npm
- Python 3.9+
- TMDB API key (get from [themoviedb.org](https://www.themoviedb.org/settings/api))

## Setup Instructions

### Frontend Setup

1. Navigate to project directory:
   ```bash
   cd ReactMovieApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the root:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

4. Start React dev server:
   ```bash
   npm run dev
   ```
   The app will run on http://localhost:5173 (or 5174 if 5173 is busy)

### Backend Setup

1. In the ReactMovieApp directory, install Python packages:
   ```bash
   pip install django django-cors-headers
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Start Django server:
   ```bash
   python manage.py runserver
   ```
   The backend will run on http://localhost:8000

## Usage

1. **Start both servers** (Django on port 8000, React on port 5173/5174)
2. Browse movies on the Home page
3. Search for specific movies
4. Click the ♡ button to like movies
5. Visit the **Likes** page to see your liked movies
6. Visit the **Movie Wrapped** page to see data on the type of your liked movies, with suggestions, similar to Spoitfy Wrapped
## API Endpoints

- `POST /api/sync-likes/` - Sync liked movies from frontend to backend
- `GET /api/top-genres/` - Get top 3 genres based on liked movies

## Project Structure

```
backend/        #backend code
src/            #frontend code
```

## How It Works

- Likes are stored in **localStorage** for instant frontend access
- When you visit the **Movie Wrapped** page, likes are synced to the Django backend
- Django calculates which genres appear most frequently in your liked movies
- The top 3 genres are displayed with beautiful gradient cards showing the count
- Genre mapping uses TMDB's official genre IDs

