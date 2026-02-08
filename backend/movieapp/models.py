from django.db import models


class LikedMovie(models.Model):
    """
    Model to store user's liked movies with their TMDB metadata.
    
    This model persists movie data from the frontend to enable
    backend analytics like top genre calculations.
    """
    # TMDB unique identifier for the movie
    tmdb_id = models.IntegerField(unique=True)
    
    # Movie metadata from TMDB API
    title = models.CharField(max_length=500)
    genre_ids = models.JSONField(default=list)  # Array of TMDB genre IDs (e.g., [28, 12, 878])
    poster_path = models.CharField(max_length=500, null=True, blank=True)  # Path to poster image
    overview = models.TextField(blank=True)  # Movie description/synopsis
    release_date = models.CharField(max_length=50, blank=True)  # Format: YYYY-MM-DD
    vote_average = models.FloatField(default=0)  # TMDB rating (0-10)
    
    # Timestamp when user liked this movie
    liked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Order by most recently liked first
        ordering = ['-liked_at']
    
    def __str__(self):
        """Human-readable representation for admin panel"""
        return f"{self.title} ({self.tmdb_id})"
