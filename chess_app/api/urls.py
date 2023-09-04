from django.urls import path, include
from .views import PostImageView, ChessView, GetBestPositions

urlpatterns = [
    path('', ChessView.as_view()),
    path('send-image', PostImageView.as_view()),
    path('get-best-positions', GetBestPositions.as_view())
]
