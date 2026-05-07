from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        print(f"Registration attempt: username={username}, email={email}")  # Отладка
        
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if email and User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, email=email, password=password)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        print(f"Login attempt: username={username}")  # Отладка
        
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logged out successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_cart(request):
    return Response({'message': 'Cart synced'})
