from rest_framework import permissions
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from playlist.models import Collection
from playlist.serializers.collection_serializer import CollectionSerializer
from utils.custom_response import custom_response  # Import custom_response

class CollectionListCreateView(BaseListCreateView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return custom_response(dt=serializer.data, em="Collections retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Collection created successfully")
        return custom_response(ec=1, em="Failed to create collection", dt=serializer.errors)

class CollectionDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return custom_response(dt=serializer.data, em="Collection details retrieved successfully")

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Collection updated successfully")
        return custom_response(ec=1, em="Failed to update collection", dt=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return custom_response(em="Collection deleted successfully")
