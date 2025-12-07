# gallery/admin.py
from django.contrib import admin
from .models import GalleryItem

@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'item_type', 'uploaded_at')
    list_filter = ('item_type',)