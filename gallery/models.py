# gallery/models.py
from django.db import models

class GalleryItem(models.Model):
    ITEM_TYPE_CHOICES = [
        ('image', 'Сүрөт'),
        ('video', 'Видео'),
    ]
    item_type = models.CharField(max_length=10, choices=ITEM_TYPE_CHOICES, default='image')
    title = models.CharField(max_length=100, verbose_name="Аталышы")
    image = models.ImageField(upload_to='gallery_images/', blank=True, null=True, verbose_name="Сүрөт (эгер сүрөт болсо)")
    video = models.FileField(upload_to='gallery_videos/', blank=True, null=True, verbose_name="Видео (эгер видео болсо)")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title