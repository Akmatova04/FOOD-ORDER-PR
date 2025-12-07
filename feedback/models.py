
from django.db import models

class Feedback(models.Model):
    name = models.CharField(max_length=100, verbose_name="Аты")
    text = models.TextField(verbose_name="Пикири")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Датасы")
    is_visible = models.BooleanField(default=True, verbose_name="Көрүнсүнбү")

    def __str__(self):
        return f"{self.name} - {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Сын-пикир"
        verbose_name_plural = "Сын-пикирлер"