# food_order_project/products/urls.py

from django.urls import path
from .views import ProductListAPIView, ProductDetailAPIView, like_product

urlpatterns = [
    path('', ProductListAPIView.as_view(), name='product-list'), 
    path('<int:id>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path('<int:pk>/like/', like_product, name='product-like'),
]