from django.contrib.auth import get_user_model, login, authenticate 
from django.contrib.auth.hashers import make_password
from rest_framework import permissions, status
from rest_framework.views import APIView
from cloudinary.uploader import upload
from ..models.user import User
from ..serializers.user_serializer import UserSerializer, RegisterSerializer, LoginSerializer
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.authtoken.models import Token
from utils.custom_response import custom_response

User = get_user_model()

# Đăng ký người dùng mới
@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                token, _ = Token.objects.get_or_create(user=user)
                return custom_response(em="User created successfully", dt={
                    "token": token.key,
                    "user_id": user.id,
                    "username": user.username
                })
            except Exception as e:
                return custom_response(ec=1, em="Database error", dt=str(e))

        return custom_response(ec=1, em="Validation error", dt=serializer.errors)


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return custom_response(em="Login successful", dt={
                "token": token.key,
                "user_id": user.id,
                "username": user.username
            })

        return custom_response(ec=1, em="Validation error", dt=serializer.errors)


class UserListCreateView(BaseListCreateView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    """ permission_classes = [permissions.AllowAny] """

    def perform_create(self, serializer):
        password = serializer.validated_data.pop('password', None)
        profile_picture = self.request.FILES.get('profile_picture')

        user = serializer.save(password=make_password(password) if password else None)
        if profile_picture:
            upload_result = upload(profile_picture)
            user.profile_picture = upload_result['secure_url']
            user.save()


class UserDetailUpdateDeleteView(BaseRetrieveUpdateDestroyView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    """ permission_classes = [permissions.AllowAny] """

    def perform_update(self, serializer):
        password = serializer.validated_data.pop('password', None)
        profile_picture = self.request.FILES.get('profile_picture')

        user = serializer.save()
        if password:
            user.set_password(password)
            user.save()
        if profile_picture:
            upload_result = upload(profile_picture)
            user.profile_picture = upload_result['secure_url']
            user.save()


class UserDetailByIDView(APIView):
    """ permission_classes = [permissions.AllowAny] """

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return custom_response(em="User found", dt=serializer.data)
        except User.DoesNotExist:
            return custom_response(ec=1, em="User not found")


