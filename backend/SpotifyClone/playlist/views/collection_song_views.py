from rest_framework import permissions
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from playlist.models import CollectionSong
from playlist.serializers.collection_song_serializer import CollectionSongSerializer
from utils.custom_response import custom_response  # Import custom_response

class CollectionSongListCreateView(BaseListCreateView):
    queryset = CollectionSong.objects.all()
    serializer_class = CollectionSongSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return custom_response(dt=serializer.data, em="Collection songs retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Collection song added successfully")
        return custom_response(ec=1, em="Failed to add collection song", dt=serializer.errors)

class CollectionSongDetailView(BaseRetrieveUpdateDestroyView):
    queryset = CollectionSong.objects.all()
    serializer_class = CollectionSongSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return custom_response(dt=serializer.data, em="Collection song details retrieved successfully")

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Collection song updated successfully")
        return custom_response(ec=1, em="Failed to update collection song", dt=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return custom_response(em="Collection song deleted successfully")
