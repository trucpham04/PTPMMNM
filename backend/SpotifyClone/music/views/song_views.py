from rest_framework import permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from ..models import Song
from ..serializers.song_serializer import SongSerializer
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from utils.custom_response import custom_response


# -------------------- SONG API --------------------

class SongListCreateView(BaseListCreateView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(ec=0, em="Fetched songs successfully", dt=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return custom_response(ec=0, em="Song created successfully", dt=serializer.data)


class SongDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(ec=0, em="Fetched song detail", dt=serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return custom_response(ec=0, em="Song updated successfully", dt=serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return custom_response(ec=0, em="Song deleted successfully")


class IncreasePlayCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        song.play_count += 1
        song.save()
        return custom_response(ec=0, em="Play count updated!", dt={"play_count": song.play_count})
