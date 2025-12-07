# food_order_project/products/admin.py

from django.contrib import admin
from .models import Category, Product, Review
from django.utils.html import format_html

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'image_tag')
    search_fields = ('name',)

    @admin.display(description='Сүрөт')
    def image_tag(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />')
        return "Сүрөт жок"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 
        'category', 
        'price',
        'expiry_date',
        'is_expired_display',      # <-- Моделден келген логиканы колдонобуз
        'expires_soon_display',    # <-- Моделден келген логиканы колдонобуз
        'is_popular',
        'image_tag'
    )
    
    list_filter = (
        'category', 
        'is_popular',
        'expiry_date'
    )
    
    search_fields = ('name', 'description')
    list_editable = ('price', 'is_popular', 'expiry_date')
    readonly_fields = ('created_at', 'updated_at', 'likes_count')

    # 'is_expired' үчүн админ-панелде көрсөтүүчү метод
    @admin.display(description='Мөөнөтү өткөн', boolean=True)
    def is_expired_display(self, obj):
        return obj.is_expired

    # 'expires_soon' үчүн админ-панелде көрсөтүүчү метод
    @admin.display(description='Жакында мөөнөтү өтөт (7 күн)', boolean=True)
    def expires_soon_display(self, obj):
        return obj.expires_soon

    # Сүрөттү тизмеде көрсөтүү үчүн
    @admin.display(description='Сүрөт')
    def image_tag(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" style="width: 75px; height: 75px; object-fit: cover; border-radius: 5px;" />')
        return "Сүрөт жок"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'rating', 'comment_short', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('comment', 'product__name')
    readonly_fields = ('created_at',)
    
    @admin.display(description='Комментарий')
    def comment_short(self, obj):
        if obj.comment:
            return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
        return '-'