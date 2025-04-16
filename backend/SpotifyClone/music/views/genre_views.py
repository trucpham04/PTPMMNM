# music/views/genre_views.py
from rest_framework import generics, status
from ..models import Genre
from ..serializers.genre_serializer import GenreSerializer
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from utils.custom_response import custom_response


class GenreListCreateView(BaseListCreateView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(em="Fetched genres", dt=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_response(em="Genre created successfully", dt=serializer.data)
        return custom_response(ec=1, em="Validation failed", dt=serializer.errors)


class GenreDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(em="Fetched genre detail", dt=serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return custom_response(em="Genre updated successfully", dt=serializer.data)
        return custom_response(ec=1, em="Validation failed", dt=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return custom_response(em="Genre deleted successfully")
