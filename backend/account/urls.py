from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib import messages
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
import json

# API Views
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """API endpoint for user login"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
    else:
        return Response({
            'error': 'Invalid username or password'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_signup(request):
    """API endpoint for user registration"""
    username = request.data.get('username')
    password = request.data.get('password')
    password_confirm = request.data.get('password_confirm')
    email = request.data.get('email', '')
    
    # Validation
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if password != password_confirm:
        return Response({
            'error': 'Passwords do not match'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({
            'error': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if email and User.objects.filter(email=email).exists():
        return Response({
            'error': 'Email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create user
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User created successfully',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Failed to create user: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    """API endpoint for user logout"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Successfully logged out'
        })
    except Exception as e:
        return Response({
            'error': 'Failed to logout'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_profile(request):
    """Get current user profile"""
    user = request.user
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined,
        }
    })

# Legacy template-based views (for backward compatibility)
def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard')
        else:
            messages.error(request, "Invalid username or password")
    else:
        form = AuthenticationForm()
    
    return render(request, 'account/login.html', {'form': form})

def signup_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
        else:
            # Add form errors to messages
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = UserCreationForm()
    
    return render(request, 'account/signup.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')