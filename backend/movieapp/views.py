from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import LikedMovie
from collections import Counter

# TMDB genre ID to name mapping (official TMDB genre IDs as of 2024)
# Used to convert genre_ids stored in movies to human-readable names
GENRE_MAP = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}

@csrf_exempt  # Allow POST without CSRF token for API endpoint
@require_http_methods(["POST"])
def sync_likes(request):
    """
    API endpoint to sync liked movies from React frontend to Django database.
    
    This replaces all stored likes with the current state from localStorage.
    Called when user visits the Top Genres page.
    
    Request body: { "likes": [{movie_object}, {movie_object}, ...] }
    Response: { "status": "success", "count": 5 }
    """
    try:
        # Parse JSON payload from request body
        data = json.loads(request.body)
        likes = data.get('likes', [])
        
        #clear existing likes to avoid duplicates (full sync strategy)
        LikedMovie.objects.all().delete()
        
        # Insert each liked movie into the database
        for movie in likes:
            LikedMovie.objects.create(
                tmdb_id=movie.get('id'),
                title=movie.get('title', ''),
                genre_ids=movie.get('genre_ids', []),  # Array of genre IDs from TMDB
                poster_path=movie.get('poster_path', ''),
                overview=movie.get('overview', ''),
                release_date=movie.get('release_date', ''),
                vote_average=movie.get('vote_average', 0),
                original_language=movie.get('original_language', 'en')  # Save language code
            )
        
        return JsonResponse({'status': 'success', 'count': len(likes)})
    except Exception as e:
        # Return error details for debugging
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@require_http_methods(["GET"])
def top_genres(request):
    """
    API endpoint to calculate and return the top 3 most-liked genres.
    
    Algorithm:
    1. Retrieve all liked movies from database
    2. Count occurrences of each genre_id across all movies
    3. Return top 3 genres sorted by count (descending)
    
    Response: {
        "top_genres": [{"id": 28, "name": "Action", "count": 5}, ...],
        "total_likes": 12
    }
    """
    try:
        # Fetch all liked movies from database
        liked_movies = LikedMovie.objects.all()
        
        # Handle empty case - user hasn't liked any movies yet
        if not liked_movies:
            return JsonResponse({
                'top_genres': [],
                'message': 'No liked movies yet'
            })
        
        # Count how many times each genre appears across all liked movies
        # will double count movies
        genre_counter = Counter()
        for movie in liked_movies:
            for genre_id in movie.genre_ids:
                genre_counter[genre_id] += 1
        
        #get 3 most common genres
        top_3 = genre_counter.most_common(3)
        
        #map genre IDs to names and format response
        top_genres_data = [
            {
                'id': genre_id,
                'name': GENRE_MAP.get(genre_id, 'Unknown'),  # Lookup name or default to 'Unknown'
                'count': count
            }
            for genre_id, count in top_3
        ]
        
        return JsonResponse({
            'top_genres': top_genres_data,
            'total_likes': liked_movies.count()
        })
    except Exception as e:
        #log and return server error
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@require_http_methods(["GET"])
def top_languages(request):
    """
    API endpoint to calculate and return the top 3 most-liked languages.
    
    Response: {
        "top_languages": [{"code": "en", "name": "English", "count": 10}, ...]
    }
    """
    # Language code to name mapping
    LANGUAGE_MAP = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'hi': 'Hindi',
        'ar': 'Arabic',
    }
    
    try:
        liked_movies = LikedMovie.objects.all()
        
        if not liked_movies:
            return JsonResponse({'top_languages': []})
        
        # Count language appearances
        language_counter = Counter()
        for movie in liked_movies:
            # Get original_language from the movie data if available
            # We need to store this in the model first
            lang = getattr(movie, 'original_language', 'en')
            if lang:
                language_counter[lang] += 1
        
        # Get top 3 languages
        top_3 = language_counter.most_common(3)
        
        top_languages_data = [
            {
                'code': lang_code,
                'name': LANGUAGE_MAP.get(lang_code, lang_code.upper()),
                'count': count
            }
            for lang_code, count in top_3
        ]
        
        return JsonResponse({'top_languages': top_languages_data})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@require_http_methods(["GET"])
def decade_stats(request):
    """
    API endpoint to calculate and return the top 3 most-liked decades.
    
    Response: {
        "top_decades": [{"decade": "1990s", "count": 8}, ...]
    }
    """
    try:
        liked_movies = LikedMovie.objects.all()
        
        if not liked_movies:
            return JsonResponse({'top_decades': []})
        
        #decade counting
        decade_counter = Counter()
        for movie in liked_movies:
            if movie.release_date:
                try:
                    # get year from release_date (format: YYYY-MM-DD)
                    year = int(movie.release_date.split('-')[0])
                    # Calculate decade 
                    decade = (year // 10) * 10
                    decade_counter[decade] += 1
                except (ValueError, IndexError):
                    continue
        
        #get top 3 decades
        top_3 = decade_counter.most_common(3)
        
        top_decades_data = [
            {
                'decade': f"{decade}s",
                'count': count
            }
            for decade, count in top_3
        ]
        
        return JsonResponse({'top_decades': top_decades_data})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
