
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackListAPIView(generics.ListAPIView):
    queryset = Feedback.objects.filter(is_visible=True)
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]


class FeedbackCreateAPIView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]