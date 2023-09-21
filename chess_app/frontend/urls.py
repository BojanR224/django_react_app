from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('chess', index),
    path('capture', index),
    path('test', index),
    path('loading', index),
    path('edit', index),
]