from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserFollow

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={'input_type': 'password'}
    )
    is_staff = serializers.BooleanField(default=False)  # Truy cập Admin
    is_superuser = serializers.BooleanField(default=False)  # Toàn quyền Admin
    user_permissions = serializers.PrimaryKeyRelatedField(
        queryset=User.user_permissions.rel.related_model.objects.all(),
        many=True,
        required=False
    )
    groups = serializers.PrimaryKeyRelatedField(
        queryset=User.groups.rel.related_model.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "profile_picture", "bio", "date_of_birth", "country",
            "password", "is_staff", "is_superuser", "user_permissions", "groups"
        ]

class UserFollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    followed = UserSerializer(read_only=True)

    class Meta:
        model = UserFollow
        fields = ['id', 'follower', 'followed', 'followed_at']
