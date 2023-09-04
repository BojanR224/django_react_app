from rest_framework import serializers
from .models import Chess, Fen

class ChessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chess
        fields = ('image',)

class FenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fen
        fields = ('fen',)