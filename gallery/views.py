# gallery/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import GalleryItem
from .serializers import GalleryItemSerializer

class GalleryListAPIView(generics.ListAPIView):
    queryset = GalleryItem.objects.all().order_by('-uploaded_at')
    serializer_class = GalleryItemSerializer
    permission_classes = [AllowAny]