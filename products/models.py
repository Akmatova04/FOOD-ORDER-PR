# food_order_project/products/models.py

from django.db import models
from django.utils import timezone
from datetime import timedelta

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Категориянын аталышы")
    image = models.ImageField(upload_to='category_images/', blank=True, null=True, verbose_name="Категориянын сүрөтү")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категориялар"

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Категория")
    name = models.CharField(max_length=200, verbose_name="Продукттун аталышы")
    description = models.TextField(blank=True, null=True, verbose_name="Сүрөттөмөсү")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Баасы")
    image = models.ImageField(upload_to='product_images/', verbose_name="Продукттун сүрөтү")
    is_popular = models.BooleanField(default=False, verbose_name="Популярдуу")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Өздүк наркы")

    production_date = models.DateField(null=True, blank=True, verbose_name="Өндүрүлгөн күнү")
    expiry_date = models.DateField(null=True, blank=True, verbose_name="Жарактуулук мөөнөтү")
    stock_quantity = models.IntegerField(default=0, verbose_name="Стоктогу саны")
    likes_count = models.IntegerField(default=0, verbose_name="Жактыруулардын саны")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Түзүлгөн күнү")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Жаңыртылган күнү")

    def __str__(self):
        return self.name

    @property
    def is_expired(self):
        """Продуктунун жарактуулук мөөнөтү өтүп кеткенби же жокпу текшерет."""
        if self.expiry_date and self.expiry_date < timezone.now().date():
            return True
        return False

    @property
    def expires_soon(self):
        """Жарактуулук мөөнөтү жакындап калганбы (мисалы, 7 күндүн ичинде)."""
        if self.expiry_date:
            # Эгер мөөнөтү өтүп кеткен болсо, ал "жакында өтөт" деп эсептелбейт
            if self.is_expired:
                return False
            # Эгер мөөнөтү келечекте, бирок 7 күндүн ичинде болсо
            return timezone.now().date() <= self.expiry_date <= (timezone.now().date() + timedelta(days=7))
        return False

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продуктулар"
        ordering = ['name']

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name="Продукт")
    # user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Колдонуучу")
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], verbose_name="Рейтинг")
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Түзүлгөн күнү")

    def __str__(self):
        return f'{self.product.name} - {self.rating} жылдыз'

    class Meta:
        verbose_name = "Сын-пикир"
        verbose_name_plural = "Сын-пикирлер"
        ordering = ['-created_at']