# food_order_project/orders/views.py
from rest_framework import generics, status, views
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Order, OrderItem
from products.models import Product
from expenses.models import Expense 
from .serializers import OrderSerializer
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

class OrderListAPIView(generics.ListAPIView):
    queryset = Order.objects.all().order_by('-order_date')
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

class CancelOrderAPIView(views.APIView):
    permission_classes = [AllowAny]
    def patch(self, request, pk, format=None):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Заказ табылган жок'}, status=status.HTTP_404_NOT_FOUND)
        if order.status != 'pending':
            return Response({'error': 'Бул заказды жокко чыгаруу мүмкүн эмес.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'cancelled'
        order.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    today = timezone.now().date()
    start_of_day = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.min.time()))
    end_of_day = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.max.time()))
    last_30_days = timezone.make_aware(timezone.datetime.combine(today - timedelta(days=30), timezone.datetime.min.time()))

    todays_orders = Order.objects.filter(order_date__range=(start_of_day, end_of_day))
    monthly_orders = Order.objects.filter(order_date__gte=last_30_days)
    
    todays_sales = todays_orders.aggregate(total=Sum('total_amount'))['total'] or 0.0
    monthly_sales = monthly_orders.aggregate(total=Sum('total_amount'))['total'] or 0.0
    monthly_online_sales = monthly_orders.filter(order_type='online').aggregate(total=Sum('total_amount'))['total'] or 0.0
    monthly_offline_sales = monthly_orders.filter(order_type='offline').aggregate(total=Sum('total_amount'))['total'] or 0.0
    
    monthly_expenses = Expense.objects.filter(date__gte=last_30_days).aggregate(total=Sum('amount'))['total'] or 0.0

    stats_data = {
        'todays_sales': f"{todays_sales:.2f}",
        'todays_order_count': todays_orders.count(),
        'monthly_sales': f"{monthly_sales:.2f}",
        'monthly_online_sales': f"{monthly_online_sales:.2f}",
        'monthly_offline_sales': f"{monthly_offline_sales:.2f}",
        'monthly_expenses': f"{monthly_expenses:.2f}",
        'monthly_profit': f"{monthly_sales - monthly_expenses:.2f}",
    }
    return Response(stats_data)
