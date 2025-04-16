from django.db import models
from user.models import User
from music.models import Song

# Song Recommendation Model
class SongRecommendation(models.Model):
    RECOMMENDATION_TYPES = (
        ('listening_history', 'Based on Listening History'),
        ('similar_users', 'Based on Similar Users'),
        ('genre_preference', 'Based on Genre Preference'),
        ('trending', 'Trending Songs'),
        ('new_release', 'New Releases'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='recommended_to')
    recommendation_type = models.CharField(max_length=30, choices=RECOMMENDATION_TYPES)
    score = models.FloatField()  # Relevance score for recommendation
    reason = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'song', 'recommendation_type')
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['score']),
            models.Index(fields=['is_seen']),
            models.Index(fields=['created_at']),
        ]