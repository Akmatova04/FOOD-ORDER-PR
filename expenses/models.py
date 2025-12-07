
from django.db import models

class Expense(models.Model):
    EXPENSE_CATEGORY_CHOICES = [('salary', 'Айлык акы'), ('rent', 'Ижара акысы'), ('marketing', 'Маркетинг'), ('raw_materials', 'Чийки заттар'), ('utilities', 'Коммуналдык кызматтар'), ('other', 'Башка')]
    category = models.CharField(max_length=50, choices=EXPENSE_CATEGORY_CHOICES, verbose_name="Категориясы")
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Суммасы")
    description = models.TextField(blank=True, null=True, verbose_name="Сүрөттөмөсү")
    date = models.DateTimeField(auto_now_add=True, verbose_name="Датасы")

    def __str__(self):
        return f"{self.get_category_display()} - {self.amount} KGS"

    class Meta:
        verbose_name = "Чыгаша"
        verbose_name_plural = "Чыгашалар"
        ordering = ['-date']