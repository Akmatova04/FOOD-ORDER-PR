# food_order_project/products/serializers.py

from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    
    # Моделдеги @property методдорун API'ге кошуу үчүн
    is_expired = serializers.BooleanField(read_only=True)
    expires_soon = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        # 'fields' тизмесине жаңы талааларды кошобуз
        fields = [
            'id', 
            'category', 
            'name', 
            'description', 
            'price', 
            'image', 
            'is_popular',
            'is_expired',     # <-- Кошулду
            'expires_soon',  # <-- Кошулду
            'expiry_date',
            'likes_count'
        ]