# food_order_project/orders/admin.py

from django.contrib import admin
from .models import Order, OrderItem
from django.db.models import Sum, Q  # <-- Q объектисин импорт кылабыз

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    raw_id_fields = ('product',)
    readonly_fields = ('get_total_item_price',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Сиздин мурунку жөндөөлөрүңүз өзгөрүүсүз калат
    list_display = ('id', 'user', 'order_date', 'total_amount', 'status', 'is_paid')
    list_filter = ('status', 'is_paid', 'order_date')
    search_fields = ('user__username', 'delivery_address', 'id')
    date_hierarchy = 'order_date'
    inlines = [OrderItemInline]
    readonly_fields = ('order_date', 'delivered_at', 'cancelled_at', 'total_amount')
    list_editable = ('status', 'is_paid')
    
    # ====================================================================
    # ===   СУММАЛАРДЫ СТАТУС БОЮНЧА БӨЛҮП ЭСЕПТӨӨЧҮ ТОЛУК КОД       ===
    # ====================================================================
    def changelist_view(self, request, extra_context=None):
        # Django'нун стандарттык view'ун чакырабыз
        response = super().changelist_view(request, extra_context)

        # Ката кетпеши үчүн, queryset'ти коопсуз жол менен алабыз
        try:
            qs = response.context_data['cl'].queryset
        except (AttributeError, KeyError):
            return response

        # Ар бир статус боюнча суммаларды жана жалпы сумманы бир сурам менен эсептейбиз
        totals = qs.aggregate(
            total_delivered=Sum('total_amount', filter=Q(status='delivered')),
            total_cancelled=Sum('total_amount', filter=Q(status='cancelled')),
            total_pending=Sum('total_amount', filter=Q(status='pending')),
            total_processing=Sum('total_amount', filter=Q(status='processing')),
            grand_total=Sum('total_amount') # Баарынын жалпы суммасы
        )

        # Эсептелген суммаларды шаблонго жөнөтүү үчүн даярдайбыз
        extra_context = extra_context or {}
        extra_context['totals'] = {
            'delivered': totals.get('total_delivered') or 0,
            'cancelled': totals.get('total_cancelled') or 0,
            'pending': totals.get('total_pending') or 0,
            'processing': totals.get('total_processing') or 0,
            'grand_total': totals.get('grand_total') or 0,
        }
        
        # extra_context'ти колдонуу үчүн view'ду кайра чакырабыз
        return super().changelist_view(request, extra_context=extra_context)