from rest_framework import serializers
from ..models.user import User
from cloudinary.models import CloudinaryField
from django.contrib.auth import authenticate, get_user_model

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={'input_type': 'password'}
    )
    is_staff = serializers.BooleanField(default=False)
    is_superuser = serializers.BooleanField(default=False)
    """ user_permissions = serializers.PrimaryKeyRelatedField(
        queryset=User.user_permissions.rel.related_model.objects.all(),
        many=True,
        required=False
    )
    groups = serializers.PrimaryKeyRelatedField(
        queryset=User.groups.rel.related_model.objects.all(),
        many=True,
        required=False
    ) """
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "profile_picture", "bio", "date_of_birth", "country",
            "password", "is_staff", "is_superuser", 
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
        validated_data["is_staff"] = False
        validated_data["is_superuser"] = False
        user = User(**validated_data)
        if password:
            user.set_password(password)
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