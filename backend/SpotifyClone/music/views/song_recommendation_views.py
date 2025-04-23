from rest_framework import permissions
from ..models import SongRecommendation
from ..serializers.song_recommendation_serializer import SongRecommendationSerializer
from core.views import BaseListCreateView
from utils.custom_response import custom_response

class SongRecommendationListView(BaseListCreateView):
    serializer_class = SongRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SongRecommendation.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(ec=0, em="Fetched song recommendations", dt=serializer.data)
