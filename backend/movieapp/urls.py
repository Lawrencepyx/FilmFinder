from django.urls import path
from . import views

# API URL routing for the movie app
urlpatterns = [
    # POST endpoint: Sync liked movies from frontend to backend DB
    path('api/sync-likes/', views.sync_likes, name='sync_likes'),
    
    # GET endpoint: Retrieve top 3 genres based on liked movies
    path('api/top-genres/', views.top_genres, name='top_genres'),
    
    # GET endpoint: Retrieve top 3 languages based on liked movies
    path('api/top-languages/', views.top_languages, name='top_languages'),
    
    # GET endpoint: Retrieve top 3 decades based on liked movies
    path('api/decade-stats/', views.decade_stats, name='decade_stats'),
]
