from django.urls import path
from .views import RegisterAPIView, CustomAuthToken

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
]