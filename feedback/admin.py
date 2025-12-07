# feedback/admin.py
from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'is_visible')
    list_filter = ('is_visible', 'created_at')
    search_fields = ('name', 'text')
    list_editable = ('is_visible',) # Админден тез өзгөртүү үчүн