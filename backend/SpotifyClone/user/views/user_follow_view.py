from rest_framework import permissions, status
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from ..models.user_follow import UserFollow
from ..serializers.user_follow_serializer import UserFollowSerializer
from core.views import BaseListCreateView
from utils.custom_response import custom_response

User = get_user_model()

# Follow / Unfollow người dùng
class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        try:
            user_to_follow = User.objects.get(id=user_id)
            if UserFollow.objects.filter(follower=request.user, followed=user_to_follow).exists():
                return custom_response(ec=1, em="Already following this user")
            UserFollow.objects.create(follower=request.user, followed=user_to_follow)
            return custom_response(em="Follow successful", http_status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return custom_response(ec=1, em="User does not exist", http_status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        try:
            user_to_unfollow = User.objects.get(id=user_id)
            follow = UserFollow.objects.filter(follower=request.user, followed=user_to_unfollow)
            if follow.exists():
                follow.delete()
                return custom_response(em="Unfollow successful")
            return custom_response(ec=1, em="Not following this user")
        except User.DoesNotExist:
            return custom_response(ec=1, em="User does not exist")

# Danh sách người theo dõi
class UserFollowersListView(BaseListCreateView):
    serializer_class = UserFollowSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return UserFollow.objects.filter(followed_id=user_id)

# Danh sách người đang theo dõi
class UserFollowingListView(BaseListCreateView):
    serializer_class = UserFollowSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return UserFollow.objects.filter(follower_id=user_id)
