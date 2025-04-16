from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from cloudinary.models import CloudinaryField
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

class User(AbstractUser):
    profile_picture = CloudinaryField('profile_pictures', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    
    """ groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True) """
    """user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True) """

    class Meta:
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile_picture", "bio", "date_of_birth", "country"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)  # Hash mật khẩu đúng cách
        user.save()
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        return {"user": user}