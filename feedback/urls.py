
from django.urls import path
from .views import FeedbackListAPIView, FeedbackCreateAPIView

urlpatterns = [
    path('', FeedbackListAPIView.as_view(), name='feedback-list'),
    path('create/', FeedbackCreateAPIView.as_view(), name='feedback-create'),
]