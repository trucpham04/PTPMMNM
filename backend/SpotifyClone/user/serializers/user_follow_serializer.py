from rest_framework import serializers
from ..models.user_follow import UserFollow
from ..serializers.user_serializer import UserSerializer  

class UserFollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)  
    followed = UserSerializer(read_only=True)  

    class Meta:
        model = UserFollow
        fields = ['follower', 'followed', 'followed_at']
