"""
URL configuration for zyro_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from api import views
from api.views import OrderViewSet, ReviewViewSet
from api.views import chat_bot
from api.auth_views import register, login, logout, get_user, sync_cart

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/featured/', views.featured_products),
    path('api/recommended/', views.recommended_products),
    path('api/chat/', chat_bot, name='chat-bot'),
    path('api/auth/register/', register, name='register'),
    path('api/auth/login/', login, name='login'),
    path('api/auth/logout/', logout, name='logout'),
    path('api/auth/user/', get_user, name='get_user'),
    path('api/auth/sync-cart/', sync_cart, name='sync-cart'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)