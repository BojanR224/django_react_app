from django.urls import path, include
from .views import PostImageView, ChessView, GetBestPositions

urlpatterns = [
    path('', ChessView.as_view()),
    path('send-image', PostImageView.as_view()),
    path('get-chess-statistics', GetBestPositions.as_view())
]
