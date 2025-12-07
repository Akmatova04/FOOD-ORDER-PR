# food_order_project/orders/models.py

from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
from django.utils import timezone
from django.db.models import Sum



User = get_user_model()

class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'Күтүүдө'),
        ('processing', 'Аткарылууда'),
        ('delivered', 'Жеткирилди'),
        ('cancelled', 'Баш тартылды'),
        ('expired', 'Мөөнөтү өткөн'),
    ]
    
    ORDER_TYPE_CHOICES = [
        ('online', 'Онлайн'),
        ('offline', 'Оффлайн (Касса)'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Накталай'),
        ('card', 'Карта менен'),
        ('online', 'Онлайн (Сайт аркылуу)'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name="Колдонуучу"
    )
    order_date = models.DateTimeField(auto_now_add=True, verbose_name="Заказ берилген күнү")
    
    # === 1-ОҢДОО: "Жеткирүү дареги" милдеттүү эмес ===
    delivery_address = models.CharField(
        max_length=255, 
        verbose_name="Жеткирүү дареги",
        blank=True # "Оффлайн" заказ үчүн бул талаа бош болушу мүмкүн
    )
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Жалпы суммасы")
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending', verbose_name="Статусу")
    order_type = models.CharField(
        max_length=10,
        choices=ORDER_TYPE_CHOICES,
        default='online',
        verbose_name="Заказдын түрү"
    )
    
    # === 2-ОҢДОО: "Төлөм ыкмасы" тандоо түрүнө өттү ===
    payment_method = models.CharField(
        max_length=50,
        choices=PAYMENT_METHOD_CHOICES, # <-- Тандоолор кошулду
        blank=True,
        null=True,
        verbose_name="Төлөм ыкмасы"
    )
    
    is_paid = models.BooleanField(default=False, verbose_name="Төлөндүбү")
    delivered_at = models.DateTimeField(null=True, blank=True, verbose_name="Жеткирилген күнү")
    cancelled_at = models.DateTimeField(null=True, blank=True, verbose_name="Баш тартылган күнү")

    def save(self, *args, **kwargs):
        # "Оффлайн" заказ үчүн жеткирүү дарегин тазалоо
        if self.order_type == 'offline':
            self.delivery_address = ''

        if self.pk:
            try:
                original_order = Order.objects.get(pk=self.pk)
            except Order.DoesNotExist:
                original_order = None

            if original_order and original_order.status != self.status:
                if self.status == 'delivered' and not self.delivered_at:
                    self.delivered_at = timezone.now()
                elif self.status == 'cancelled' and not self.cancelled_at:
                    self.cancelled_at = timezone.now()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Заказ #{self.id} - {self.user.username if self.user else 'Конок'}"

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказдар"
        ordering = ['-order_date']

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name="Заказ")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Продукт")
    quantity = models.IntegerField(default=1, verbose_name="Саны")
    
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True,
        blank=True,
        verbose_name="Бирдигинин баасы"
    )

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Заказ #{self.order.id})"

    @property
    def get_total_item_price(self):
        if self.quantity and self.price is not None:
            return self.quantity * self.price
        return 0

    class Meta:
        verbose_name = "Заказдын элементи"
        verbose_name_plural = "Заказдын элементтери"