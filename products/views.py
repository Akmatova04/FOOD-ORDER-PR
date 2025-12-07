# food_order_project/products/views.py

from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from django.db.models import F, Q
from django.utils import timezone

# 1. Бардык категориялардын тизмесин кайтаруучу API
class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

# 2. Товарлардын тизмесин кайтаруучу API
class ProductListAPIView(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Мөөнөтү өткөн жана стокто жок товарларды чыгарбайбыз
        return Product.objects.filter(
            Q(expiry_date__gte=timezone.now().date()) | Q(expiry_date__isnull=True),
            stock_quantity__gt=0
        ).order_by('-created_at')

# 3. Бир товардын деталдуу маалыматын кайтаруучу API
class ProductDetailAPIView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]

# 4. Товарды "жактыруу" үчүн API
@api_view(['PATCH'])
@permission_classes([AllowAny])
def like_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Продукт табылган жок'}, status=status.HTTP_404_NOT_FOUND)

    product.likes_count = F('likes_count') + 1
    product.save()
    product.refresh_from_db()
    
    return Response({'likes_count': product.likes_count}, status=status.HTTP_200_OK)