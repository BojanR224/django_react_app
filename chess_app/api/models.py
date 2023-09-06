from django.db import models
from api.storage import OverwriteStorage


# Create your models here.
class Chess(models.Model):
    image = models.ImageField(upload_to='chess_image', storage=OverwriteStorage())

class Fen(models.Model):
    fen = models.CharField(max_length=100)