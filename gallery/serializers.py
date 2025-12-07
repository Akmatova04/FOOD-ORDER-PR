# gallery/serializers.py
from rest_framework import serializers
from .models import GalleryItem

class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        # Сиздин моделиңизде 'file' деген талаа жок окшойт, 'image' жана 'video' бар.
        # Ошондуктан fields'ти ошондой калтырабыз.
        fields = ['id', 'item_type', 'title', 'image', 'video', 'uploaded_at'] # 'uploaded_at' кошуп койдук

    # ====================================================================
    # ===            НЕГИЗГИ ОҢДОО: ТОЛУК URL КАЙТАРУУ                ===
    # ====================================================================
    def to_representation(self, instance):
        # Алгач, демейки маалыматтарды алабыз (сөздүк түрүндө)
        representation = super().to_representation(instance)
        
        # Контексттен "request" объектисин алабыз, ал бизге доменди (мис: http://127.0.0.1:8000) берет
        request = self.context.get('request')

        # Эгер "image" талаасында сүрөт болсо, анын толук URL'ин түзөбүз
        if instance.image and hasattr(instance.image, 'url'):
            representation['image'] = request.build_absolute_uri(instance.image.url)
        
        # Эгер "video" талаасында видео болсо, анын толук URL'ин түзөбүз
        if instance.video and hasattr(instance.video, 'url'):
            representation['video'] = request.build_absolute_uri(instance.video.url)
            
        return representation