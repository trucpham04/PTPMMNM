from django.conf import settings
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, logout, login
from django.views.decorators.csrf import csrf_exempt
from .models import User

@api_view(['POST'])
def register_view(request):
    user_name = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not user_name or not email or not password:
        return Response(
            {'error': 'user_name, email, and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'A user with this email already exists.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(user_name=user_name).exists():
        return Response(
            {'error': 'A user with this user_name already exists.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User(user_name=user_name, email=email)
    user.set_password(password)
    user.save()

    return Response(
        {'message': 'User created successfully'},
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(email=email, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)
    return Response(
        {'message': 'User logged in successfully'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@authentication_classes([]) 
@csrf_exempt
def logout_view(request):

    logout(request)

    return Response(
        {'message': 'Logout successful'},
        status=status.HTTP_200_OK
    )
