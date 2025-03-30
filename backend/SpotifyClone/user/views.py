from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from cloudinary.uploader import upload  # Import Cloudinary
from .models import UserFollow
from .serializers import UserSerializer, UserFollowSerializer
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView

User = get_user_model()

# Lấy danh sách tất cả người dùng + Thêm người dùng mới
class UserListCreateView(BaseListCreateView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        """Hash mật khẩu và upload ảnh Cloudinary"""
        password = serializer.validated_data.pop('password', None)
        profile_picture = self.request.FILES.get('profile_picture')  # Lấy file ảnh

        user = serializer.save(password=make_password(password) if password else None)

        if profile_picture:
            upload_result = upload(profile_picture)  # Upload lên Cloudinary
            user.profile_picture = upload_result['secure_url']  # Lưu link ảnh
            user.save()

# Lấy thông tin chi tiết người dùng theo ID + Cập nhật + Xóa
class UserDetailUpdateDeleteView(BaseRetrieveUpdateDestroyView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_update(self, serializer):
        """Hash mật khẩu nếu có và upload ảnh Cloudinary"""
        password = serializer.validated_data.pop('password', None)
        profile_picture = self.request.FILES.get('profile_picture')  # Lấy file ảnh mới

        user = serializer.save()

        if password:
            user.set_password(password)  # Hash mật khẩu mới
            user.save()

        if profile_picture:
            upload_result = upload(profile_picture)
            user.profile_picture = upload_result['secure_url']
            user.save()

# Follow và Unfollow một người dùng
class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        try:
            user_to_follow = User.objects.get(id=user_id)
            if UserFollow.objects.filter(follower=request.user, followed=user_to_follow).exists():
                return Response({"EC": 1, "EM": "Already following this user", "DT": None}, status=status.HTTP_400_BAD_REQUEST)
            UserFollow.objects.create(follower=request.user, followed=user_to_follow)
            return Response({"EC": 0, "EM": "Follow successful", "DT": None}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"EC": 2, "EM": "User does not exist", "DT": None}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, user_id):
        try:
            user_to_unfollow = User.objects.get(id=user_id)
            follow = UserFollow.objects.filter(follower=request.user, followed=user_to_unfollow)
            if follow.exists():
                follow.delete()
                return Response({"EC": 0, "EM": "Unfollow successful", "DT": None}, status=status.HTTP_200_OK)
            return Response({"EC": 1, "EM": "Not following this user", "DT": None}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"EC": 2, "EM": "User does not exist", "DT": None}, status=status.HTTP_404_NOT_FOUND)

# Lấy danh sách những người đã follow một user (Followers)
class UserFollowersListView(BaseListCreateView):
    serializer_class = UserFollowSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return UserFollow.objects.filter(followed_id=user_id)

# Lấy danh sách những người mà user đang follow (Following)
class UserFollowingListView(BaseListCreateView):
    serializer_class = UserFollowSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return UserFollow.objects.filter(follower_id=user_id)
