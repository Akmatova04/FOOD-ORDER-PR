from django.urls import path
from .views import (
    OrderCreateAPIView, 
    OrderListAPIView, 
    CancelOrderAPIView, 
    dashboard_stats
)

urlpatterns = [
    # ====================================================================
    # === БАРДЫК ЗАКАЗДАРДЫН ТИЗМЕСИ ҮЧҮН ЖАҢЫ ЖОЛ (/api/orders/)   ===
    # ====================================================================
    path('', OrderListAPIView.as_view(), name='order-list'),

    # Бул сиздин мурунку жолдоруңуз, алар өзгөрүүсүз калат
    path('create/', OrderCreateAPIView.as_view(), name='order-create'),
    path('history/', OrderListAPIView.as_view(), name='order-history'), # Бул да кала берсин, зыяны жок
    path('<int:pk>/cancel/', CancelOrderAPIView.as_view(), name='order-cancel'),
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
]