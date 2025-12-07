

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static 
from products.views import CategoryListAPIView
from django.http import HttpResponse

def api_home(request):
    return HttpResponse("<h1>FoodiSlice API Server</h1><p>API is running.</p>", content_type="text/html")

urlpatterns = [

    path('admin/', admin.site.urls),
    
    path('api/products/', include('products.urls')), 
    path('api/orders/', include('orders.urls')), 
    path('api/categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('api/accounts/', include('accounts.urls')),
    path('api/feedback/', include('feedback.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('', api_home),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
